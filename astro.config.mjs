import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import icon from "astro-icon";

// CI supplies the actual Pages URL, including a configured custom domain.
const pagesUrl = process.env.PAGES_URL;
const url = pagesUrl ? new URL(pagesUrl) : undefined;
export default defineConfig({
  output: 'static',
  site: url?.origin,
  base: url?.pathname || '/',
  trailingSlash: 'always',
  integrations: [react(), icon()],
});
