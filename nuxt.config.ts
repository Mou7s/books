export default defineNuxtConfig({
  extends: ['docus'],
  css: ['~/assets/css/reader.css'],
  devtools: { enabled: false },
  site: { name: 'Books', url: 'https://books.mou7s.com' },
  app: { head: { htmlAttrs: { lang:'zh-CN' }, link:[{rel:'icon',type:'image/svg+xml',href:'/favicon.svg'}] } },
  mcp: { enabled:false },
  llms:false,
  ogImage:{enabled:false},
  robots:{groups:[{userAgent:'*',disallow:'/'}]}
})
