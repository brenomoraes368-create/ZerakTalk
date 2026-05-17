import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#12141d",
        muted: "#657084",
        panel: "#f7f8fb",
        brand: "#5f5af6",
      },
    },
  },
  plugins: [],
};

export default config;
