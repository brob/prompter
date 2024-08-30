import { defineConfig } from 'astro/config';
import clerk from "@clerk/astro";
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [clerk()]
});