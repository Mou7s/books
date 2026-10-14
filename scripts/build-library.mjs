import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, relative } from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const books = JSON.parse(await readFile(join(root, 'books.json'), 'utf8'))
const ids = new Set()
const catalog = []
async function sections(directory, base, locale, id) {
  const items = []
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) items.push(...await sections(path, base, locale, id))
    else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
      const source = await readFile(path, 'utf8')
      if (!source.includes('::reader-text')) continue
      const titleLine = source.match(/^title:\s*(.+)$/m)?.[1]
      if (!titleLine) throw new Error(`Missing chapter title: ${path}`)
      const title = titleLine.startsWith('"') ? JSON.parse(titleLine) : titleLine
      const route = relative(base, path).replaceAll('\\', '/').replace(/\.md$/, '').split('/').map(part => part.replace(/^\d+\./, '')).join('/')
      items.push({ title, path: `/${locale}/books/${id}/${route}`, key: route })
    }
  }
  return items
}
for (const book of books) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(book.id) || ids.has(book.id)) throw new Error(`Invalid or duplicate book ID: ${book.id}`)
  ids.add(book.id)
  const chapters = {}
  for (const locale of ['en', 'zh-cn']) {
    const base = join(root, 'content', locale, 'books', book.id)
    await mkdir(base, { recursive: true })
    chapters[locale] = await sections(base, base, locale, book.id)
  }
  if (!chapters.en.length) throw new Error(`No English chapters for ${book.id}`)
  const firstBilingual = chapters['zh-cn'].find(chapter => chapters.en.some(original => original.key === chapter.key))?.path
  catalog.push({ ...book, chapters, firstBilingual })
  for (const locale of ['en', 'zh-cn']) {
    const chinese = locale === 'zh-cn'
    const base = join(root, 'content', locale, 'books', book.id)
    const title = book.title[locale] || book.title.en
    const links = chapters[locale].map(chapter => `- [${chapter.title}](${chapter.path})`).join('\n')
    const originalLinks = chinese ? '\n\n## 英文原文\n\n' + chapters.en.map(chapter => `- [${chapter.title}](${chapter.path})`).join('\n') : ''
    await writeFile(join(base, '.navigation.yml'), `title: ${JSON.stringify(title)}\n`)
    await writeFile(join(base, 'index.md'), `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(book.author)}\n---\n\n::book-intro\n::\n\n## ${chinese ? '中文译文' : 'Contents'}\n\n${links || (chinese ? '本书暂无中文译文，可先阅读英文原文。' : '')}${originalLinks}\n`)
  }
}
await mkdir(join(root, 'app/data'), { recursive: true })
await writeFile(join(root, 'app/data/library.json'), JSON.stringify(catalog, null, 2) + '\n')
for (const locale of ['en', 'zh-cn']) {
  await writeFile(join(root, 'content', locale, 'index.md'), `---\ntitle: ${locale === 'zh-cn' ? '书架' : 'Bookshelf'}\ndescription: ${locale === 'zh-cn' ? '我的阅读书架 · 原文、译文与双语对照' : 'My reading library · Originals, translations and bilingual reading'}\nnavigation: false\n---\n\n::book-shelf\n::\n`)
}
console.log(`Built library with ${catalog.length} books.`)
