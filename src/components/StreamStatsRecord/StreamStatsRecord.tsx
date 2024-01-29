import React from 'react';
import { View } from 'react-native';

import Text from '../text/Text';

import styles from './StreamStatsRecord.style';

export const StreamStatsRecord = ({ param, value, paramType, valueType }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.contentStyle}>
        <Text type={paramType}>{param}</Text>
      </View>
      <View style={styles.contentStyle}>
        <Text type={valueType}>{value}</Text>
      </View>
    </View>
  );
};