// const withPWA = require("next-pwa");
// const runtimeCaching = require("next-pwa/cache");

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

module.exports =
	//withPWA(
	{
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
			loader: "custom",
		},
		/*pwa: {
    disable: process.env.NODE_ENV !== "production",
    dest: "public",
    runtimeCaching,
    buildExcludes: [/middleware-manifest.json$/],
  },*/
	};
//);
