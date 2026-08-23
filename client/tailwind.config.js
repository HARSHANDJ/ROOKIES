/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          200: '#bae2fd',
          300: '#7cd4fd',
          400: '#36c1f9',
          500: '#0ca8eb',
          600: '#0087cb',
          700: '#026ca7',
          800: '#065b89',
          900: '#0b4b72',
          950: '#07304d',
        },
        obsidian: {
          950: '#05070f',
          900: '#090d1a',
          850: '#0d1326',
          800: '#121a33',
          700: '#1c274c',
          600: '#2a3a6e',
        },
        accent: {
          cyan: '#00f2fe',
          violet: '#7928ca',
          emerald: '#10b981',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.3)',
        'glow-violet': '0 0 25px -5px rgba(121, 40, 202, 0.3)',
        'glow-subtle': '0 0 35px -10px rgba(12, 168, 235, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulseGlow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
