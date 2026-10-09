"""Import the supplied EPUB, preserving spine order and validating all text.
Usage: python scripts/import_epub.py path/to/book.epub
No third-party Python dependencies required.
"""
import sys, re, json, zipfile, hashlib
from pathlib import Path
from xml.etree import ElementTree as ET
from html import escape

ROOT = Path(__file__).resolve().parents[1]
NS = {'o': 'http://www.idpf.org/2007/opf', 'n': 'http://www.daisy.org/z3986/2005/ncx/'}
def local(tag): return tag.split('}')[-1]
def text(el): return ''.join(el.itertext())
def inline(el):
    s = escape(el.text or '')
    for c in el:
        tag = local(c.tag)
        inside = inline(c)
        cls = c.get('class', '')
        if tag in ('i', 'em') or 'italic' in cls: inside = '<em>' + inside + '</em>'
        elif tag in ('b', 'strong') or 'bold' in cls: inside = '<strong>' + inside + '</strong>'
        elif tag == 'br': inside = '<br>'
        s += inside + escape(c.tail or '')
    return s

def blocks(body):
    result = []
    def visit(el):
        tag = local(el.tag)
        if tag in ('p', 'blockquote', 'h1', 'h2', 'h3', 'li', 'pre'):
            if text(el).strip():
                # EPUB uses blockquotes for every ordinary narrative paragraph.
                rendered = '<p>' + inline(el) + '</p>'
                result.append((text(el), rendered))
            return
        if tag == 'br':
            result.append(('', '<hr>'))
            return
        if tag in ('script', 'style'): return
        for child in el: visit(child)
    visit(body)
    return result

with zipfile.ZipFile(sys.argv[1]) as z:
    container = ET.fromstring(z.read('META-INF/container.xml'))
    opf_path = next(el.get('full-path') for el in container.iter() if local(el.tag) == 'rootfile')
    base = Path(opf_path).parent
    opf = ET.fromstring(z.read(opf_path))
    manifest = {el.get('id'): el for el in opf.findall('o:manifest/o:item', NS)}
    ncx_item = next(v for v in manifest.values() if v.get('media-type') == 'application/x-dtbncx+xml')
    ncx = ET.fromstring(z.read((base / ncx_item.get('href')).as_posix()))
    labels = {el.find('n:content', NS).get('src').split('#')[0]: el.find('n:navLabel/n:text', NS).text for el in ncx.findall('.//n:navPoint', NS)}
    folders = ['1.read', '2.appendices', '3.publication']
    for folder in folders: (ROOT / 'content' / 'en' / folder).mkdir(parents=True, exist_ok=True)
    for folder in folders:
        for old in (ROOT / 'content' / 'en' / folder).glob('*.md'): old.unlink()
    for folder, title in zip(folders, ['Read the novel', 'Appendices', 'Publication information']):
        (ROOT / 'content' / 'en' / folder / '.navigation.yml').write_text('title: ' + json.dumps(title) + '\n', encoding='utf-8')
    report = []
    reading = []
    for ref in opf.findall('o:spine/o:itemref', NS):
        entry = manifest[ref.get('idref')]
        href = entry.get('href')
        if entry.get('media-type') != 'application/xhtml+xml': continue
        doc = ET.fromstring(z.read((base / href).as_posix()))
        body = next(el for el in doc.iter() if local(el.tag) == 'body')
        parts = blocks(body)
        raw = ''.join(t for t, _ in parts)
        if not raw.strip(): continue
        title = labels.get(href)
        idx = int(re.search(r'split_(\d+)', href).group(1))
        if not title: title = 'Title & epigraphs' if idx == 0 else 'Publication information'
        assert href in labels or idx in (0, 28), f'Missing table-of-contents label: {href}'
        folder = '2.appendices' if 20 <= idx <= 26 else '3.publication' if idx == 28 else '1.read'
        slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
        page = ROOT / 'content' / 'en' / folder / f'{idx+1:02d}.{slug}.md'
        html = '\n\n'.join(h for _, h in parts)
        if idx == 0:
            html = '<div class="book-front-matter">\n' + '\n\n'.join(h for t, h in parts if t.strip()) + '\n</div>'
        # Plain HTML within a Vue component keeps the novel's punctuation out of MDC syntax.
        html = html.replace('{{', '&#123;&#123;').replace('}}', '&#125;&#125;')
        page.write_text('---\ntitle: ' + json.dumps(title) + '\ndescription: "Iain M. Banks · Consider Phlebas"\n---\n\n::reader-text\n' + html + '\n::\n', encoding='utf-8')
        record = {'source': href, 'title': title, 'route': '/en/' + folder.split('.',1)[1] + '/' + slug, 'paragraphs': sum(bool(t.strip()) for t,_ in parts), 'words': len(raw.split()), 'text_sha256': hashlib.sha256(raw.encode()).hexdigest()}
        report.append(record)
        if folder == '1.read': reading.append(record)
    cover = next((name for name in z.namelist() if name.endswith('calibre_cover.jpg')), None)
    if cover: (ROOT / 'public' / 'cover.jpg').write_bytes(z.read(cover))
    links = '\n'.join(f'- [{r["title"]}]({r["route"]})' for r in reading)
    home = '''---
title: Consider Phlebas
description: Iain M. Banks · The Culture, Book One · 1987
---

::u-container{class="py-10 max-w-4xl"}

# Consider Phlebas

:::book-intro
:::

## Contents

''' + links + '\n\n## Appendices\n\n' + '\n'.join(f'- [{r["title"]}]({r["route"]})' for r in report if '/appendices/' in r['route']) + '\n::'
    (ROOT / 'content' / 'en' / 'index.md').write_text(home + '\n', encoding='utf-8')
    (ROOT / 'import-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    assert len({r['route'] for r in report}) == len(report), 'Duplicate chapter routes'
    print(json.dumps({'pages': len(report), 'reading_sections': len(reading), 'words': sum(r['words'] for r in report), 'paragraphs': sum(r['paragraphs'] for r in report)}))
