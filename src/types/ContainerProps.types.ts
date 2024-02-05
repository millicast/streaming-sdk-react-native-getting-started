import React from 'react';
import { ViewProps } from 'react-native';

export type ContainerProps = ViewProps & {
  children: React.ReactNode;
};
