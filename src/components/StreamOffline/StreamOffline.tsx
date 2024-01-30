import React from 'react';
import { View } from 'react-native';

import Text from '../text/Text';

import styles from './StreamOffline.style';

export const StreamOffline = () => {
  return (
    <View style={styles.wrapper}>
      <Text id="streamOffline" type="h2" align="center" style={{ paddingTop: 50 }} />
      <Text id="waitToBegin" type="h5" align="center" style={{ paddingTop: 10 }} />
    </View>
  );
};
