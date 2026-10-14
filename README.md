# Books — personal reading library

A multi-book reading library using the official [Docus](https://github.com/nuxt-content/docus) Nuxt layer. The homepage is a searchable bookshelf. Every book has its own contents page, chapters, cover and translation terminology, with English, Chinese and paragraph-aligned bilingual reading.

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

Run `npm run worker:types` after changing bindings. `npm run worker:dev` previews the generated assets locally. The Worker redirects `/` to the Chinese bookshelf. Older Consider Phlebas chapter links redirect to the book's new address, preserving query parameters for bilingual reading.

On Windows, stop the local production preview before running `npm run deploy`, so its SQLite file is released while Nuxt regenerates the output.

## Content

The site supports English (`/en`) and Simplified Chinese (`/zh-cn`), with Chinese as the default entrance. Book addresses are `/<locale>/books/<book-id>` and chapter addresses are `/<locale>/books/<book-id>/read/<chapter>`. Language switching on untranslated chapters returns to the same book's Chinese contents page.

Choose **双语阅读 / Bilingual** in the header language menu to read each English paragraph followed by its Chinese translation. Reading mode is controlled in this single menu. The preference is remembered; `?view=bilingual` links open that mode directly. Untranslated chapters retain their original English text. `scripts/build-bilingual.mjs` runs before development, builds and static generation, pairing paragraphs and section breaks from both source files and failing if their structures differ.

Choosing Chinese or English explicitly resets bilingual mode, including on the bookshelf. Book entry links carry the selected mode through to the first reading page. A shared reading preference keeps the header, book entry and chapter renderer consistent; explicit `view=single` or `view=bilingual` links also update the saved preference.

Chinese translations retain original English personal names, fictional place names and opaque species names. Meaningful terms such as Culture, Mind and Changer are translated consistently. Ship names are considered individually to preserve their humor and wordplay, with the English name included on first use when translated. Each book's terminology lives in `translations/<book-id>/terminology.zh-CN.json`.

## Add a book

Import an EPUB with a unique lowercase book ID:

```powershell
python scripts/import_epub.py "C:/path/to/book.epub" --id my-book
npm run generate
```

The importer registers metadata in `books.json` and writes English sections to `content/en/books/my-book/`. Optional `--title` and `--author` flags override EPUB metadata. Adjust the Chinese title and series in `books.json` as needed. Covers live in `public/books/my-book/`; add Chinese translations under `content/zh-cn/books/my-book/` with matching filenames and paragraph structure. Reimporting the same ID replaces only that book's English sections and leaves all Chinese translations and other books intact.

`scripts/build-library.mjs` generates the bookshelf catalog and each book's contents before development/builds. Book index pages are generated; edit metadata or chapters instead. `translations/<book-id>/import-report.json` records each section's source, route, paragraph count, word count and text checksum. The original EPUB is untouched. Consider Phlebas currently has 29 original sections and two translated sections.

The novel remains copyrighted by its rights holders. This project is prepared for personal local reading; verify distribution rights before publishing its full text.
