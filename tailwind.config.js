/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#38A169', // yeşil
          hover: '#2F855A',
        },
        secondary: {
          DEFAULT: '#3182CE', // mavi
          hover: '#2C5282',
        },
        dark: {
          DEFAULT: '#030711', // Çok daha koyu
          lighter: '#0F1629', // Koyu mavi-siyah
          darker: '#020509', // Neredeyse siyah
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'move-bg': 'move-bg 60s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'wave': 'wave 8s linear infinite',
        'aurora': 'aurora 10s linear infinite',
        'sparkle': 'sparkle 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'shooting-star': 'shooting 3s linear infinite',
        'float-star': 'floatStar 5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'move-bg': {
          '0%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          },
          '100%': {
            'background-position': '0% 50%'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(180deg) scale(1.2)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%', transform: 'scale(1)' },
          '50%': { backgroundPosition: '100% 50%', transform: 'scale(1.1)' },
          '100%': { backgroundPosition: '0% 50%', transform: 'scale(1)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(0.8)' },
        },
        glow: {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.2)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.7)' },
        },
        shooting: {
          '0%': { transform: 'translateX(0) translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(400px) translateY(300px) rotate(45deg)', opacity: '0' },
        },
        floatStar: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
        },
      },
      backgroundImage: {
        'gradient-radial-dark': 'radial-gradient(circle at center, #2D3748 0%, #1A202C 100%)',
        'gradient-animated': 'linear-gradient(45deg, #38A169, #3182CE, #38A169)',
        'gradient-animated-2': 'linear-gradient(-45deg, #1A202C, #2D3748, #38A169, #3182CE)',
        'gradient-dots': 'radial-gradient(circle, rgba(56, 161, 105, 0.1) 2px, transparent 2px)',
        'gradient-mesh': 'linear-gradient(rgba(56, 161, 105, 0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(49, 130, 206, 0.1) 2px, transparent 2px)',
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 0deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-wave': 'linear-gradient(45deg, #38A169 0%, #3182CE 50%, #38A169 100%)',
        'gradient-aurora': 'linear-gradient(-45deg, #38A169, #3182CE, #2C5282, #2F855A)',
        'star': "url(\"data:image/svg+xml,%3Csvg width='2' height='2' viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='white'/%3E%3C/svg%3E\")",
        'space-gradient': 'linear-gradient(to bottom, #030711 0%, #0F1629 100%)',
        'section-gradient': 'linear-gradient(to bottom, rgba(15, 22, 41, 0.8) 0%, rgba(3, 7, 17, 0.8) 100%)',
      },
      backgroundSize: {
        'dots': '30px 30px',
        'mesh': '50px 50px',
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '200%': '200% 200%',
        '300%': '300% 300%',
      },
    },
  },
  plugins: [],
} 