import type { MiddlewareHandler } from 'astro';
import { sequence } from 'astro:middleware';
import { applySecurityHeaders } from '../shared/types/security';

const securityMiddleware: MiddlewareHandler = async (_context, next) => {
  return applySecurityHeaders(await next());
};

export const onRequest = sequence(securityMiddleware);
