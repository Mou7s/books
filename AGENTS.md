# EPUB 阅读器

- 本项目只展示用户提供的 EPUB 原文，不做翻译，不设置双语或界面语言切换。
- 界面文案用简体中文；书名、作者和正文保留 EPUB 原文。
- `books.json` 注册书籍元数据，书籍 ID 使用唯一的小写英文和连字符，不修改已有 ID。
- 正文保存在 `content/books/<book-id>/`；封面在 `public/books/<book-id>/`；导入报告在 `imports/<book-id>/report.json`。
- 新增或重新导入 EPUB 时，只修改目标书籍，不覆盖其他书籍。
- 首页是书架，阅读路径为 `/books/<book-id>/<section>/<chapter>`。
- 保留原文段落、标点、斜体和章节顺序；不要自行改写或翻译。
- 添加书籍后执行 `npm run generate`，确认目录和正文，再部署。
