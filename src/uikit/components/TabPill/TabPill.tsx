import React from 'react';
import { Pressable, View } from 'react-native';

import useTheme from '../../hooks/useAppTheme';
import Icon from '../Icon/Icon';
import type { IconComponentName } from '../Icon/IconComponents';
import Text from '../Text/CustomText';

import styles from './TabPill.style';

export type TabPillProps = {
  title: string;
  isFocussed?: boolean;
  icon?: IconComponentName;
  onPress: () => void;
  testID?: string;
};

const TabPill = ({ title, isFocussed, icon, onPress, testID }: TabPillProps) => {
  const { colors } = useTheme();
  const bgColor = isFocussed ? colors.white : colors.grey[100];
  const fgColor = isFocussed ? 'primary.400' : 'grey.500';

  return (
    <Pressable onPress={onPress} style={[styles.container, { backgroundColor: bgColor?.toString() }]} testID={testID}>
      <Icon name={icon} color={fgColor} />
      <View style={{ width: 10 }} />
      <Text color={fgColor} uppercase>
        {title}
      </Text>
    </Pressable>
  );
};

export default TabPill;
