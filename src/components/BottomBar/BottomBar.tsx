import { Icon } from '@dolbyio/uikit-react-native';
import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';

import styles from './BottomBar.style';

export const BottomBar = ({ displayStatsInformation, displaySimulcastSelection, focus }) => {
  const iconSize = Platform.OS === 'android' && Platform.isTV ? 's' : 'm';
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        testID="infoIconButton"
        hasTVPreferredFocus={focus}
        onPress={() => {
          displayStatsInformation();
        }}
      >
        <Icon testID="infoIcon" name="info" size={iconSize} />
      </TouchableOpacity>
      <TouchableOpacity
        testID="settingsIconButton"
        hasTVPreferredFocus={focus}
        onPress={() => {
          displaySimulcastSelection();
        }}
      >
        <Icon testID="settingsIcon" name="settings" size={iconSize} />
      </TouchableOpacity>
    </View>
  );
};
