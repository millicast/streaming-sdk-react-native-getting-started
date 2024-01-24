import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Routes } from '../types/routes.types';

import Viewer from './Viewer';

const Stack = createNativeStackNavigator();

export const Navigator = () => {
  const content = (
    <Stack.Navigator>
      <Stack.Screen name={Routes.UserInput} component={Viewer} />
    </Stack.Navigator>
  );

  return content;
};
