/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: '#111111',
        card: '#1A1A1A',
        primary: '#FFD54A',
        success: '#22C55E',
        danger: '#EF4444',
        'text-secondary': '#9CA3AF',
        'card-hover': '#222222',
        border: '#2A2A2A',
      },
      borderRadius: {
        card: '18px',
      },
    },
  },
  plugins: [],
};
