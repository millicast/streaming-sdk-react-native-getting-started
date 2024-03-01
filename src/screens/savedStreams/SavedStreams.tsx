import { Layout } from '@dolbyio/uikit-react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, View, Alert, Platform, LogBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import { FocusedComponent } from '../../components/FocusedComponent/FocusedComponent';
import StreamList from '../../components/StreamList';
import Text from '../../components/text/Text';
import { WelcomeFooter } from '../../components/WelcomeFooter/WelcomeFooter';
import { addStream, deleteAllStreams } from '../../store/reducers/savedStreams';
import { Routes } from '../../types/routes.types';
import { StreamInfo } from '../../types/StreamInfo.types';
import Icon from '../../uikit/components/Icon/Icon';

import makeStyles from './SavedStreams.style';

export const SavedStreams = ({ navigation }) => {
  const styles = makeStyles();
  const dispatch = useDispatch();
  const intl = useIntl();

  const [isFocused, setIsFocused] = useState(false);
  const defaultIconSize = Platform.isTV && Platform.OS === 'android' ? 'xs' : 'm';
  const defaultIconColor = Platform.isTV ? 'grey' : 'white';
  const iconColor = isFocused ? 'white' : defaultIconColor;

  const savedStreamsHeaderText = intl.formatMessage({
    id: 'savedStreamsHeaderText',
  });
  const clearSavedStreamsAlertText = intl.formatMessage({
    id: 'clearSavedStreamsAlertText',
  });
  const clearSavedStreamsAlertCancelButton = intl.formatMessage({
    id: 'clearSavedStreamsAlertCancelButton',
  });
  const clearSavedStreamsAlertClearButton = intl.formatMessage({
    id: 'clearSavedStreamsAlertClearButton',
  });
  const streamsList: StreamInfo[] = useSelector((state) => state.persistedSavedStreamsReducer.streams);

  const handleDeleteAllStreams = () => {
    dispatch(deleteAllStreams());
  };

  const clearSavedStreamsAlert = () =>
    Alert.alert(clearSavedStreamsAlertText, '', [
      {
        text: clearSavedStreamsAlertCancelButton,
        style: 'cancel',
      },
      { text: clearSavedStreamsAlertClearButton, onPress: () => handleDeleteAllStreams(), style: 'destructive' },
    ]);

  const handlePlayStream = (stream: StreamInfo) => {
    dispatch({
      type: 'viewer/setStreamName',
      payload: stream.streamName,
    });
    dispatch({
      type: 'viewer/setAccountId',
      payload: stream.accountId,
    });
    navigation.navigate(Routes.MultiView);
    // Save stream information
    dispatch(addStream(stream));
  };

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !Platform.isTV,
      headerTitle: savedStreamsHeaderText,
      headerRight: () =>
        streamsList.length > 0 && (
          <FocusedComponent testID="trashIconButton" onPress={clearSavedStreamsAlert} setParentFocus={setIsFocused}>
            <Icon testID="trashIcon" name="trash" size={defaultIconSize} color={iconColor} />
          </FocusedComponent>
        ),
    });
  }, [streamsList]);

  return (
    <Layout testID="SavedStreamsScreen">
      <SafeAreaView style={styles.wrapper}>
        {Platform.isTV && (
          <View style={styles.headerViewWrapperTV}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text testID="savedStreamsHeaderText" id="savedStreamsHeaderText" type="H2" />
            </View>
            {streamsList.length > 0 && (
              <FocusedComponent testID="trashIconButton" onPress={clearSavedStreamsAlert} setParentFocus={setIsFocused}>
                <Icon testID="trashIcon" name="trash" size={defaultIconSize} color={iconColor} />
              </FocusedComponent>
            )}
          </View>
        )}
        {streamsList.length > 0 ? (
          <ScrollView>
            <View style={styles.streamListSectionHeaderWrapper}>
              <Text
                testID="lastPlayedStreamText"
                id="lastPlayedStreamText"
                type="bodyDefault"
                style={styles.streamListSectionHeaderText}
              />
            </View>
            <StreamList sectionName="lastPlayed" streams={streamsList.slice(0, 1)} onPlayStream={handlePlayStream} />
            <View style={styles.streamListSectionHeaderWrapper}>
              <Text
                testID="allStreamsText"
                id="allStreamsText"
                type="bodyDefault"
                style={styles.streamListSectionHeaderText}
              />
            </View>
            <StreamList sectionName="allPlayed" streams={streamsList} onPlayStream={handlePlayStream} />
          </ScrollView>
        ) : (
          <View style={styles.noStreamsMessageWrapper}>
            <Text
              testID="noSavedStreamsTitleText"
              id="noSavedStreamsTitleText"
              type="h2"
              align="center"
              numberOfLines={2}
            />
            <Text
              testID="noSavedStreamssubtitleText"
              id="noSavedStreamssubtitleText"
              type="bodyDefault"
              color="secondary.200"
            />
          </View>
        )}
      </SafeAreaView>
      <WelcomeFooter />
    </Layout>
  );
};
