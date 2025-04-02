/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        primaryhover: '#2563EB', // Blue
        secondary: '#10B981', // Green
        danger: '#DC2626', // Red
        background: '#F8FAFC',
        cards: '#E5E7EB',
        texts: '#1F2937',
        foreground: '#171717',
      },
    },
  },
  plugins: [],
};
