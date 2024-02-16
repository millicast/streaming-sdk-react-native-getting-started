/* eslint-disable react/jsx-props-no-spreading */
import { AppStyleSheet } from '@dolbyio/uikit-react-native';
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
    styleInFocus?: unknown;
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
  const { style, ...restProps } = props;

  // console.debug(`${props?.testID ?? 'no name'} props :: `, JSON.stringify(props ?? {}));

  const onFocus = () => {
    setIsFocused(true);
    if (componentRef?.current) {
      // console.debug(`FocusCompoenent : ${props?.testID ?? ''} is in focus`);
      componentRef?.current.focus();
    }
    if (setParentFocus) {
      setParentFocus(true);
    }
  };

  const onBlur = () => {
    // console.debug(`FocusCompoenent : ${props?.testID ?? ''} out of focus`);
    setIsFocused(false);
    if (setParentFocus) {
      setParentFocus(false);
    }
  };

  return Platform.isTV ? (
    <TouchableHighlight
      onFocus={onFocus}
      onBlur={onBlur}
      style={[style ?? {}, isFocused ? styleInFocus : {}]}
      {...restProps}
    >
      {children}
    </TouchableHighlight>
  ) : (
    <Pressable {...props}>{children}</Pressable>
  );
};
