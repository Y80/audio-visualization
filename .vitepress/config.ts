import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '🔊 Audio Visualizer',
  description: 'Some audio visualizer examples.',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' },
      { text: 'Examples1', link: '/example1' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/bmm/audio-viz' }],
  },

  vite: {
    css: {
      postcss: {
        plugins: [(await import('tailwindcss')).default, (await import('autoprefixer')).default],
      },
    },
  },
})
