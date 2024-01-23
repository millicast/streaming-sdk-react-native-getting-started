import { Icon } from '@dolbyio/uikit-react-native';
import useTheme from '@dolbyio/uikit-react-native/hooks/useAppTheme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';

import { StreamInfo } from '../../types/StreamInfo.types';
import { Routes } from '../types/routes.types';

import MultiView from './multiview';
import RecentStreams from './recentStreams';
import UserInput from './userInput';

const Stack = createNativeStackNavigator();

const LogoTitle = () => {
  return <Icon name="dolbyLogo" color="white" />;
};

export const Navigator = () => {
  const { theme } = useTheme();
  const streamsList: StreamInfo[] = useSelector((state) => state.persistedSavedStreamsReducer.streams);

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
        headerShown: !(Platform.OS === 'ios' && Platform.isTV),
      }}
    >
      <Stack.Screen name={Routes.RecentStreams} component={RecentStreams} />
      <Stack.Screen
        name={Routes.UserInput}
        component={UserInput}
        options={{ headerBackVisible: streamsList.length > 0 }}
      />
      <Stack.Screen name={Routes.MultiView} component={MultiView} />
    </Stack.Navigator>
  );
};
