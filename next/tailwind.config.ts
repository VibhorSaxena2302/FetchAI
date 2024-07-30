import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',   // Rich purple
        secondary: '#a78bfa', // Light purple
        accent: '#c4b5fd',    // Very light purple
        light: 'white',     // Near-white purple
      }
    },
  },
  plugins: [],
};
export default config;
