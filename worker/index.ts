export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    let destination: string | undefined
    // Older browsers can retain the former permanent / -> /zh-cn redirect.
    // Serve the homepage here rather than redirecting back into a cached loop.
    if (/^\/(en|zh-cn)\/?$/.test(url.pathname)) {
      url.pathname = '/'
      const response = await env.ASSETS.fetch(new Request(url, request))
      const headers = new Headers(response.headers)
      headers.set('Cache-Control', 'no-store')
      return new Response(response.body, { status: response.status, headers })
    }
    if (/^\/(en|zh-cn)\/books\//.test(url.pathname)) destination = url.pathname.replace(/^\/(en|zh-cn)/, '')
    else if (/^\/(en|zh-cn)\/(read|appendices|publication)\//.test(url.pathname)) destination = url.pathname.replace(/^\/(en|zh-cn)/, '/books/consider-phlebas')
    else if (/^\/(read|appendices|publication)\//.test(url.pathname)) destination = '/books/consider-phlebas' + url.pathname
    if (destination?.endsWith('/publication/title-dedication')) destination = '/books/consider-phlebas/read/title-epigraphs'
    if (destination) { url.pathname = destination; url.searchParams.delete('view'); return Response.redirect(url.toString(), 308) }
    return env.ASSETS.fetch(request)
  }
} satisfies ExportedHandler<Env>
