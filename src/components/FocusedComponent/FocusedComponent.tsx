/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  TouchableHighlight,
  TouchableHighlightProps,
  TouchableWithoutFeedbackProps,
} from 'react-native';

export type FocusedComponentProps<T> = TouchableWithoutFeedbackProps &
  TouchableHighlightProps & {
    componentRef?: T;
    children: React.ReactNode;
    name?: string;
    styleInFocus?: React.CSSProperties;
    setParentFocus?: React.Dispatch<React.SetStateAction<boolean>>;
  };

export const FocusedComponent = ({
  componentRef,
  styleInFocus,
  setParentFocus,
  children,
  ...props
}: FocusedComponentProps<T>) => {
  const [isFocused, setIsFocused] = useState(false);
  const { style, underlayColor, ...restProps } = props;

  // console.debug(`${props?.testID ?? 'no name'} props :: `, JSON.stringify(props ?? {}));

  const onPress = () => {
    // This method is triggered only for tvOS device
    if (Platform.isTV && Platform.OS === 'ios' && componentRef?.current) {
      componentRef?.current.focus();
      setIsFocused(true);
    }
    // invoke this callback to trigger style change in parent component
    if (setParentFocus) {
      setParentFocus(true);
    }
  };

  const onFocus = () => {
    // This method is triggered only for android tv device
    setIsFocused(true);
    if (Platform.isTV && Platform.OS === 'android' && componentRef?.current) {
      componentRef?.current.focus();
    }
    // invoke this callback to trigger style change in parent component
    if (setParentFocus) {
      setParentFocus(true);
    }
  };

  const onBlur = () => {
    // This method is triggered for android & apple tv device
    setIsFocused(false);
    if (setParentFocus) {
      setParentFocus(false);
    }
  };

  return Platform.isTV ? (
    <TouchableHighlight
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      style={[style ?? {}, isFocused ? styleInFocus : {}]}
      underlayColor={underlayColor ?? 'none'}
      {...restProps}
    >
      {children}
    </TouchableHighlight>
  ) : (
    <Pressable {...props}>{children}</Pressable>
  );
};
