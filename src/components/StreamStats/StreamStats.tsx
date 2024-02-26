import { Icon } from '@dolbyio/uikit-react-native';
import React from 'react';
import { View, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useSelector } from 'react-redux';

import { StreamStatInfo } from '../../types/StreamStatInfo.types';
import { StreamStatsRecord } from '../StreamStatsRecord/StreamStatsRecord';
import Text from '../text/Text';

import styles from './StreamStats.style';

const convertBytes = (bytes: number) => {
  const toMB = 1024 * 1024;
  const toKB = 1024;
  if (Math.round(bytes / toMB) > 0) {
    return `${(bytes / toMB).toFixed(2)} MB`;
  }
  return `${(bytes / toKB).toFixed(2)} KB`;
};

const prepareStatsRecordsList = (statsObj: any): Array<StreamStatInfo> => {
  const statsRecordsList: Array<StreamStatInfo> = [];

  if (statsObj === null) {
    return [];
  }

  statsRecordsList.push({ param: 'MID', value: `${statsObj.audioInbounds.mid}, ${statsObj.videoInbounds.mid}` });
  statsRecordsList.push({
    param: 'Video Resolution',
    value: `${statsObj.videoInbounds.frameWidth} x ${statsObj.videoInbounds.frameHeight}`,
  });
  statsRecordsList.push({ param: 'FPS', value: `${statsObj.videoInbounds.framesPerSecond}` });
  statsRecordsList.push({
    param: 'Audio Total Received',
    value: `${convertBytes(statsObj.audioInbounds.totalBytesReceived)}`,
  });
  statsRecordsList.push({
    param: 'Video Total Received',
    value: `${convertBytes(statsObj.videoInbounds.totalBytesReceived)}`,
  });
  statsRecordsList.push({ param: 'Audio Packets Received', value: `${statsObj.audioInbounds.totalPacketsReceived}` });
  statsRecordsList.push({ param: 'Video Packets Received', value: `${statsObj.videoInbounds.totalPacketsReceived}` });
  statsRecordsList.push({ param: 'Audio Jitter', value: `${statsObj.audioInbounds.jitter * 1000} ms` });
  statsRecordsList.push({ param: 'Video Jitter', value: `${statsObj.videoInbounds.jitter * 1000} ms` });
  statsRecordsList.push({ param: 'Audio Packets Loss', value: `${statsObj.audioInbounds.totalPacketsLost}` });
  statsRecordsList.push({ param: 'Video Packets Loss', value: `${statsObj.videoInbounds.totalPacketsLost}` });
  statsRecordsList.push({
    param: 'Codecs',
    value: `${statsObj.audioInbounds.mimeType}, ${statsObj.videoInbounds.mimeType}`,
  });
  statsRecordsList.push({ param: 'Current Round Trip Time', value: `${statsObj.currentRoundTripTime * 1000} ms` });

  return statsRecordsList;
};

export const StreamStats = ({ onPress }) => {
  const renderItem = ({ item }) => (
    <StreamStatsRecord param={item.param} paramType="paragraph" value={item.value} valueType="paragraph" />
  );
  const rawStreamStats = useSelector((state) => state.viewerReducer.streamStats);

  const statsRecordsList = prepareStatsRecordsList(rawStreamStats);

  return (
    <View style={Platform.isTV ? styles.outerContainerTV : styles.outerContainer}>
      <View style={styles.closeIcon}>
        <TouchableOpacity testID="closeIconButton" hasTVPreferredFocus onPress={onPress}>
          <Icon testID="closeIcon" name="close" size="s" />
        </TouchableOpacity>
      </View>

      <View style={styles.innerContainer}>
        <Text
          testID="streamInfoTitle"
          id="streamInfoTitle"
          type="h2"
          align={Platform.isTV ? 'left' : 'center'}
          style={{ paddingTop: 16, paddingLeft: 16 }}
        />
        <View style={styles.streamInfoContainer}>
          <StreamStatsRecord param="Name" paramType="h3" value="Value" valueType="h3" />
          <FlatList
            testID="streamStatsInfoView"
            data={statsRecordsList}
            keyExtractor={(item) => item.param}
            renderItem={renderItem}
          />
        </View>
      </View>
    </View>
  );
};
