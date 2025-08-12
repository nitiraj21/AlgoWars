/** @type {import('tailwindcss').Config} */
const config = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',       // App Router
      './pages/**/*.{js,ts,jsx,tsx}',     // Pages Router
      './components/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
      extend: {
        fontFamily: {
            inter: ["var(--font-inter)"],
            fira: ["var(--font-fira)"],
        },
      },
    },
    plugins: [],
  };
  
  export default config;
  