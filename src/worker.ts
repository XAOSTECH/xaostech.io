export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Route specific paths to subdomain workers via internal proxying
    if (pathname.startsWith('/portfolio')) {
      const newUrl = new URL(request.url);
      newUrl.pathname = pathname.replace(/^\/portfolio/, '') || '/';
      newUrl.hostname = 'portfolio.xaostech.io';
      return fetch(new Request(newUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' ? await request.text() : undefined,
      }));
    }

    if (pathname.startsWith('/blog')) {
      const newUrl = new URL(request.url);
      newUrl.pathname = pathname.replace(/^\/blog/, '') || '/';
      newUrl.hostname = 'blog.xaostech.io';
      return fetch(new Request(newUrl, request));
    }

    if (pathname.startsWith('/chat')) {
      const newUrl = new URL(request.url);
      newUrl.pathname = pathname.replace(/^\/chat/, '') || '/';
      newUrl.hostname = 'chat.xaostech.io';
      return fetch(new Request(newUrl, request));
    }

    if (pathname.startsWith('/account')) {
      const newUrl = new URL(request.url);
      newUrl.pathname = pathname.replace(/^\/account/, '') || '/';
      newUrl.hostname = 'account.xaostech.io';
      return fetch(new Request(newUrl, request));
    }

    if (pathname.startsWith('/api')) {
      const newUrl = new URL(request.url);
      newUrl.pathname = pathname.replace(/^\/api/, '') || '/';
      newUrl.hostname = 'api.xaostech.io';
      return fetch(new Request(newUrl, request));
    }

    if (pathname.startsWith('/data')) {
      const newUrl = new URL(request.url);
      newUrl.pathname = pathname.replace(/^\/data/, '') || '/';
      newUrl.hostname = 'data.xaostech.io';
      return fetch(new Request(newUrl, request));
    }

    if (pathname.startsWith('/lingua')) {
      const newUrl = new URL(request.url);
      newUrl.pathname = pathname.replace(/^\/lingua/, '') || '/';
      newUrl.hostname = 'lingua.xaostech.io';
      return fetch(new Request(newUrl, request));
    }

    if (pathname.startsWith('/payments')) {
      const newUrl = new URL(request.url);
      newUrl.pathname = pathname.replace(/^\/payments/, '') || '/';
      newUrl.hostname = 'payments.xaostech.io';
      return fetch(new Request(newUrl, request));
    }

    // Default: let static assets handle it (Astro won't run, return 404)
    return new Response('Not Found', { status: 404 });
  },
};
