const { defineConfig } = require('@vue/cli-service');

const importedScss = [
	'@import "@/assets/styles/mixins.scss";',
	'@import "@/assets/styles/variables.scss";',
	'@import "@/assets/styles/breakpoints.scss";',
].join(' ');

module.exports = defineConfig({
	publicPath: process.env.NODE_ENV === 'production' ? '/vui-cli/' : '/',
	transpileDependencies: true,
	css: {
		loaderOptions: {
			sass: {
				additionalData: importedScss,
			},
		},
	},
});
