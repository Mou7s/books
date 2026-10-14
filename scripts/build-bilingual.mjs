import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const chineseRoot = fileURLToPath(new URL('content/zh-cn/', root))
const englishRoot = fileURLToPath(new URL('content/en/', root))
const pages = {}
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) { await visit(path); continue }
    if (!entry.name.endsWith('.md')) continue
    const chinese = await readFile(path, 'utf8')
    if (!chinese.includes('::reader-text')) continue
    const file = relative(chineseRoot, path)
    const english = await readFile(join(englishRoot, file), 'utf8')
    const blocks = text => [...text.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>|<hr\s*\/?>/g)].map(match => match[0])
    const en = blocks(english), zh = blocks(chinese)
    if (!en.length || en.length !== zh.length || en.some((block, index) => block.startsWith('<hr') !== zh[index].startsWith('<hr'))) {
      throw new Error(`Bilingual paragraph alignment differs: ${file}`)
    }
    const route = '/' + file.replaceAll('\\', '/').replace(/\.md$/, '').split('/').map(part => part.replace(/^\d+\./, '')).join('/')
    pages[route] = en.map((block, index) => block.startsWith('<hr') ? { separator: true } : { en: block, zh: zh[index] })
  }
}
await visit(chineseRoot)
await mkdir(new URL('app/data/', root), { recursive: true })
await writeFile(new URL('app/data/bilingual.json', root), JSON.stringify(pages, null, 2) + '\n')
console.log(`Built aligned bilingual text for ${Object.keys(pages).length} pages.`)
