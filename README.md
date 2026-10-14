# Books

A personal EPUB reading website: bookshelf, book contents and an original-text reader. The interface is Chinese; books retain their original language. There are no translations or language modes.

## Add a book

```powershell
python scripts/import_epub.py "C:/path/to/book.epub" --id my-book
npm run dev
```

The importer adds metadata to `books.json`, originals to `content/books/my-book/`, covers to `public/books/my-book/`, and an import report to `imports/my-book/report.json`. Reimporting affects only the selected book. `scripts/build-reader.mjs` builds the catalog and individually loaded chapter data before development and builds.

## Deploy

```powershell
npm run deploy
```

The Nuxt site is statically generated and served by a Cloudflare Worker at https://books.mou7s.com. Stop a running local Worker preview before generating on Windows. Older language-prefixed book links redirect to the original edition.

Reading settings and position are saved in the current browser. The reader supports adjustable font size and default white and night backgrounds. No cloud synchronization is provided.
