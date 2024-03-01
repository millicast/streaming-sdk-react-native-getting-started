import { Layout, Button } from '@dolbyio/uikit-react-native';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, View, LogBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import { FocusedComponent } from '../../components/FocusedComponent/FocusedComponent';
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
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const viewAllButtonTextType = isFocused ? 'h3' : 'bodyDefault';
  const viewAllButtonColor = isFocused ? 'white' : 'secondary.200';

  const playNewStreamTitle = intl.formatMessage({
    id: 'playNewStream',
  });

  const handlePlayNewStreamClick = () => {
    navigation.navigate(Routes.UserInput);
  };

  const handleViewAllClick = () => {
    navigation.navigate(Routes.SavedStreams);
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

  const navigateToUserInputIfRequired = () => {
    if (streamsList.length === 0) {
      navigation.reset({
        index: 0,
        routes: [{ name: Routes.UserInput }],
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Screen is focused
      navigateToUserInputIfRequired();
    }, [streamsList]),
  );

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <Layout testID="RecentStreamsScreen">
      <SafeAreaView style={styles.wrapper}>
        <ScrollView>
          <Text testID="appTitle" id="appTitle" type="h1" align="center" />
          <Text
            testID="recentStreamsInfoText"
            id="recentStreamsInfoText"
            color="secondary.200"
            type="bodyDefault"
            align="center"
            style={styles.recentStreamsInfoText}
          />
          <View style={styles.streamListHeaderWrapper}>
            <Text
              testID="recentlyViewedText"
              id="recentlyViewedText"
              type="bodyDefault"
              style={styles.recentlyViewedText}
            />
            <FocusedComponent
              name="viewAll"
              onPress={handleViewAllClick}
              underlayColor="none"
              testID="viewAllButton"
              setParentFocus={setIsFocused}
            >
              <Text
                testID="viewAllButtonText"
                id="viewAllButtonText"
                type={viewAllButtonTextType}
                color={viewAllButtonColor}
              />
            </FocusedComponent>
          </View>
          <StreamList
            sectionName="recentlyPlayed"
            streams={streamsList.slice(0, 3)}
            onPlayStream={handlePlayStreamClick}
          />
          <Text
            testID="alternateOptionText"
            id="alternateOptionText"
            type="paragraph"
            align="center"
            style={styles.alternateOptionText}
          />
          <Button
            testID="playNewStreamTitle"
            title={playNewStreamTitle}
            type="primary"
            onPress={handlePlayNewStreamClick}
          />
        </ScrollView>
      </SafeAreaView>
      <WelcomeFooter />
    </Layout>
  );
};
