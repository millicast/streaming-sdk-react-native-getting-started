import { Layout } from '@dolbyio/uikit-react-native';
import React, { useEffect, useLayoutEffect } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, View, Alert, Platform, LogBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import StreamList from '../../components/StreamList';
import Text from '../../components/text/Text';
import { WelcomeFooter } from '../../components/WelcomeFooter/WelcomeFooter';
import { addStream, deleteAllStreams } from '../../store/reducers/savedStreams';
import { Routes } from '../../types/routes.types';
import { StreamInfo } from '../../types/StreamInfo.types';
import IconButton from '../../uikit/components/IconButton/IconButton';

import makeStyles from './SavedStreams.style';

export const SavedStreams = ({ navigation }) => {
  const styles = makeStyles();
  const dispatch = useDispatch();
  const intl = useIntl();

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
          <IconButton backgroundColor="transparent" icon="trash" size="m" onPress={clearSavedStreamsAlert} />
        ),
    });
  }, [streamsList]);

  return (
    <Layout testID="SavedStreamsScreen">
      <SafeAreaView style={styles.wrapper}>
        {Platform.isTV && (
          <View style={styles.headerViewWrapperTV}>
            <View />
            <Text id="savedStreamsHeaderText" type="H2" />
            {streamsList.length > 0 && (
              <IconButton backgroundColor="transparent" icon="trash" size="m" onPress={clearSavedStreamsAlert} />
            )}
          </View>
        )}
        {streamsList.length > 0 ? (
          <ScrollView>
            <View style={styles.streamListSectionHeaderWrapper}>
              <Text id="lastPlayedStreamText" type="bodyDefault" style={styles.streamListSectionHeaderText} />
            </View>
            <StreamList streams={streamsList.slice(0, 1)} onPlayStream={handlePlayStream} />
            <View style={styles.streamListSectionHeaderWrapper}>
              <Text id="allStreamsText" type="bodyDefault" style={styles.streamListSectionHeaderText} />
            </View>
            <StreamList streams={streamsList} onPlayStream={handlePlayStream} />
          </ScrollView>
        ) : (
          <View style={styles.noStreamsMessageWrapper}>
            <Text id="noSavedStreamsTitleText" type="h2" align="center" numberOfLines={2} />
            <Text id="noSavedStreamssubtitleText" type="bodyDefault" color="secondary.200" />
          </View>
        )}
      </SafeAreaView>
      <WelcomeFooter />
    </Layout>
  );
};
