<<<<<<< HEAD
// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://daegalmagic.github.io',
  base: '/chungchup',
  vite: {
    plugins: [tailwindcss()]
  }
});
=======
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://daegalmagic.github.io',
  base: '/chungchup'
});
>>>>>>> 8c6e42a6df0d824d5e441f1ddcd3325e9b80f62e
