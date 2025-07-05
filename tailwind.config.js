
module.exports = {
  content: [
    "./**/*.html",
    "./**/*.js",
    "!./node_modules/**/*",
    "!./dist/**/*"
  ],
  theme: {
    container: {
      center: true,
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        primary: '#e65742',
        secondary: '#253D4E',
        dark: '#001D23'
      },
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif']
      },
      animation: {
        'spin-slow': 'spin 15s linear infinite',
      }
    }
  },
  corePlugins: {
    direction: true,
  },
}
