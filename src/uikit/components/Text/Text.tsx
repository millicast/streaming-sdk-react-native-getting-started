import type { ColorKey } from '../../theme/types';
import React from 'react';
import { Text, TextProps } from 'react-native';

import useTheme from '../../hooks/useTheme';

import styles from './Text.style';

export type DeprecatedTextTypes =
  | 'H0'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'bodyDefault'
  | 'bodySmallSemiBold'
  | 'bodySmall'
  | 'buttonDefault'
  | 'buttonSmall'
  | 'captionBold'
  | 'captionSemiBold'
  | 'captionRegular'
  | 'captionSmallSemiBold'
  | 'captionSmallRegular';

export type TextType =
  | DeprecatedTextTypes
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h7'
  | 'paragraph'
  | 'caption'
  | 'buttonLarge'
  | 'buttonMedium'
  | 'textLinkLarge'
  | 'textLinkSmall'
  | 'textLinkUnderline'
  | 'captionSmallDemiBold'
  | 'captionSmallDemiBoldMobile'
  | 'avatarXS'
  | 'avatarS'
  | 'avatarM'
  | 'avatarL';

export type CustomTextProps = TextProps & {
  children: React.ReactNode;
  testID?: string;
  type?: TextType;
  color?: ColorKey;
  font?: string;
  uppercase?: boolean;
  align?: 'left' | 'center' | 'right';
};

const CustomText = ({
  children,
  testID,
  type = 'bodyDefault',
  color,
  font,
  uppercase = false,
  align = 'left',
  ...props
}: CustomTextProps) => {
  const {
    theme: { fontFamily },
    colors,
    getColor,
  } = useTheme();

  const themeStyles = {
    fontFamily: font || fontFamily,
    color: getColor(color, colors.white),
    textAlign: align,
  };
  const stylesGroup = [
    ...(typeof props.style !== 'undefined' ? [props.style] : []),
    styles.text,
    type && styles[type],
    uppercase && styles.uppercase,
    themeStyles,
  ];

  const onPressed = props.onPress;

  return (
    <Text testID={testID} style={stylesGroup} numberOfLines={props.numberOfLines} onPress={onPressed}>
      {children}
    </Text>
  );
};

export default CustomText;
