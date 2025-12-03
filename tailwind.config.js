/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './survey/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        'neon-green': {
          DEFAULT: '#00ff41',
          50: '#e6ffe6',
          100: '#b3ffb3',
          200: '#80ff80',
          300: '#4dff4d',
          400: '#1aff1a',
          500: '#00ff41',
          600: '#00cc33',
          700: '#009926',
          800: '#006619',
          900: '#00330d',
        },
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 255, 65, 0.4)',
        'neon-lg': '0 0 25px rgba(0, 255, 65, 0.6)',
        'neon-xl': '0 0 40px rgba(0, 255, 65, 0.5)',
        'neon-sm': '0 0 5px rgba(0, 255, 65, 0.3)',
      },
    },
  },
  plugins: [],
}

