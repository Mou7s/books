# Books

A personal EPUB reading website built on the official [Docus](https://github.com/nuxt-content/docus) Nuxt layer: bookshelf, book contents and an original-text reader. The interface is Chinese; books retain their original language. There are no translations or language modes.

## Add a book

```powershell
python scripts/import_epub.py "C:/path/to/book.epub" --id my-book
npm run dev
```

The importer adds metadata to `books.json`, originals to `content/books/my-book/`, covers to `public/books/my-book/`, and an import report to `imports/my-book/report.json`. Reimporting affects only the selected book. `scripts/build-reader.mjs` builds the catalog and Docus book contents pages before development and builds.

## Deploy

```powershell
npm run deploy
```

The Nuxt site is statically generated and served by a Cloudflare Worker at https://books.mou7s.com. Stop a running local Worker preview before generating on Windows. Older language-prefixed book links redirect to the original edition.

Docus provides the page layouts, sidebar, search and light/dark themes. Reading position is saved in the current browser for the continue-reading button.
