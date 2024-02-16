import React, { useState } from 'react';
import { Text, Pressable, View, TouchableHighlight, Platform } from 'react-native';

import useTheme from '../../hooks/useAppTheme';
import type { Sizes } from '../../theme/types';
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
        pressedButtonStyles.push(!Platform.isTV ? styles.primaryButtonPressed : styles.tvOSPrimaryButtonPressed);
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
  const getStyleBySize = (size) => {
    let buttonStyle = styles.l;
    if (size === 'm') {
      buttonStyle = styles.m;
    } else if (size === 's') {
      buttonStyle = styles.s;
    } else if (size === 'xs') {
      buttonStyle = styles.xs;
    }
    return buttonStyle;
  };

  const getButtonByMode = ({ mode, isPressed }: { mode: ButtonMode; isPressed: boolean }): JSX.Element => {
    if (mode === ButtonMode.Default) {
      return (
        <View key="viewKey" style={{ flexDirection: 'row' }}>
          {iconLeft && <Icon name={iconLeft} color={iconColor} />}
          <Text style={isPressed ? pressedTextStyles : textStyles}>{title}</Text>
          {iconRight && <Icon name={iconRight} color={iconColor} />}
        </View>
      );
    }
    if (mode === ButtonMode.Loading) {
      return <Spinner key="spinnerKey" spinnerColor={iconColor} testID="loader" />;
    }
    // return ButtonMode.Done
    return <Icon key="successKey" name="success" color={iconColor} />;
  };
  const [isFocused, setIsFocused] = useState(false);
  return Platform.isTV ? (
    <TouchableHighlight
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onPress={onPress}
      style={[isFocused ? pressedButtonStyles : buttonStyles, getStyleBySize(size)]}
      disabled={disabled}
      testID={testID}
    >
      {getButtonByMode({ mode, isPressed: isFocused })}
    </TouchableHighlight>
  ) : (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed ? pressedButtonStyles : buttonStyles, getStyleBySize(size)]}
      disabled={disabled}
      testID={testID}
    >
      {({ pressed }) => getButtonByMode({ mode, isPressed: pressed })}
    </Pressable>
  );
};

export default Button;
