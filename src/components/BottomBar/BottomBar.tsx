import { Icon } from '@dolbyio/uikit-react-native';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import styles from './BottomBar.style';

export const BottomBar = ({ displayStatsInformation }) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => {
          displayStatsInformation();
        }}
      >
        <Icon testID="infoIcon" name="info" size="m" />
      </TouchableOpacity>
    </View>
  );
};
