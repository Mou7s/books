export default defineNuxtConfig({
  compatibilityDate: '2026-10-14',
  css: ['~/assets/css/reader.css'],
  devtools: { enabled: false },
  app: { head: { htmlAttrs: { lang: 'zh-CN' }, link: [{rel:'icon',type:'image/svg+xml',href:'/favicon.svg'}], meta:[{name:'robots',content:'noindex, nofollow'}] } },
  nitro: { prerender: { crawlLinks: true, routes: ['/'] } }
})
