import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV === 'development';
const appEnv = process.env.APP_ENV;

const environments = {
  github: '/stylo-viz',
  test: '/build',
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    paths: {
      base: dev ? '' : environments[appEnv] || '',
    },
    adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
      fallback: null,
    }),
  },
};

export default config;
