import React from 'react';
import { View } from 'react-native';

import Text from '../text/Text';

import styles from './WelcomeFooter.style';

export const WelcomeFooter = () => {
  return (
    <View style={styles.wrapper}>
      <Text testID="copyright" id="copyright" type="captionBold" align="center" color="secondary.200" />
    </View>
  );
};
