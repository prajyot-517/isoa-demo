import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        loader: "loader 0.6s infinite alternate",
      },
      keyframes: {
        loader: {
          to: {
            transform: "translate3d(0, -1rem, 0)",
          },
        },
      },

      fontFamily: {
        sans: ["Museo Sans Rounded", "sans-serif"],
      },
      boxShadow: {
        custom: "0 0 10px 0 rgba(208, 208, 208, 0.8)",
      },
      fontWeight: {
        "100": "100",
        "300": "300",
        "500": "500",
        "700": "700",
        "900": "900",
      },
      colors: {
        primary: "#5E616E", 
        secondary: "#A97155",
        primaryBg: "#7A133E",
        secondaryBg: "#8B5C3C", 
        softBg: "#FAEFFC", 
        grayCustom:"#626262" 
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to right, #6100a5, #8241aa, #b93499, #ec0677)",
          "brown-blue-gradient": "linear-gradient(286deg, #B34B76 0%, #8CA4D6 100%)",
          "blue-brown-gradient": "linear-gradient(286deg, #8CA4D6 0%, #B34B76 100%)"
      },
    },
    screens: {
      xs: "360px",
      sm: "640px",
      md: "980px",
      lg: "1154px",
      xl: "1250px",
      "2xl": "1440px",
      "3xl": "1536px",
    },
    scrollbarHide: {
      "::-webkit-scrollbar": {
        display: "none",
      },
      "-ms-overflow-style": "none", // IE and Edge
      "scrollbar-width": "none", // Firefox
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        ".scrollbar-hide": {
          "::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none", // IE and Edge
          "scrollbar-width": "none", // Firefox
        },
      });
    },
  ],
} satisfies Config;
