const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false,
});

module.exports = withBundleAnalyzer({
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        net: "empty",
      };
    }

    return config;
  },
});
