/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        gray: {
          100: "#0f0f0f",
          200: "#080a0b",
          300: "#030303",
        },
        black: "#000",
        palegoldenrod: "#ffeeaa",
        lightgoldenrodyellow: "#c3f2cb",
        gainsboro: "#dedede",
      },
      spacing: {},
      fontFamily: {
        aleo: "Aleo",
        "work-sans": "'Work Sans'",
        roboto: "Roboto",
      },
      borderRadius: {
        "10xs": "3px",
        "6xl": "25px",
      },
    },
    fontSize: {
      sm: "14px",
      base: "16px",
      "13xl": "32px",
      "21xl": "40px",
      "3xl": "22px",
      "5xl": "24px",
      inherit: "inherit",
    },
    screens: {
      lg: {
        max: "1200px",
      },
      md: {
        max: "960px",
      },
      sm: {
        max: "420px",
      },
      mq350small: {
        raw: "screen and (max-width: 350px)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
