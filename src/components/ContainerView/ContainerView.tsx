/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { View, SafeAreaView, Platform } from 'react-native';

import { ContainerProps } from '../../types/ContainerProps.types';

export const ContainerView = ({ children, ...props }: ContainerProps) => {
  return Platform.isTV && Platform.OS === 'ios' ? (
    <View {...props}>{children}</View>
  ) : (
    <SafeAreaView {...props}>{children}</SafeAreaView>
  );
};
