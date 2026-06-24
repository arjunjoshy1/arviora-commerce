/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Arviora theme — "Porcelain & Charcoal" (minimal monochrome)
        canvas: '#F4F4F2', // page background
        surface: '#FFFFFF', // cards, inputs, header
        ink: '#1C1C1A', // primary text
        accent: '#2E2E2B', // buttons, active states (soft charcoal)
        muted: '#8A8A85', // secondary text
        line: '#E6E5E1', // borders / dividers
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
