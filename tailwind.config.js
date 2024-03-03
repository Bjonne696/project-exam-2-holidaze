/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "node_modules/daisyui/dist/**/*.js", "node_modules/react-daisyui/dist/**/*.js"],
	theme: {
	  extend: {
		colors: {
		  'page-background': '#F9E9C3',
		  'card-background': '#F7FFF5',
		},
	  },
	},
	plugins: [require("daisyui")],
	darkMode: "class",
  };