const withSass = require('@zeit/next-sass');
const { websiteUrl, nvisionKey } = require('./src/constant/configWebsite');

module.exports = withSass({
  compress: true,
  devIndicators: {
    autoPrerender: false,
  },
  crossOrigin: 'anonymous',
  webpack: (config, { dev }) => {
    const newConfig = config;
    if (dev) {
      newConfig.resolve.alias['@nipacloud/nvision'] = '@nipacloud/nvision/dist/browser/nvision.js';
      newConfig.module.rules.push({
        test: /\.js|jsx|ts|tsx$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // eslint options (if necessary)
        },
      });
    }
    return newConfig;
  },
  env: {},
  serverRuntimeConfig: {
    BASE_URL: websiteUrl,
    NVISION_KEY: nvisionKey,
  },
  publicRuntimeConfig: {
    BASE_URL: websiteUrl,
    NVISION_KEY: nvisionKey,
  },
});
