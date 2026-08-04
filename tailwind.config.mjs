/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08283a",
        atlantic: "#096b88",
        foam: "#e8f3f0",
        sea: "#17766e",
        sand: "#f3ead7",
        amber: "#f4a621",
        coral: "#d95745"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(8, 40, 58, 0.10)",
        lift: "0 14px 30px rgba(8, 40, 58, 0.16)"
      },
      keyframes: {
        rise: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        drift: { "0%, 100%": { transform: "translateX(0)" }, "50%": { transform: "translateX(8px)" } }
      },
      animation: {
        rise: "rise .55s ease-out both",
        drift: "drift 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default tailwindConfig;
