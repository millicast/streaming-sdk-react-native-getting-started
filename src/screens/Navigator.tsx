import { Icon } from '@dolbyio/uikit-react-native';
import useTheme from '@dolbyio/uikit-react-native/hooks/useAppTheme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Platform, LogBox } from 'react-native';
import { useSelector } from 'react-redux';

import ErrorView from '../components/errorview/ErrorView';
import { Routes } from '../types/routes.types';
import { StreamInfo } from '../types/StreamInfo.types';

import MultiView from './multiview';
import RecentStreams from './recentStreams';
import SavedStreams from './savedStreams';
import SingleStreamView from './singleStreamView';
import UserInput from './userInput';

const Stack = createNativeStackNavigator();

const LogoTitle = () => {
  return <Icon testID="dolbyLogo" name="dolbyLogo" color="white" />;
};

export const Navigator = () => {
  const { theme } = useTheme();
  const streamsList: StreamInfo[] = useSelector((state) => state.persistedSavedStreamsReducer.streams);

  useEffect(() => {
    LogBox.ignoreLogs(['Persistent storage is not supported on tvOS']);
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitle: () => <LogoTitle />,
        headerTitleAlign: 'center',
        headerTintColor: theme.colors.white, // FIXME: Use a different color defined in the themes
        headerBackTitleVisible: false,
        // hide the header bar for tvOS due to incompatibility of the library
        headerShown: !Platform.isTV,
      }}
    >
      <Stack.Group>
        <Stack.Screen name={Routes.RecentStreams} component={RecentStreams} />
        <Stack.Screen name={Routes.SavedStreams} component={SavedStreams} />
        <Stack.Screen
          name={Routes.UserInput}
          component={UserInput}
          options={{ headerBackVisible: streamsList.length > 0 }}
        />
        <Stack.Screen name={Routes.MultiView} component={MultiView} />
        <Stack.Screen name={Routes.SingleStreamView} component={SingleStreamView} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'fullScreenModal', headerShown: false }}>
        <Stack.Screen name={Routes.ErrorView} component={ErrorView} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
