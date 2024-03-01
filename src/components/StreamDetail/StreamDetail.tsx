import React, { useState } from 'react';
import { Platform, View } from 'react-native';

import { StreamInfo } from '../../types/StreamInfo.types';
import Icon from '../../uikit/components/Icon/Icon';
import { FocusedComponent } from '../FocusedComponent/FocusedComponent';
import Text from '../text/Text';

import styles from './StreamDetail.style';

export const StreamDetail = ({
  sectionName,
  stream,
  onPlay,
}: {
  sectionName: string;
  stream: StreamInfo;
  onPlay: (stream: StreamInfo) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const defaultIconColor = !Platform.isTV ? 'white' : 'grey';
  const iconSize = Platform.isTV && Platform.OS === 'android' ? 's' : 'm';
  const iconColor = isFocused ? 'white' : defaultIconColor;

  return (
    <FocusedComponent
      onPress={() => onPlay(stream)}
      setParentFocus={setIsFocused}
      underlayColor="none"
      testID={`${sectionName}.${stream.streamName}`}
    >
      <View style={[styles.wrapper, isFocused ? styles.wrapperInFocus : {}]}>
        <View style={styles.textWrapper}>
          <Text testID={`${sectionName}.${stream.streamName}`} type="bodyDefault" style={styles.streamNameText}>
            {stream.streamName}
          </Text>
          <View style={styles.accountIdTextWrapper}>
            <Text
              testID={`${sectionName}.${stream.streamName}.accountIDLabel`}
              id="accountIDLabel"
              type="bodyDefault"
              style={styles.accountIdText}
            />
            <Text testID={`${sectionName}.${stream.accountId}`} type="bodyDefault" color="secondary.200">
              {stream.accountId}
            </Text>
          </View>
        </View>
        <Icon
          testID={`playOutline.${sectionName}.${stream.streamName}`}
          backgroundColor="transparent"
          name="playOutline"
          size={iconSize}
          color={iconColor}
        />
      </View>
    </FocusedComponent>
  );
};
