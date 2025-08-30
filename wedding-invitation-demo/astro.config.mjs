// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://daegalmagic.github.io',
  // base: '/chungchup', // 로컬 개발시 주석 처리
  vite: {
    plugins: [tailwindcss()]
  }
});