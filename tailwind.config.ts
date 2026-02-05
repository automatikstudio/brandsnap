import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          fuchsia: "#C026D3",
          yellow: "#EAB308",
          bg: "#09090B",
          surface: "#18181B",
          text: "#FFFFFF",
          muted: "#A1A1AA",
        },
      },
      borderRadius: {
        btn: "14px",
        card: "20px",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
