import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('../', import.meta.url))
const books = JSON.parse(await readFile(join(root, 'books.json'), 'utf8'))
const catalog = []
async function walk(directory, base, id) {
  const chapters = []
  for (const item of (await readdir(directory, { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name, 'en', { numeric:true }))) {
    const path = join(directory, item.name)
    if (item.isDirectory()) chapters.push(...await walk(path, base, id))
    else if (item.name.endsWith('.md') && item.name !== 'index.md') {
      const source = await readFile(path, 'utf8')
      const line = source.match(/^title:\s*(.+)$/m)?.[1]
      const title = line?.startsWith('"') ? JSON.parse(line) : line
      const html = source.match(/::reader-text\s*\n([\s\S]*?)\n::\s*$/)?.[1]
      if (!title || !html) throw Error(`Invalid chapter: ${path}`)
      const key = relative(base,path).replaceAll('\\','/').replace(/\.md$/,'').split('/').map(part=>part.replace(/^\d+\./,'')).join('/')
      const chapter = { title, key, path: `/books/${id}/${key}` }
      const output = join(root,'app/data/chapters',id)
      await mkdir(output,{recursive:true})
      await writeFile(join(output,key.replaceAll('/','--')+'.json'),JSON.stringify({title,html})+'\n')
      chapters.push(chapter)
    }
  }
  return chapters
}
const ids = new Set()
for (const book of books) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(book.id) || ids.has(book.id)) throw Error('Invalid book ID')
  ids.add(book.id)
  const base = join(root,'content/books',book.id)
  const chapters = await walk(base,base,book.id)
  if (!chapters.length) throw Error(`Empty book: ${book.id}`)
  catalog.push({...book,chapters})
}
await writeFile(join(root,'app/data/catalog.json'),JSON.stringify(catalog,null,2)+'\n')
console.log(`Prepared ${catalog.length} books, ${catalog.reduce((sum,b)=>sum+b.chapters.length,0)} original sections.`)
