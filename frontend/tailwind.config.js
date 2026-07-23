/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0f172a',
        'navy-blue': '#1e3a8a',
        'railway-blue': '#0284c7',
        'accent-gold': '#f59e0b',
        'accent-gold-hover': '#d97706',
        'bg-slate': '#f8fafc',
      }
    },
  },
  plugins: [],
}
