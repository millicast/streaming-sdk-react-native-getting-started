import React from 'react';
import { View } from 'react-native';

import Text from '../text/Text';

import styles from './StreamStatusIndicator.style';

export const StreamStatusIndicator = ({ title, position }) => {
  return (
    <View style={[styles.container, position]}>
      <Text>{title}</Text>
    </View>
  );
};
