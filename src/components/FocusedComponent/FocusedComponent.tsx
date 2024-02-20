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

  const getDeviceMake = (): string => {
    let make = 'mobile';
    if (Platform.isTV) {
      if (Platform.OS === 'ios') {
        make = 'appletv';
      } else {
        // for android tv make is either Google or Amazon
        make = Platform.constants.Manufacturer?? 'unknown';
      }
    }
    return make.toLowerCase();
  };

  const deviceMake = getDeviceMake();
  const borderNormalColor = '#E0E0E5';
  const borderHighlightColor = '#AA33FF';
  const [borderColor, setBorderColor] = useState<string>(borderNormalColor);

  // console.debug(`${props?.testID ?? 'no name'} props :: `, JSON.stringify(props ?? {}));

  const onPress = () => {
    // This method is triggered tvOS and fire tv device

    // list of devices - which opens keyboard on press event
    const deviceList = ['amazon', 'appletv'];

    setIsFocused(true);

    if (Platform.isTV && deviceList.includes(deviceMake) && componentRef?.current) {
      // set focus for apple and fire tv only
      componentRef?.current.focus();
    }

    // invoke this callback to trigger style change in parent component
    if (setParentFocus) {
      setParentFocus(true);
    }
  };

  const onFocus = () => {
    // This method is triggered only for android tv device

    // list of devices - which needs border color change
    const deviceList = ['amazon', 'appletv'];
    setIsFocused(true);

    if (Platform.isTV && deviceList.includes(deviceMake)) {
      // set border color for apple and fire tv only
      setBorderColor(borderHighlightColor);
    }

    if (Platform.isTV && Platform.OS === 'android' && !deviceList.includes(deviceMake) && componentRef?.current) {
      // for android tv keyboard is displayed on onfocus event only
      // set input focus for android tv only
      componentRef?.current.focus();
    }

    // invoke this callback to trigger style change in parent component
    if (setParentFocus) {
      setParentFocus(true);
    }
  };

  const onBlur = () => {
    // This method is triggered for android & apple tv device

    // list of devices - which needs border color change
    const deviceList = ['amazon', 'appletv'];

    if (Platform.isTV && deviceList.includes(deviceMake)) {
      // reset border color for apple and fire tv only
      setBorderColor(borderNormalColor);
    }

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
      {React.cloneElement(children, { borderColor })}
    </TouchableHighlight>
  ) : (
    <Pressable {...props}>{children}</Pressable>
  );
};
