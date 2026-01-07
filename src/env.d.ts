/// <reference types="astro/client" />

type Env = {
  API_ACCESS_CLIENT_ID?: string;
  API_ACCESS_CLIENT_SECRET?: string;
};

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
