import { Layout, Input, Button, Icon, ValidationType } from '@dolbyio/uikit-react-native';
import useTheme from '@dolbyio/uikit-react-native/hooks/useAppTheme';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Pressable, ScrollView, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import Text from '../../components/text/Text';
import { WelcomeFooter } from '../../components/WelcomeFooter/WelcomeFooter';
import { addStream } from '../../store/reducers/savedStreams';
import { Routes } from '../../types/routes.types';
import { StreamInfo } from '../../types/StreamInfo.types';

import makeStyles from './UserInput.style';

export const UserInput = ({ navigation }) => {
  const styles = makeStyles();
  const intl = useIntl();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const MINIMUM_INPUT_LENGTH = 3;

  const [streamName, setStreamName] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [validation, setValidation] = useState<ValidationType>({ valid: true });

  const streamNameInputLabel = intl.formatMessage({
    id: 'streamNameInputLabel',
  });

  const accountIdInputLabel = intl.formatMessage({
    id: 'accountIdInputLabel',
  });

  const handlePlayClick = () => {
    play(streamName, accountId, true);
  };

  const play = (streamName: string, accountId: string, save: boolean) => {
    dispatch({
      type: 'viewer/setStreamName',
      payload: streamName,
    });
    dispatch({
      type: 'viewer/setAccountId',
      payload: accountId,
    });
    navigation.navigate(Routes.MultiView);

    if (save) {
      // Save stream information
      const streamInfo: StreamInfo = { streamName, accountId };
      dispatch(addStream(streamInfo));
    }
  };

  const handleDemoPlayClick = () => {
    play('simulcastmultiview', 'k9Mwad', false);
  };

  const onChangeStreamName = (text: string) => {
    validateInput(text);
    setStreamName(text);
  };

  const onChangeAccountId = (text: string) => {
    validateInput(text);
    setAccountId(text);
  };

  const validateInput = (value: string) => {
    const valid = value.length >= MINIMUM_INPUT_LENGTH;
    setValidation(
      value.length && value.length >= MINIMUM_INPUT_LENGTH
        ? {
            valid,
            message: valid ? undefined : intl.formatMessage({ id: 'enterValidInputMessage' }),
          }
        : { valid: true },
    );
  };

  const playDisabled = (validation: ValidationType, streamName: string, accountId: string) => {
    return !(validation.valid && streamName.length >= MINIMUM_INPUT_LENGTH && accountId.length >= MINIMUM_INPUT_LENGTH);
  };

  return (
    <Layout testID="UserInputScreen">
      <SafeAreaView style={styles.wrapper}>
        <ScrollView>
          <Text id="appTitle" type="h2" align="center" style={{ paddingTop: 16 }} />
          <Text id="startStream" type="h3" align="center" style={{ paddingTop: 24 }} />
          <Text
            id="startStreamLabel"
            type="paragraph"
            align="center"
            style={{ paddingTop: 8, paddingHorizontal: 48 }}
            color="grey.500"
          />
          <Input
            value={streamName}
            label={streamNameInputLabel}
            labelColor="white"
            labelBackground={theme.colors.background}
            textColor="white"
            onChangeText={onChangeStreamName}
            validation={validation}
            autoFocus={!Platform.isTV}
          />
          <Input
            value={accountId}
            label={accountIdInputLabel}
            labelColor="white"
            labelBackground={theme.colors.background}
            textColor="white"
            onChangeText={onChangeAccountId}
            validation={validation}
          />
          <Button
            title="play"
            type="primary"
            onPress={handlePlayClick}
            disabled={playDisabled(validation, streamName, accountId)}
          />
          <Text id="demoTitle" type="h2" align="center" style={{ paddingTop: 48 }} />
          <Text id="demoLabel" type="paragraph" align="center" style={{ paddingTop: 8 }} color="grey.500" />
          <View style={{ paddingTop: 16 }} />

          <Pressable onPress={handleDemoPlayClick} style={styles.demoButton}>
            <Text id="playDemoStream" type="paragraph" />
            <Icon name="playOutline" />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
      <WelcomeFooter />
    </Layout>
  );
};
