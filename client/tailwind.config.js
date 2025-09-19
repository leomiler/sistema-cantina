/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'print': {'raw': 'print'},
      },
      width: {
        '58mm': '58mm',
      },
      maxWidth: {
        '58mm': '58mm',
      }
    },
  },
  plugins: [],
}