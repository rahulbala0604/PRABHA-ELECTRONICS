/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: '#08172c',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: '#d97706' // darker amber
        },
        surface: 'var(--surface)',
        background: 'var(--background)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        navy: {
          900: 'var(--primary)',
          800: 'var(--primary-light)',
          700: '#1e40af'
        },
        electric: 'var(--secondary)',
        light: 'var(--background)'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 40px -10px rgba(11, 31, 58, 0.1)',
      }
    },
  },
  plugins: [],
}
