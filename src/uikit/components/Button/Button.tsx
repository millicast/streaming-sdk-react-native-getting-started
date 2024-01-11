import type { Sizes } from '../../theme/types';
import React from 'react';
import { Text, Pressable, View } from 'react-native';

import useTheme from '../../hooks/useAppTheme';
import Icon from '../Icon/Icon';
import type { IconComponentName } from '../Icon/IconComponents';
import Spinner from '../Spinner/Spinner';

import makeButtonStyles from './Button.style';

export enum ButtonMode {
  Default,
  Loading,
  Done,
}

export type ButtonProps = {
  title: string;
  type: 'primary' | 'secondary' | 'secondaryDark';
  size?: Extract<Sizes, 'xs' | 's' | 'm' | 'l'>;
  danger?: boolean;
  disabled?: boolean;
  uppercase?: boolean;
  mode?: ButtonMode;
  iconLeft?: IconComponentName;
  iconRight?: IconComponentName;
  onPress: () => void;
  testID?: string;
};

const Button = ({
  title,
  type,
  size = 'l',
  danger = false,
  disabled = false,
  uppercase = true,
  mode = ButtonMode.Default,
  iconLeft,
  iconRight,
  onPress,
  testID,
}: ButtonProps) => {
  const { colors } = useTheme();
  const styles = makeButtonStyles(colors);

  const buttonStyles: any[] = [styles.button];
  const textStyles: any[] = [size === 'xs' ? styles.xsText : styles.text];

  const pressedButtonStyles: any[] = [styles.button];
  const pressedTextStyles: any[] = [styles.text];

  const isDisabled = disabled != null ? disabled : false;

  const isDanger = danger != null ? danger : false;

  const isUppercase = uppercase != null ? uppercase : false;

  if (isUppercase) {
    textStyles.push(styles.textUppercase);
    pressedTextStyles.push(styles.textUppercase);
  }

  const iconColor = type === 'secondary' ? 'primary.400' : 'white';

  switch (type) {
    case 'primary':
      if (isDisabled) {
        buttonStyles.push(styles.primaryButtonDisabled);
        textStyles.push(styles.primaryTextDisabled);
      } else if (isDanger) {
        buttonStyles.push(styles.primaryButtonDanger);
        textStyles.push(styles.primaryTextDanger);
        pressedButtonStyles.push(styles.primaryButtonDangerPressed);
        pressedTextStyles.push(styles.primaryTextDangerPressed);
      } else {
        buttonStyles.push(styles.primaryButtonDefault);
        textStyles.push(styles.primaryTextDefault);
        pressedButtonStyles.push(styles.primaryButtonPressed);
        pressedTextStyles.push(styles.primaryTextPressed);
      }
      break;

    case 'secondary':
      if (isDisabled) {
        buttonStyles.push(styles.secondaryLightButtonDisabled);
        textStyles.push(styles.secondaryLightTextDisabled);
      } else if (isDanger) {
        buttonStyles.push(styles.secondaryLightButtonDanger);
        textStyles.push(styles.secondaryLightTextDanger);
        pressedButtonStyles.push(styles.secondaryLightButtonDangerPressed);
        pressedTextStyles.push(styles.secondaryLightTextDangerPressed);
      } else {
        buttonStyles.push(styles.secondaryLightButtonDefault);
        textStyles.push(styles.secondaryLightTextDefault);
        pressedButtonStyles.push(styles.secondaryLightButtonPressed);
        pressedTextStyles.push(styles.secondaryLightTextPressed);
      }
      break;

    case 'secondaryDark':
      if (isDisabled) {
        buttonStyles.push(styles.secondaryDarkButtonDisabled);
        textStyles.push(styles.secondaryDarkTextDisabled);
      } else if (isDanger) {
        buttonStyles.push(styles.secondaryDarkButtonDanger);
        textStyles.push(styles.secondaryDarkTextDanger);
        pressedButtonStyles.push(styles.secondaryDarkButtonDangerPressed);
        pressedTextStyles.push(styles.secondaryDarkTextDangerPressed);
      } else {
        buttonStyles.push(styles.secondaryDarkButtonDefault);
        textStyles.push(styles.secondaryDarkTextDefault);
        pressedButtonStyles.push(styles.secondaryDarkButtonPressed);
        pressedTextStyles.push(styles.secondaryDarkTextPressed);
      }
      break;
    default:
      break;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        pressed ? pressedButtonStyles : buttonStyles,
        size === 'l' && styles.l,
        size === 'm' && styles.m,
        size === 's' && styles.s,
        size === 'xs' && styles.xs,
      ]}
      disabled={disabled}
      testID={testID}
    >
      {({ pressed }) => {
        return [
          mode === ButtonMode.Default && (
            <View key="viewKey" style={{ flexDirection: 'row' }}>
              {iconLeft && <Icon name={iconLeft} color={iconColor} />}
              <Text style={pressed ? pressedTextStyles : textStyles}>{title}</Text>
              {iconRight && <Icon name={iconRight} color={iconColor} />}
            </View>
          ),
          mode === ButtonMode.Loading && <Spinner key="spinnerKey" spinnerColor={iconColor} testID="loader" />,
          mode === ButtonMode.Done && <Icon key="successKey" name="success" color={iconColor} />,
        ];
      }}
    </Pressable>
  );
};

export default Button;
