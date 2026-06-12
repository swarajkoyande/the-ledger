/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1F44',
          50:  '#d9e2ff',
          100: '#b4c6f4',
          200: '#7687b2',
          300: '#4c5e86',
          400: '#34466d',
          500: '#0A1F44',
          600: '#00081e',
          dark: '#00081e',
        },
        ledger: {
          bg:      '#f7f9fb',
          surface: '#ffffff',
          card:    '#eceef0',
          border:  '#c5c6cf',
          text:    '#191c1e',
          muted:   '#44464e',
          orange:  '#fd761a',
          'orange-dark': '#9d4300',
        },
        warm: {
          950: '#0A0806',
          900: '#0E0C09',
          800: '#141108',
          700: '#1A1510',
          600: '#231C12',
          500: '#2E2418',
        },
        cream: '#F5F0E8',
        'cream-dim': '#C4B8A4',
        stone: '#9B8B75',
        tan:   '#C4A882',
        orange: {
          DEFAULT: '#F97316',
          light:   '#FB923C',
          dark:    '#EA6C0A',
        },
      },
      fontFamily: {
        sans:    ['Jost', 'system-ui', 'sans-serif'],
        display: ['Jost', 'system-ui', 'sans-serif'],
      },
      animation: {
        'orb-1':       'orbFloat1 18s ease-in-out infinite',
        'orb-2':       'orbFloat2 24s ease-in-out infinite',
        'orb-3':       'orbFloat3 16s ease-in-out infinite',
        'orb-4':       'orbFloat1 20s ease-in-out 5s infinite',
        'float':       'float 8s ease-in-out infinite',
        'float-slow':  'float 14s ease-in-out infinite',
        'float-delay': 'float 10s ease-in-out 3s infinite',
        'marquee':     'marquee 50s linear infinite',
        'marquee-rev': 'marqueeRev 50s linear infinite',
        'spin-slow':   'spin 40s linear infinite',
        'fade-in':     'fadeIn 0.8s ease-out forwards',
        'scale-in':    'scaleIn 0.6s ease-out forwards',
        'glow-pulse':  'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        orbFloat1: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '25%':  { transform: 'translate(40px, -60px) scale(1.08)' },
          '50%':  { transform: 'translate(80px, 20px) scale(0.95)' },
          '75%':  { transform: 'translate(-30px, 50px) scale(1.05)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        orbFloat2: {
          '0%':   { transform: 'translate(0, 0) scale(1.1)' },
          '33%':  { transform: 'translate(-60px, 40px) scale(0.9)' },
          '66%':  { transform: 'translate(40px, -30px) scale(1.05)' },
          '100%': { transform: 'translate(0, 0) scale(1.1)' },
        },
        orbFloat3: {
          '0%':   { transform: 'translate(0, 0) rotate(0deg)' },
          '50%':  { transform: 'translate(60px, -50px) rotate(180deg)' },
          '100%': { transform: 'translate(0, 0) rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRev: {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(249,115,22,0.2)' },
          '50%':      { boxShadow: '0 0 60px rgba(249,115,22,0.5)' },
        },
      },
    },
  },
  plugins: [],
}
