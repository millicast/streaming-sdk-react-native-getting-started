import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, View } from 'react-native';

import useTheme from '../../hooks/useAppTheme';
import Icon from '../Icon/Icon';
import IconButton from '../IconButton/IconButton';
import Text from '../Text/Text';

import styles from './Toast.style';

export type ToastProps = {
  variant?: 'success' | 'info' | 'warning' | 'error';
  text: string;
  visible: boolean;
  offset: number;
  onClose: () => void;
  testID?: string;
};

const Toast = ({ variant, text, visible, offset, onClose, testID }: ToastProps) => {
  const { colors } = useTheme();
  const [componentHeight, setComponentHeight] = useState(0);
  const toastAnimation = useRef(new Animated.Value(0));

  useEffect(() => {
    if (visible === true) {
      animateIn();
    } else {
      animateOut();
    }
  }, [visible]);

  const animateIn = () => {
    Animated.timing(toastAnimation.current, {
      toValue: -offset - componentHeight,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = () => {
    Animated.timing(toastAnimation.current, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const getIconName = () => {
    switch (variant) {
      case 'success':
        return 'successStatus';
      case 'warning':
        return 'warningStatus';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return colors.successBackground;
      case 'warning':
        return colors.warningBackground;
      case 'error':
        return colors.errorBackground;
      default:
        return colors.infoBackground;
    }
  };

  const onLayoutEvent = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setComponentHeight(height);
  };

  return (
    <Animated.View
      onLayout={onLayoutEvent}
      style={[
        styles.container,
        {
          bottom: -componentHeight,
          transform: [{ translateY: toastAnimation.current }],
          backgroundColor: getBackgroundColor().toString(),
        },
      ]}
      testID={testID}
    >
      <View style={styles.textAndIconContainer}>
        <Icon name={getIconName()} />
        <View style={styles.spacer} />
        <Text type="bodySmall" style={styles.textStyle}>
          {text}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <IconButton
          backgroundColor="transparent"
          icon="close"
          size="xxs"
          onPress={() => {
            onClose();
          }}
        />
      </View>
    </Animated.View>
  );
};

export default Toast;
