"""Import the supplied EPUB, preserving spine order and validating all text.
Usage: python scripts/import_epub.py path/to/book.epub --id book-id
No third-party Python dependencies required.
"""
import sys, re, json, zipfile, hashlib, argparse
from pathlib import Path
from xml.etree import ElementTree as ET
from html import escape

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('epub')
parser.add_argument('--id', required=True)
parser.add_argument('--title')
parser.add_argument('--author')
args = parser.parse_args()
if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', args.id): parser.error('Invalid book ID')
BOOK_ROOT = ROOT / 'content' / 'books' / args.id
assert BOOK_ROOT.resolve().is_relative_to(ROOT.resolve())
REPORT_ROOT = ROOT / 'imports' / args.id
registry_path = ROOT / 'books.json'
registry = json.loads(registry_path.read_text(encoding='utf-8')) if registry_path.exists() else []
existing = next((book for book in registry if book['id'] == args.id), None)
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
        if tag in ('br', 'hr'):
            result.append(('', '<hr>'))
            return
        if tag in ('script', 'style'): return
        for child in el: visit(child)
    visit(body)
    return result

with zipfile.ZipFile(args.epub) as z:
    container = ET.fromstring(z.read('META-INF/container.xml'))
    opf_path = next(el.get('full-path') for el in container.iter() if local(el.tag) == 'rootfile')
    base = Path(opf_path).parent
    opf = ET.fromstring(z.read(opf_path))
    metadata = opf.find('o:metadata', NS)
    def meta(name): return next((text(el).strip() for el in metadata if local(el.tag) == name), '')
    book_title = args.title or meta('title') or args.id
    author = args.author or meta('creator') or 'Unknown author'
    manifest = {el.get('id'): el for el in opf.findall('o:manifest/o:item', NS)}
    ncx_item = next((v for v in manifest.values() if v.get('media-type') == 'application/x-dtbncx+xml'), None)
    labels = {}
    if ncx_item is not None:
        ncx = ET.fromstring(z.read((base / ncx_item.get('href')).as_posix()))
        labels = {el.find('n:content', NS).get('src').split('#')[0]: el.find('n:navLabel/n:text', NS).text for el in ncx.findall('.//n:navPoint', NS)}
    folders = ['1.read', '2.appendices', '3.publication']
    report = []
    reading = []
    pending = []
    for ref in opf.findall('o:spine/o:itemref', NS):
        entry = manifest[ref.get('idref')]
        href = entry.get('href')
        if entry.get('media-type') != 'application/xhtml+xml' or 'nav' in entry.get('properties', '').split(): continue
        doc = ET.fromstring(z.read((base / href).as_posix()))
        body = next(el for el in doc.iter() if local(el.tag) == 'body')
        parts = blocks(body)
        raw = ''.join(t for t, _ in parts)
        if not raw.strip(): continue
        title = labels.get(href)
        idx = int(re.search(r'split_(\d+)', href).group(1)) if args.id == 'consider-phlebas' else len(report)
        if not title:
            title = ('Title & epigraphs' if idx == 0 else 'Publication information') if args.id == 'consider-phlebas' else next((text(el).strip() for el in body.iter() if local(el.tag) in ('h1', 'h2') and text(el).strip()), f'Section {idx+1}')
        folder = ('2.appendices' if 20 <= idx <= 26 else '3.publication' if idx == 28 else '1.read') if args.id == 'consider-phlebas' else '1.read'
        slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
        if args.id != 'consider-phlebas': slug = f'{idx+1:02d}-' + (slug or 'section')
        page = BOOK_ROOT / folder / f'{idx+1:02d}.{slug}.md'
        html = '\n\n'.join(h for _, h in parts)
        if idx == 0 and args.id == 'consider-phlebas':
            html = '<div class="book-front-matter">\n' + '\n\n'.join(h for t, h in parts if t.strip()) + '\n</div>'
        # Plain HTML within a Vue component keeps the novel's punctuation out of MDC syntax.
        html = html.replace('{{', '&#123;&#123;').replace('}}', '&#125;&#125;')
        pending.append((page, '---\ntitle: ' + json.dumps(title) + '\ndescription: ' + json.dumps(author + ' · ' + book_title) + '\n---\n\n::reader-text\n' + html + '\n::\n'))
        record = {'source': href, 'title': title, 'route': '/books/' + args.id + '/' + folder.split('.',1)[1] + '/' + slug, 'paragraphs': sum(bool(t.strip()) for t,_ in parts), 'words': len(raw.split()), 'text_sha256': hashlib.sha256(raw.encode()).hexdigest()}
        report.append(record)
        if folder == '1.read': reading.append(record)
    assert report, 'No readable sections found'
    assert len({r['route'] for r in report}) == len(report), 'Duplicate chapter routes'
    cover_item = next((v for v in manifest.values() if 'cover-image' in v.get('properties', '').split()), None)
    cover_id = next((el.get('content') for el in metadata if local(el.tag) == 'meta' and el.get('name') == 'cover'), None)
    if cover_item is None and cover_id: cover_item = manifest.get(cover_id)
    cover = (base / cover_item.get('href')).as_posix() if cover_item is not None else next((name for name in z.namelist() if name.endswith('calibre_cover.jpg')), None)
    cover_data = z.read(cover) if cover else None
    # All source parsing succeeds before replacing this book's English text.
    for old in BOOK_ROOT.rglob('*.md'):
        if old.name != 'index.md':
            assert old.resolve().is_relative_to(BOOK_ROOT.resolve())
            old.unlink()
    for page, source in pending:
        page.parent.mkdir(parents=True, exist_ok=True)
        page.write_text(source, encoding='utf-8')
    for folder, title in zip(folders, ['Read the novel', 'Appendices', 'Publication information']):
        path = BOOK_ROOT / folder
        if path.exists(): (path / '.navigation.yml').write_text('title: ' + json.dumps(title) + '\n', encoding='utf-8')
    book = existing or {'id': args.id, 'title': book_title, 'author': author, 'year': meta('date')[:4], 'series': '', 'cover': ''}
    if cover:
        target = ROOT / 'public/books' / args.id / ('cover' + Path(cover).suffix)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(cover_data)
        book['cover'] = f'/books/{args.id}/{target.name}'
    if not existing: registry.append(book)
    registry_path.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    REPORT_ROOT.mkdir(parents=True, exist_ok=True)
    (REPORT_ROOT / 'report.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'pages': len(report), 'reading_sections': len(reading), 'words': sum(r['words'] for r in report), 'paragraphs': sum(r['paragraphs'] for r in report)}))
