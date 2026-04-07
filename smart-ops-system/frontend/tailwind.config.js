/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adding a professional "Corporate" palette
        brand: {
          primary: '#0f172a', // Slate 900
          secondary: '#3b82f6', // Blue 500
        }
      }
    },
  },
  plugins: [],
}