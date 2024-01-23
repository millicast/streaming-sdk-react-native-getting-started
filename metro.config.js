/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('metro-config');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

const config = {
  resolver: {},
};

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    ...config,
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      ...config.resolver,
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };
})();
