import { Icon } from '@dolbyio/uikit-react-native';
import useTheme from '@dolbyio/uikit-react-native/hooks/useAppTheme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';

import Viewer from '../components/Viewer';
import { Routes } from '../types/routes.types';

import UserInput from './userInput';

const Stack = createNativeStackNavigator();

export const Navigator = () => {
  const { theme } = useTheme();

  const content = (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleAlign: 'center',
        headerTintColor: theme.colors.white, // FIXME: Use a different color defined in the themes
        headerBackTitleVisible: false,
        // hide the header bar for tvOS due to incompatibility of the library
        headerShown: !(Platform.OS === 'ios' && Platform.isTV),
      }}
    >
      <Stack.Screen name={Routes.UserInput} component={UserInput} />
      <Stack.Screen name={Routes.Viewer} component={Viewer} />
    </Stack.Navigator>
  );

  return content;
};
