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
        background: '#0d1117',
        card: '#161b22',
        border: '#30363d',
        'text-primary': '#e6edf3',
        'text-secondary': '#8b949e',
        accent: '#58a6ff',
        success: '#3fb950',
      },
    },
  },
  plugins: [],
}
export default config
