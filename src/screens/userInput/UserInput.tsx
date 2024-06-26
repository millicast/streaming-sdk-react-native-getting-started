import { Layout, Input, Button, Icon, ValidationType } from '@dolbyio/uikit-react-native';
import useTheme from '@dolbyio/uikit-react-native/hooks/useAppTheme';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, View, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { FocusedComponent } from '../../components/FocusedComponent/FocusedComponent';
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
  const streamNameRef = useRef<TextInput>(null);
  const accountIdRef = useRef<TextInput>(null);

  const MINIMUM_INPUT_LENGTH = 3;

  const [streamName, setStreamName] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [validation, setValidation] = useState<ValidationType>({ valid: true });
  const [isDemoButtonFocused, setIsDemoButtonFocused] = useState<boolean>(false);
  const defaultDemoButtonIconColor = !Platform.isTV ? 'white' : 'grey';

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
    play('multiview', 'k9Mwad', false);
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
      value.length && value.length < MINIMUM_INPUT_LENGTH
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

  const streamsList: StreamInfo[] = useSelector((state) => state.persistedSavedStreamsReducer.streams);

  const resetNavigationStackIfRequired = () => {
    const currentRouteIndex = navigation.getState().index;

    if (streamsList.length > 0 && currentRouteIndex === 0) {
      navigation.reset({
        index: 1,
        routes: [{ name: Routes.RecentStreams }, { name: Routes.UserInput }],
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Screen is focused
      resetNavigationStackIfRequired();
    }, [streamsList]),
  );

  return (
    <Layout testID="UserInputScreen">
      <SafeAreaView style={styles.wrapper}>
        <ScrollView>
          <Text testID="appTitle" id="appTitle" type="h2" align="center" style={{ paddingTop: 16 }} />
          <Text testID="startStream" id="startStream" type="h3" align="center" style={{ paddingTop: 24 }} />
          <Text
            testID="startStreamLabel"
            id="startStreamLabel"
            type="paragraph"
            align="center"
            style={{ paddingTop: 8, paddingHorizontal: 48 }}
            color="grey.500"
          />
          <FocusedComponent hasTVPreferredFocus testID="StreamNameFocusElement" componentRef={streamNameRef}>
            <Input
              inputRef={streamNameRef}
              value={streamName}
              label={streamNameInputLabel}
              labelColor="white"
              labelBackground={theme.colors.background}
              textColor="white"
              onChangeText={onChangeStreamName}
              validation={validation}
              autoFocus={!Platform.isTV}
              testID="StreamNameInput"
              onSubmitEditing={() => accountIdRef.current.focus()}
            />
          </FocusedComponent>
          <FocusedComponent testID="AccountIdFocusElement" componentRef={accountIdRef}>
            <Input
              inputRef={accountIdRef}
              value={accountId}
              label={accountIdInputLabel}
              labelColor="white"
              labelBackground={theme.colors.background}
              textColor="white"
              onChangeText={onChangeAccountId}
              validation={validation}
              testID="AccountIdInput"
              onSubmitEditing={() => {
                if (Platform.isTV && Platform.OS === 'android') {
                  // FIXME: Workaround in Android TV's to keep the focus directed 
                  // to another input field otherwise the focus is lost.
                  streamNameRef.current.focus()
                }
              }}
            />
          </FocusedComponent>
          <Button
            title="play"
            type="primary"
            onPress={handlePlayClick}
            disabled={playDisabled(validation, streamName, accountId)}
            testID="PlayButton"
          />
          <Text testID="demoTitle" id="demoTitle" type="h2" align="center" style={{ paddingTop: 48 }} />
          <Text
            testID="demoLabel"
            id="demoLabel"
            type="paragraph"
            align="center"
            style={{ paddingTop: 8 }}
            color="grey.500"
          />
          <View style={{ paddingTop: 16 }} />
          <FocusedComponent
            onPress={handleDemoPlayClick}
            style={styles.demoButton}
            styleInFocus={styles.demoButtonInFocus}
            setParentFocus={setIsDemoButtonFocused}
            testID="DemoButtonFocusElement"
          >
            <>
              <Text testID="playDemoStream" id="playDemoStream" type="paragraph" />
              <Icon
                testID="playOutline"
                name="playOutline"
                color={isDemoButtonFocused ? 'white' : defaultDemoButtonIconColor}
              />
            </>
          </FocusedComponent>
        </ScrollView>
      </SafeAreaView>
      <WelcomeFooter />
    </Layout>
  );
};
