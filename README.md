# Consider Phlebas — personal reader

A chapter-by-chapter English reading site using the official [Docus](https://github.com/nuxt-content/docus) Nuxt layer. Reading starts with the title and epigraphs, followed by the prologue, fourteen chapters, interludes and epilogue, with appendices available separately. Content is imported from the supplied EPUB.

## Run locally

Requires Node.js 24 or newer.

```powershell
npm install
npm run dev
```

Open http://localhost:3000. The server binds to the local computer by default.

```powershell
npm run build
npm run preview
```

## Cloudflare Worker

The site is deployed to https://books.mou7s.com using a Cloudflare Worker and Workers Static Assets. Nuxt generates the reading pages and browser-side search database; no server database is deployed.

```powershell
npm run deploy
```

Run `npm run worker:types` after changing bindings. `npm run worker:dev` previews the generated assets locally. The Worker redirects `/` to the Chinese contents page and preserves the older unprefixed English links.

On Windows, stop the local production preview before running `npm run deploy`, so its SQLite file is released while Nuxt regenerates the output.

## Content

The site supports English (`/en`) and Simplified Chinese (`/zh-cn`), with Chinese as the default entrance. English source files live in `content/en`; Chinese translations live in `content/zh-cn`. The Chinese edition currently contains the title and epigraphs and Chapter 1, Sorpen. Language switching on untranslated chapters returns to the Chinese contents page.

Choose **双语阅读 / Bilingual** in the language menu or at the top of a translated chapter to read each English paragraph followed by its Chinese translation. The preference is remembered; `?view=bilingual` links open that mode directly. Untranslated chapters retain their original English text. `scripts/build-bilingual.mjs` runs before development, builds and static generation, pairing paragraphs and section breaks from both source files and failing if their structures differ.

Chinese translations retain original English personal names, fictional place names and opaque species names. Meaningful terms such as Culture, Mind and Changer are translated consistently. Ship names are considered individually to preserve their humor and wordplay, with the English name included on first use when translated. The policy and terminology are recorded in `translations/terminology.zh-CN.json`.

The `content/` folder contains editable chapter files. `scripts/import_epub.py` imports the EPUB into `content/en` using the Python standard library, leaving Chinese translations intact. To reimport:

```powershell
python scripts/import_epub.py "C:/path/to/book.epub"
```

`import-report.json` records every section's source, route, paragraph count, word count and text checksum. The EPUB's blockquote tags used for ordinary prose are normalized to paragraphs; italics, bold text and paragraph order are retained. The original file is untouched.

The novel remains copyrighted by its rights holders. This project is prepared for personal local reading; verify distribution rights before publishing its full text.
