/** @type {import('tailwindcss').Config} */
module.exports = {
  // make sure tailwind classes in html and ts file of the src is not discarded
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
