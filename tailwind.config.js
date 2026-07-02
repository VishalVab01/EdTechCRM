/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#657085",
        cloud: "#f6f7f4",
        line: "#e7e8e3",
        pine: "#17463a",
        mint: "#dff3df",
        coral: "#f46f56",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(23, 32, 51, 0.08)",
        card: "0 14px 36px rgba(23, 32, 51, 0.07)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
