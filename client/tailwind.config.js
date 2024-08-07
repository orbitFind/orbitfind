/** @type {import('tailwindcss').Config} */
module.exports = {

  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        'primary-500': '#877EFF',
        'primary-600': '#5D5FEF',
        'secondary-500': '#FFB620',
        'off-white': '#D0DFFF',
        'red': '#FF5A5A',
        'dark-1': '#000000',
        'dark-2': '#09090A',
        'dark-3': '#101012',
        'dark-4': '#1F1F22',
        'light-1': '#FFFFFF',
        'light-2': '#EFEFEF',
        'light-3': '#7878A3',
        'light-4': '#5C5C7B',
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "prod-bg": "url('/src/assets/bg.jpg')",
        
      },
      prodImages: {
        "battery": "url('/src/assets/prodimgs/Battery.png')",
        "colors": "url('/src/assets/prodimgs/colors.png')",
        "led": "url('/src/assets/prodimgs/LED.png')",
        "mag": "url('/src/assets/prodimgs/MagSafe.png')",
        "open": "url('/src/assets/prodimgs/Open Source.png')",
        "safety": "url('/src/assets/prodimgs/Safety.png')",
        "sos": "url('/src/assets/prodimgs/SOS.jpg')",
        "usb": "url('/src/assets/prodimgs/USB.png')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],

}