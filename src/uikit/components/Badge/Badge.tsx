import type { ColorKey } from '../../theme/types';
import React from 'react';
import { View } from 'react-native';

import useTheme from '../../hooks/useTheme';
import Text from '../Text/Text';

import styles from './Badge.style';

export type BadgeProps = {
  content: string | number;
  backgroundColor?: ColorKey;
  contentColor?: ColorKey;
  testID?: string;
};

const Badge = ({ content, backgroundColor, contentColor, testID }: BadgeProps) => {
  const {
    theme: { fontFamily },
    colors,
    getColor,
  } = useTheme();
  const themeStyles = {
    fontFamily,
    backgroundColor: getColor(backgroundColor, colors.grey[300]),
    textAlign: 'center',
  };

  const styleGroup = [styles.badge, themeStyles];
  return (
    <View testID={testID} style={styleGroup}>
      <Text testID="badgeText" align="center" color={contentColor} type="caption">
        {content}
      </Text>
    </View>
  );
};

export default Badge;
