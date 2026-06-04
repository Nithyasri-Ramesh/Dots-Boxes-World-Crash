/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Orbitron"', 'sans-serif'],
        'body': ['"Exo 2"', 'sans-serif'],
      },
      colors: {
        neon: {
          blue: '#00f5ff',
          pink: '#ff00ff',
          green: '#00ff88',
          yellow: '#ffff00',
          orange: '#ff8800',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 2s infinite',
        'flicker': 'flicker 4s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)' },
          '92%': { transform: 'translate(-2px, 1px)' },
          '94%': { transform: 'translate(2px, -1px)' },
          '96%': { transform: 'translate(-1px, 2px)' },
        },
        flicker: {
          '0%, 95%, 100%': { opacity: 1 },
          '97%': { opacity: 0.7 },
        }
      }
    },
  },
  plugins: [],
}
