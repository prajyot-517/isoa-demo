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
        primary: "#5E616E", // Dark Gray
        secondary: "#C496FF", // Lavender Mist
        primaryBg: "#430070", // Royal Purple
        secondaryBg: "#9E61C7", // Amethyst Purple
        softBg: "#FAEFFC", // Orchid Pink
        grayCustom:"#626262" // Dark Gray
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to right, #6100a5, #8241aa, #b93499, #ec0677)",
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
