import React from 'react';
import { View } from 'react-native';

import Text from '../text/Text';

import styles from './StreamStatusIndicator.style';

export const StreamStatusIndicator = ({ title, position }) => {
  return (
    <View testID="streamStatusIndicator" style={[styles.container, position]}>
      <Text testID={title}>{title}</Text>
    </View>
  );
};
