/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        'page-warm': '#E7DCD8',
        'page-cool': '#F1EFEC',
        blue: '#4FA3D1',
        'blue-pale': '#D9ECF6',
        coral: '#E8735C',
        'coral-pale': '#F9D9D1',
        green: '#8FCB9E',
        'green-deep': '#3FA35A',
        amber: '#EAB74A',
        'amber-pale': '#F8EAD6',
        ink: '#1A1A1A',
        muted: '#8B8B90',
        track: '#E5E5E8',
      },
      borderRadius: {
        'card': '22px',
        'hero': '28px',
        'chip': '16px',
      },
      boxShadow: {
        float: '0 14px 36px rgba(27, 40, 54, .08)',
        'float-lg': '0 20px 50px rgba(27, 40, 54, .10)',
        soft: '0 4px 20px rgba(0, 0, 0, .04)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseRing: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out both',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
