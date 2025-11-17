import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#303030',
        foreground: '#f8f8f8',
        accent: '#F97316',
      },
      borderRadius: {
        'brand': '15px',
      },
      fontFamily: {
        sans: ['var(--font-golos)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
