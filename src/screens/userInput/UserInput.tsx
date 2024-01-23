import { Layout, Input, Button } from '@dolbyio/uikit-react-native';
import { StackActions } from '@react-navigation/native';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import Text from '../../components/text/Text';
import { WelcomeFooter } from '../../components/WelcomeFooter/WelcomeFooter';
import { Routes } from '../../types/routes.types';

import makeStyles from './UserInput.style';

export const UserInput = ({ navigation }) => {
  const styles = makeStyles();
  const intl = useIntl();
  const dispatch = useDispatch();

  const [streamName, setStreamName] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');

  const streamNameInputLabel = intl.formatMessage({
    id: 'streamNameInputLabel',
  });

  const accountIdInputLabel = intl.formatMessage({
    id: 'accountIdInputLabel',
  });

  const handlePlayClick = () => {
    play(streamName, accountId);
  };

  const play = (streamName: string, accountId: string) => {
    dispatch({
      type: 'viewer/setStreamName',
      payload: streamName,
    });
    dispatch({
      type: 'viewer/setAccountId',
      payload: accountId,
    });
    navigation.navigate(Routes.Viewer);
  };

  const handleDemoPlayClick = () => {
    play('simulcastmultiview', 'k9Mwad');
  };

  const onChangeStreamName = (text: string) => {
    // validateInput(text);
    setStreamName(text);
  };

  const onChangeAccountId = (text: string) => {
    // validateInput(text);
    setAccountId(text);
  };

  return (
    <Layout testID="UserInputScreen">
      <SafeAreaView style={styles.wrapper}>
        <ScrollView>
          <Text id="appTitle" type="h2" align="center" style={{ paddingTop: 16 }} />
          <Text id="startStream" type="h3" align="center" style={{ paddingTop: 16 }} />
          <Text id="startStreamLabel" type="paragraph" align="center" style={{ paddingTop: 16 }} />
          <Input
            value={streamName}
            label={streamNameInputLabel}
            textColor="white"
            onChangeText={onChangeStreamName}
            validation={() => {}}
            autoFocus
          />
          <Input
            value={accountId}
            label={accountIdInputLabel}
            textColor="white"
            onChangeText={onChangeAccountId}
            validation={() => {}}
            autoFocus
          />
          <Button title="play" type="primary" onPress={handlePlayClick} />
          <Text id="demoTitle" type="h2" align="center" style={{ paddingTop: 16 }} />
          <Text id="demoLabel" type="paragraph" align="center" style={{ paddingTop: 16 }} />
          <Button title="playDemoStream" type="secondaryDark" onPress={handleDemoPlayClick} />
        </ScrollView>
      </SafeAreaView>
      <WelcomeFooter />
    </Layout>
  );
};
