import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';

export default {
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
  }
};