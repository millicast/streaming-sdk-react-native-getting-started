import React from 'react';
import { FlatList } from 'react-native';

import { StreamInfo } from '../../types/StreamInfo.types';
import StreamDetail from '../StreamDetail';

import styles from './StreamList.style';

export const StreamList = ({
  streams,
  onPlayStream,
}: {
  streams: StreamInfo[];
  onPlayStream: (stream: StreamInfo) => void;
}) => {
  return (
    <FlatList
      style={styles.wrapper}
      data={streams}
      renderItem={({ item }) => <StreamDetail stream={item} onPlay={onPlayStream} />}
      keyExtractor={(item) => item.streamName + item.accountId}
    />
  );
};
