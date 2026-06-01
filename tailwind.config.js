/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#131f25",
        evergreen: "#304f49",
        sage: "#e9efec",
        ink: "#162128",
        paper: "#f5f5f1",
      },
      boxShadow: {
        page: "0 24px 70px rgba(15, 23, 42, 0.18)",
      },
      fontFamily: {
        display: ["Trebuchet MS", "Montserrat", "Arial", "sans-serif"],
        body: ["Inter", "Segoe UI", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
