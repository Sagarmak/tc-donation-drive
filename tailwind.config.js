/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        background: 'var(--background)',
        'background-lighter': 'var(--background-lighter)',
        'color-text': 'var(--color-text)',
        'color-text-gray': 'var(--color-text-gray)',
        accent: 'var(--accent)',
        'accent-text': 'var(--accent-text)',
        'accent-bg': 'var(--accent-bg)',
      },
    },
  },
  plugins: [],
}
