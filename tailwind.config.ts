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
        darkGray: "#1a1a1a",
        lightGray: "#d3d3d3",
        coolOrange: "#ee7f33",
        darkBg: "#242424",
      },
    },
  },
  plugins: [],
};
export default config;
