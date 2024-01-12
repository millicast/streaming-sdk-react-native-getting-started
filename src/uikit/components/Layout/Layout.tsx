import React from 'react';
import { View } from 'react-native';

import useTheme from '../../hooks/useAppTheme';
import type { ColorKey } from '../../theme/types';

import styles from './Layout.style';

type LayoutProps = {
  children: React.ReactNode;
  backgroundColor?: ColorKey;
  testID?: string;
};

const Layout = ({ children, backgroundColor, testID }: LayoutProps) => {
  const { colors, getColor } = useTheme();
  return (
    <View
      style={[
        styles.layout,
        {
          backgroundColor: getColor(backgroundColor, colors.background),
        },
      ]}
      testID={testID}
    >
      {children}
    </View>
  );
};

export default Layout;
