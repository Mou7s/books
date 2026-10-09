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
    '/publication/title-dedication': { redirect: '/en/read/title-epigraphs' },
    '/en/publication/title-dedication': { redirect: '/en/read/title-epigraphs' },
    '/read/**': { redirect: '/en/read/**' },
    '/appendices/**': { redirect: '/en/appendices/**' },
    '/publication/**': { redirect: '/en/publication/**' }
  },
  css: ['~/assets/css/reader.css'],
  devtools: { enabled: false },
  site: { name: 'Consider Phlebas' },
  app: { head: { htmlAttrs: { lang: 'en' }, link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }] } },
  mcp: { enabled: false },
  llms: false,
  ogImage: { enabled: false },
  robots: { groups: [{ userAgent: '*', disallow: '/' }] }
})
