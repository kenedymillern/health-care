import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // scans all App Router components/pages
    "./components/**/*.{js,ts,jsx,tsx}", // if you have a components dir
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // App Router convention
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        lora: ["Lora", "serif"],
      },
      colors: {
        primary: "#1E3A8A",   // Deep blue
        secondary: "#34D399", // Soft teal
        accent: "#FBBF24",    // Warm yellow
      },
      backgroundImage: {
        "bg-gradient": "linear-gradient(135deg, #E0F2FE 0%, #D1FAE5 100%)",
      },
      animation: {
        "fade-in": "fadeIn 1s ease-in-out",
        "slide-up": "slideUp 0.8s ease-out",
        "pulse-glow": "pulseGlow 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(50px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(52, 211, 153, 0.5)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(52, 211, 153, 0.8)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
