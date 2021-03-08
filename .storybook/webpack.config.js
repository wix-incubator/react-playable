const yoshiWebpackConfig = require('@wix/yoshi/config/webpack.config.storybook');

module.exports = (config, env, defaultConfig) => {
  return yoshiWebpackConfig(defaultConfig);
};
