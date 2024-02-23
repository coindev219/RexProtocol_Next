/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './pages/**/*.{html,js}', 
    "./public/**/*.html",
    "./node_modules/flowbite-react/**/*.js",
    "./node_modules/flowbite/**/*.js",
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    screens: {
      sm: '450px',
      md: '700px',
      lg: '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      super: '1880px',
    },
    fontSize: {
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '1xl': '1.34rem',
      '2xl': '1.563rem',
      '3xl': '2.5rem',
      '4xl': '3.441rem',
      '5xl': '5rem',
    },
    extend: {
      height: {
        '1000': '1000px',
        '128': '32rem',
      },
      spacing: {
        '128': '32rem',
        '124': '31rem',
        '120': '30rem',
        '116': '29rem',
        '112': '28rem',
        '108': '27rem',
        '104': '26rem',
        '100': '25rem',

      },
      width: {
        '500': '500px',
      },
      backgroundImage: {
        'RexBackground': "url('../assets/images/ConcreteJungle.jpeg')",
      },
      animation: {
        fadeIn: "fadeIn 2s ease-in forwards",
        fadeinleft: "fadeinleft 1.5s ease-out forwards",
        fadeinright: "fadeinright 1.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        fadeinleft: {
          "0%": {
            opacity: 0,
            transform: "translateX(-200px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
        fadeinright: {
          "0%": {
            opacity: 0,
            transform: "translateX(200px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
      }
    },
  },
  variants: {
    animation: ["motion-safe"],
    animation: ["slide-out"]
},
  plugins: [require('tailwindcss-elevation')(['responsive']), require('tw-elements/dist/plugin'), require("flowbite/plugin")],
}

