// const withPWA = require("next-pwa");
// const runtimeCaching = require("next-pwa/cache");

const withTM = require("next-transpile-modules")(["pintura", "react-pintura"]);

const securityHeaders = () => [
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "X-Frame-Options",
		value: "SAMEORIGIN",
	},
	{
		key: "X-XSS-Protection",
		value: "1; mode=block",
	},
];

module.exports = withTM({
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	reactStrictMode: true,
	i18n: {
		locales: ["en", "nl"],
		defaultLocale: "en",
		localeDetection: false,
	},
	images: {
		domains: [
			"localhost",
			"localhost:3000",
			"localhost:3001",
			"www.datocms-assets.com",
			"www.treatdao.com",
			"treatdao.mypinata.cloud",
		],
	},
	/*pwa: {
    disable: process.env.NODE_ENV !== "production",
    dest: "public",
    runtimeCaching,
    buildExcludes: [/middleware-manifest.json$/],
  },*/
	// redirects
	async redirects() {
		return [
			{
				source: "/",
				destination: "/en",
				permanent: true,
			},
			{
				source: "/creators",
				destination: "/",
				permanent: true,
			},
			{
				source: "/creators/:slug",
				destination: "/:slug",
				permanent: true,
			},
		];
	},
	// enable cors
});
//);
