/** @type {import('tailwindcss').Config} */
module.exports = {
  // make sure tailwind classes in html and ts file of the src is not discarded
  content: ['./src/**/*.{html,ts}'],
  safelist: [
    'bg-blue-400',
    'bg-green-400',
    'bg-red-400'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
