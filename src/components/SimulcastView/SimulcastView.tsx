import React from 'react';
import { View, TouchableOpacity, FlatList, Platform } from 'react-native';

import Icon from '../../uikit/components/Icon/Icon';
import Text from '../text/Text';

import styles from './SimulcastView.style';

export const SimulcastView = ({ streamQualityList, selectedStreamQuality, onClose, onSelectStreamQuality }) => {
  const isSelected = (streamQuality) => {
    return selectedStreamQuality === streamQuality;
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        onSelectStreamQuality(item);
      }}
    >
      <View style={styles.simulcastCell}>
        {isSelected(item.streamQuality) && <Icon testID="checkmarkIcon" name="checkmark" size="xs" />}
        <Text style={{ alignSelf: 'center', height: '100%' }} type="bodyDefault">
          {item.streamQuality}
        </Text>
      </View>
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
