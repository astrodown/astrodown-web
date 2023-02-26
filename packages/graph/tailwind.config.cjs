/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{tsx,html}"],
	theme: {
		extend: {
			fontFamily: {
				sans: "Roboto, sans-serif;",
				mono: "Fira Code, monospace;",
				serif: "'Roboto Slab', serif;",
			},
		},
	},
	plugins: [],
};
