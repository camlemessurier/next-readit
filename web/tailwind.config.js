module.exports = {
	purge: ["./src/pages/**/*.tsx", "./src/components/**/*.tsx"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			spacing: {
				70: "17.5rem",
			},
			colors: {
				blue: {
					500: "#0079d3",
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
