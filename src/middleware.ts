import type { MiddlewareHandler } from 'astro';
import { sequence } from 'astro:middleware';
import { applySecurityHeaders } from '../shared/types/security';

// All routing handled via /api proxy (src/pages/api/[...path].ts)
// API proxy injects authentication and routes to appropriate services
// No direct subdomain routing - use /api/path routes instead

const middleware: MiddlewareHandler = async (context, next) => {
  const res = await next();
  // Apply shared security headers to all responses
  const secured = applySecurityHeaders(res as unknown as Response);

  // Temporary relaxation: add inline allowances specifically to script-src and style-src while we migrate
  const headers = new Headers(secured.headers);
  const existingCsp = headers.get('Content-Security-Policy') || '';
  const tokens = "'unsafe-inline' 'unsafe-hashes'";

  if (existingCsp) {
    const directives = existingCsp.split(';').map(d => d.trim()).filter(Boolean);
    const hasScript = directives.some(d => d.startsWith('script-src'));
    const hasStyle = directives.some(d => d.startsWith('style-src'));

    const updated = directives.map(d => {
      if (d.startsWith('script-src')) return d + ' ' + tokens;
      if (d.startsWith('style-src')) return d + ' ' + tokens;
      return d;
    });

    if (!hasScript) updated.push(`script-src 'self' https: ${tokens}`);
    if (!hasStyle) updated.push(`style-src 'self' https: ${tokens}`);

    headers.set('Content-Security-Policy', updated.join('; '));
  } else {
    headers.set('Content-Security-Policy', `script-src 'self' https: ${tokens}; style-src 'self' https: ${tokens}`);
  }

  console.warn('[CSP] Relaxed CSP for inline scripts/styles (temporary - added to script-src/style-src)');

  return new Response(secured.body, {
    status: (secured as any).status || 200,
    statusText: (secured as any).statusText || undefined,
    headers,
  });
};

export const onRequest = sequence(middleware);
