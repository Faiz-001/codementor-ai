/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          foreground: '#ffffff',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e1e3e5',
          800: '#1e1e24',
          900: '#121215',
          950: '#09090b',
        },
      },
    },
  },
  plugins: [],
};