import React from 'react';
import { View } from 'react-native';

import { StreamInfo } from '../../types/StreamInfo.types';
import IconButton from '../../uikit/components/IconButton/IconButton';
import Text from '../text/Text';

import styles from './StreamDetail.style';

export const StreamDetail = ({ stream, onPlay }: { stream: StreamInfo; onPlay: (stream: StreamInfo) => void }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.textWrapper}>
        <Text type="bodyDefault" style={styles.streamNameText}>
          {stream.streamName}
        </Text>
        <View style={styles.accountIdTextWrapper}>
          <Text id="accountIDLabel" type="bodyDefault" style={styles.accountIdText} />
          <Text type="bodyDefault" color="secondary.200">
            {stream.accountId}
          </Text>
        </View>
      </View>
      <IconButton backgroundColor="transparent" icon="playOutline" size="m" onPress={() => onPlay(stream)} />
    </View>
  );
};
