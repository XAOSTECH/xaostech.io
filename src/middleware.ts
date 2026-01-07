import type { MiddlewareHandler } from 'astro';
import { sequence } from 'astro:middleware';

// All routing handled via /api proxy (src/pages/api/[...path].ts)
// API proxy injects authentication and routes to appropriate services
// No direct subdomain routing - use /api/path routes instead

import { proxyRequest } from '../../shared/types/route-proxy';

const middleware: MiddlewareHandler = async (context, next) => {
  const req = context.request;
  // Handle top-level route proxies like /portfolio, /account, /data etc
  try {
    const envObj = (context as any).locals?.runtime?.env || (context as any).locals?.env || {};
    const proxied = await proxyRequest(req, envObj);
    if (proxied) return proxied;
  } catch (err: any) {
    // Log details for debugging and return 502
    console.error('[route-proxy] error in middleware:', err && (err.stack || err.message || err));
    return new Response('Proxy error', { status: 502 });
  }

  return next();
};

export const onRequest = sequence(middleware);
