import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const { locals } = context;

  // Debug what's available in locals
  const debugInfo = {
    hasLocals: !!locals,
    localsKeys: Object.keys(locals || {}),
    hasRuntime: !!(locals as any).runtime,
    runtimeKeys: Object.keys((locals as any).runtime?.env || {}),
    envVars: {
      CF_ACCESS_CLIENT_ID: !!((locals as any).runtime?.env?.CF_ACCESS_CLIENT_ID),
      CF_ACCESS_CLIENT_SECRET: !!((locals as any).runtime?.env?.CF_ACCESS_CLIENT_SECRET),
    },
    cf: {
      available: !!((locals as any).cf),
      keys: Object.keys((locals as any).cf || {}),
    },
    nodeEnv: {
      CF_ACCESS_CLIENT_ID: !!process.env.CF_ACCESS_CLIENT_ID,
      CF_ACCESS_CLIENT_SECRET: !!process.env.CF_ACCESS_CLIENT_SECRET,
    },
  };

  return new Response(JSON.stringify(debugInfo, null, 2), {
    headers: { 'content-type': 'application/json' },
  });
};
