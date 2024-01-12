import React from 'react';
import { View } from 'react-native';

import useTheme from '../../../hooks/useAppTheme';
import type { ColorKey } from '../../../theme/types';
import Icon from '../../Icon/Icon';
import type { IconComponentName } from '../../Icon/IconComponents';

import styles from './IconIndicator.style';

type IconIndicatorProps = {
  icon: IconComponentName;
  backgroundColor?: ColorKey;
  // TODO add gradient
  iconColor?: ColorKey;
  size?: 'small' | 'medium';
  testID?: string;
};

const IconIndicator = ({ icon, backgroundColor, iconColor, size = 'medium', testID }: IconIndicatorProps) => {
  const { colors, getColor } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.indicator,
        size === 'small' && styles.small,
        { backgroundColor: getColor(backgroundColor, colors.whiteAlpha[500]) },
      ]}
    >
      <Icon name={icon} color={iconColor} size={size === 'medium' ? 's' : 'xs'} />
    </View>
  );
};

export default IconIndicator;
