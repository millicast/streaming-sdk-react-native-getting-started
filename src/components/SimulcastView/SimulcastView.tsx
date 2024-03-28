import { Icon } from '@dolbyio/uikit-react-native';
import React from 'react';
import { View, TouchableOpacity, FlatList, Platform } from 'react-native';

import Text from '../text/Text';

import styles from './SimulcastView.style';

export const SimulcastView = ({ streamQualityList, onClose, onSelectStreamQuality }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        onSelectStreamQuality(item);
      }}
    >
      <Text type="bodyDefault">{item.streamQuality}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={Platform.isTV ? styles.outerContainerTV : styles.outerContainer}>
      <View style={styles.closeIcon}>
        <TouchableOpacity testID="closeIconButton" hasTVPreferredFocus onPress={onClose}>
          <Icon testID="closeIcon" name="close" size="s" />
        </TouchableOpacity>
      </View>
      <View style={styles.innerContainer}>
        <Text
          testID="simulcastTitle"
          id="simulcastTitle"
          type="h2"
          align={Platform.isTV ? 'left' : 'center'}
          style={{ paddingTop: 16, paddingLeft: 16 }}
        />
        <View style={styles.simulcastOptionsContainer}>
          <FlatList
            testID="simulcastList"
            data={streamQualityList}
            keyExtractor={(item) => item.streamQuality}
            renderItem={renderItem}
          />
        </View>
      </View>
    </View>
  );
};
