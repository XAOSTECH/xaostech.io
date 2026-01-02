import { defineMiddleware, sequence } from 'astro:middleware';

// Handle R2 image serving and API proxying
const imageAndApiMiddleware = defineMiddleware(async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Serve favicon and images from R2
  if (pathname === '/XAOSTECH_LOGO.png' || pathname.startsWith('/img/')) {
    const filename = pathname === '/XAOSTECH_LOGO.png' ? 'XAOSTECH_LOGO.png' : pathname.replace(/^\/img\//, '');
    try {
      const env = context.locals.env as any;
      if (env?.IMG) {
        const object = await env.IMG.get(filename);
        if (object) {
          const headers = new Headers();
          object.writeHttpMetadata(headers);
          headers.set('Cache-Control', 'public, max-age=604800');
          return new Response(object.body, { headers });
        }
      }
    } catch (err) {
      console.error(`Failed to serve image ${filename}:`, err);
    }
  }

  // All /api/* calls proxy to api.xaostech.io
  if (pathname.startsWith('/api')) {
    const newUrl = new URL(request.url);
    newUrl.hostname = 'api.xaostech.io';
    return fetch(new Request(newUrl, request));
  }

  // Direct subdomain navigation
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

  // Pass to next middleware or Astro
  return next();
});

export const onRequest = sequence(imageAndApiMiddleware);
