export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'zh-cn',
    strategy: 'prefix',
    detectBrowserLanguage: false,
    locales: [
      { code: 'zh-cn', language: 'zh-CN', name: '简体中文' },
      { code: 'en', language: 'en', name: 'English' }
    ]
  },
  routeRules: {
    '/publication/title-dedication': { redirect: '/en/books/consider-phlebas/read/title-epigraphs' },
    '/en/publication/title-dedication': { redirect: '/en/books/consider-phlebas/read/title-epigraphs' },
    '/read/**': { redirect: '/en/books/consider-phlebas/read/**' },
    '/appendices/**': { redirect: '/en/books/consider-phlebas/appendices/**' },
    '/publication/**': { redirect: '/en/books/consider-phlebas/publication/**' },
    '/en/read/**': { redirect: '/en/books/consider-phlebas/read/**' },
    '/en/appendices/**': { redirect: '/en/books/consider-phlebas/appendices/**' },
    '/en/publication/**': { redirect: '/en/books/consider-phlebas/publication/**' },
    '/zh-cn/read/**': { redirect: '/zh-cn/books/consider-phlebas/read/**' }
  },
  css: ['~/assets/css/reader.css'],
  devtools: { enabled: false },
  site: { name: 'Books', url: 'https://books.mou7s.com' },
  app: { head: { htmlAttrs: { lang: 'en' }, link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }] } },
  mcp: { enabled: false },
  llms: false,
  ogImage: { enabled: false },
  robots: { groups: [{ userAgent: '*', disallow: '/' }] }
})
