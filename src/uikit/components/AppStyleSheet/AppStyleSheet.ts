import { StyleSheet, Platform, PixelRatio } from 'react-native';

const processOuterStyleObject = (styleSheetObject, overload) => {
  return Object.keys(styleSheetObject).reduce((result, styleObjectName) => {
    // eslint-disable-next-line no-param-reassign
    result[styleObjectName] = processInnerStyleObject(styleSheetObject[styleObjectName], overload);
    return result;
  }, {});
};

const processInnerStyleObject = (styleObject, overload) => {
  const skippedStylePropsList = [
    'flex',
    'opacity',
    'elevation',
    // 'fontWeight',
    // 'letterSpacing',
    // 'lineHeight',
    // 'textShadowRadius',
  ];
  return Object.keys(styleObject).reduce((result, styleProp) => {
    if (typeof styleObject[styleProp] === 'number') {
      if (skippedStylePropsList.includes(styleProp)) {
        // eslint-disable-next-line no-param-reassign
        result[styleProp] = styleObject[styleProp];
      } else {
        // eslint-disable-next-line no-param-reassign
        result[styleProp] = applyScalingFactor(styleObject[styleProp]);
      }
    } else {
      // eslint-disable-next-line no-param-reassign
      result[styleProp] = styleObject[styleProp];
    }

    return { ...overload, ...result };
  }, {});
};

const applyScalingFactor = (size) => {
  const applyScalingFactorFactor = Platform.OS === 'android' && Platform.isTV ? 0.5 : 1.0;
  const newSize = size * applyScalingFactorFactor;
  const pixelSize = Math.round(PixelRatio.roundToNearestPixel(newSize));
  console.log(`lib pixelSize: ${pixelSize} - newSize: ${newSize} old : ${size}`);
  return pixelSize;
};

export const AppStyleSheet = {
  create: (styleSheetObject, overload = {}) => {
    const modifiedStyleSheetObject = processOuterStyleObject(styleSheetObject, overload);
    return StyleSheet.create(modifiedStyleSheetObject);
  },
};
