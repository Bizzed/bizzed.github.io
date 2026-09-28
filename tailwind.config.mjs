/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Approximated from the current bizzed.ai — refine when Tanisha
        // delivers the brand style guide on/after May 18.
        bg: {
          DEFAULT: '#ffffff',
          subtle: '#f5f5f5',
          card: '#fafafa',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          muted: '#52525b',
          soft: '#71717a',
        },
        border: {
          DEFAULT: '#e4e4e7',
          subtle: '#f0f0f0',
        },
        accent: {
          DEFAULT: '#22d3ee', // cyan-ish — match against live site with eyedropper
          hover: '#06b6d4',
        },
      },
      fontFamily: {
        // Replace with whatever the brand guide ends up specifying.
        // For now: a clean geometric sans for headers, a readable sans for body.
        display: ['"Geist"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};
