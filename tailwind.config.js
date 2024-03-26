module.exports = {
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx,vue,html}'],
  theme: {
    extend: {
      colors: {
        background: '#0f212e',
        primary: '#213743',
        secondary: '#3d5564',
        text: '#F2F7FF',
        purple: '#2d9660',
        purpleDark: '#3bdb88'
      }
    },
    screens: {
      xs: '475px'
    }
  },
  plugins: []
}
