import { Layout, Button } from '@dolbyio/uikit-react-native';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, View, Pressable, LogBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import StreamList from '../../components/StreamList';
import Text from '../../components/text/Text';
import { WelcomeFooter } from '../../components/WelcomeFooter/WelcomeFooter';
import { addStream } from '../../store/reducers/savedStreams';
import { Routes } from '../../types/routes.types';
import { StreamInfo } from '../../types/StreamInfo.types';

import makeStyles from './RecentStreams.style';

export const RecentStreams = ({ navigation }) => {
  const styles = makeStyles();
  const intl = useIntl();
  const dispatch = useDispatch();

  const streamsList: StreamInfo[] = useSelector((state) => state.persistedSavedStreamsReducer.streams);

  const playNewStreamTitle = intl.formatMessage({
    id: 'playNewStream',
  });

  const handlePlayNewStreamClick = () => {
    navigation.navigate(Routes.UserInput);
  };

  const handleViewAllClick = () => {
    // TODO: Navigate to View all streams
  };

  const handlePlayStreamClick = (stream: StreamInfo) => {
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
    if (streamsList.length === 0) {
      navigation.navigate(Routes.UserInput);
    }
  }, [streamsList]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <Layout testID="RecentStreamsScreen">
      <SafeAreaView style={styles.wrapper}>
        <ScrollView>
          <Text id="appTitle" type="h1" align="center" />
          <Text
            id="recentStreamsInfoText"
            color="secondary.200"
            type="bodyDefault"
            align="center"
            style={styles.recentStreamsInfoText}
          />
          <View style={styles.streamListHeaderWrapper}>
            <Text id="recentlyViewedText" type="bodyDefault" style={styles.recentlyViewedText} />
            <Pressable onPress={handleViewAllClick} testID="viewAllButton">
              <Text id="viewAllButtonText" type="bodyDefault" color="secondary.200" />
            </Pressable>
          </View>
          <StreamList streams={streamsList.slice(0, 3)} onPlayStream={handlePlayStreamClick} />
          <Text id="alternateOptionText" type="paragraph" align="center" style={styles.alternateOptionText} />
          <Button title={playNewStreamTitle} type="primary" onPress={handlePlayNewStreamClick} />
        </ScrollView>
      </SafeAreaView>
      <WelcomeFooter />
    </Layout>
  );
};
