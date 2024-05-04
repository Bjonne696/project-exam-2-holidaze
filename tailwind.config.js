export default {
	content: [
	  "./index.html",
	  "./src/**/*.{js,ts,jsx,tsx}",
	  "node_modules/daisyui/dist/**/*.js",
	  "node_modules/react-daisyui/dist/**/*.js"
	],
	theme: {
	  extend: {
		colors: {
		  'page-background': '#F9E9C3',
		  'card-background': '#F7FFF5',
		  'border-custom': '#810f0f',
		},
		height: {
		  '100': '25rem',
		},

		borderRadius: {
		  '25px': '25px',
		},
		borderWidth: {
		  '3': '3px',
		},
	  },
	},
	plugins: [require("daisyui")],
	daisyui: {
	  themes: false,
	},
  };