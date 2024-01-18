import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Routes } from '../types/routes.types';

import UserInput from './userInput';

const Stack = createNativeStackNavigator();

export const Navigator = () => {
  const content = (
    <Stack.Navigator>
      <Stack.Screen name={Routes.UserInput} component={UserInput} />
    </Stack.Navigator>
  );

  return content;
};
