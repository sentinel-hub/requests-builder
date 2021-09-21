module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#c9d754',
          DEFAULT: '#b2c22d',
          dark: '#8e9b24',
          lighter: '#dde693'
        },
      },
      outline: {
        red: '2px solid red',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      borderColor: ['active', 'focus'],
      borderWidth: ['active', 'focus']
    },
  },
  plugins: [],
}
