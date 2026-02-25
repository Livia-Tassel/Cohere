/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#0EA5E9',
        accent: '#F97316',
      },
      spacing: {
        'sidebar': '16rem',
        'sidebar-collapsed': '4rem',
      },
      zIndex: {
        'sidebar': '40',
        'navbar': '50',
        'modal': '60',
      },
    },
  },
  plugins: [],
}
