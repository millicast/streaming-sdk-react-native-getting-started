import Color from 'color';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import useTheme from '../../hooks/useAppTheme';
import type { ColorKey, Sizes } from '../../theme/types';
import Badge from '../Badge/Badge';
import Icon, { ColorTone } from '../Icon/Icon';
import type { IconComponentName } from '../Icon/IconComponents';

import styles from './IconButton.style';

type IconButtonProps = {
  variant?: 'square' | 'rectangular' | 'circle';
  backgroundColor?: ColorKey | [ColorKey, ColorKey];
  iconColor?: ColorKey;
  badge?: string | number;
  badgeColor?: ColorKey;
  badgeContentColor?: ColorKey;
  strokeColor?: ColorKey;
  size?: Extract<Sizes, 'xxs' | 'xs' | 's' | 'm' | 'l'>;
  disabled?: boolean;
  icon: IconComponentName;
  onPress: () => void;
  testID?: string;
};

const IconButton = ({
  variant = 'square',
  backgroundColor,
  iconColor,
  badge,
  badgeColor,
  badgeContentColor,
  strokeColor,
  size = 'm',
  disabled = false,
  icon,
  onPress,
  testID,
}: IconButtonProps) => {
  const { colors, getColorOrGradient, getColor } = useTheme();

  const isGradient = useMemo(() => {
    return Array.isArray(backgroundColor);
  }, [backgroundColor]);

  const handleIconColorTone = useMemo(() => {
    let colorTone = 'default';

    // if (iconColor === 'gradient') color = 'gradient';
    // if (iconColor !== 'gradient' && disabled) color = Color(color).darken(0.5).hex();
    if (disabled) colorTone = 'dark';

    return colorTone as ColorTone;
  }, [iconColor, disabled]);

  // not includes gradients
  const handleBackgroundColor = useMemo(() => {
    let color = getColor(backgroundColor as string, colors.grey[600]);

    if (!isGradient) color = getColor(backgroundColor as string, colors.grey[600]);
    if (!isGradient && disabled) color = Color(color).darken(0.5).hex();

    return color;
  }, [backgroundColor, disabled]);

  const getContent = useMemo(() => {
    const color = getColorOrGradient(backgroundColor);

    let activeContent = (
      <Icon testID="Icon" name={icon} color={iconColor} colorTone={handleIconColorTone} size={size} />
    );

    if (isGradient && backgroundColor) {
      activeContent = (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={
            disabled ? [Color(color[0]).darken(0.5).hex(), Color(color[1]).darken(0.5).hex()] : [color[0], color[1]]
          }
          style={styles.linearGradient}
        >
          <Icon testID="Icon" name={icon} color={iconColor} colorTone={handleIconColorTone} />
        </LinearGradient>
      );
    }

    return activeContent;
  }, [icon, iconColor, disabled]);
  const handleStrokeColor = {
    borderColor: strokeColor == null ? 'transparent' : strokeColor,
  };
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        style={[
          styles.squareBtn,
          variant === 'rectangular' && styles.rectangular,
          variant === 'circle' && styles.circle,
          { backgroundColor: handleBackgroundColor },
          styles.buttonStroke,
          handleStrokeColor,
        ]}
      >
        {getContent}
      </TouchableOpacity>
      {badge && (
        <View style={styles.badgeContainer}>
          <Badge
            testID="IconButtonBadge"
            content={badge}
            backgroundColor={badgeColor}
            contentColor={badgeContentColor}
          />
        </View>
      )}
    </>
  );
};

export default IconButton;
