export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    let destination: string | undefined
    if (url.pathname === '/') {
      destination = '/zh-cn'
    } else if (url.pathname === '/publication/title-dedication' || url.pathname === '/en/publication/title-dedication') {
      destination = '/en/read/title-epigraphs'
    } else if (['/read/', '/appendices/', '/publication/'].some(prefix => url.pathname.startsWith(prefix))) {
      destination = `/en${url.pathname}`
    }
    if (destination) {
      url.pathname = destination
      return Response.redirect(url.toString(), 308)
    }
    return env.ASSETS.fetch(request)
  }
} satisfies ExportedHandler<Env>
