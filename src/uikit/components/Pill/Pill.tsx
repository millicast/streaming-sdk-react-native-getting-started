/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { View } from 'react-native';

import useTheme from '../../hooks/useAppTheme';
import type { Sizes } from '../../theme/types';
import Text from '../Text/Text';

import styles from './Pill.style';

type PillSize = Extract<Sizes, 's' | 'm'>;

export type PillProps = {
  text?: string;
  subtitleText?: string;
  label?: string;
  active?: boolean;
  size?: PillSize;
  testID?: string;
};

const Pill = ({ text, subtitleText, label, active = false, size = 'm', testID }: PillProps) => {
  const { getColor } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: active ? getColor('white') : getColor('whiteAlpha.50'),
        },
      ]}
    >
      <View style={{ flexShrink: 1 }}>
        <Text
          color={active ? 'purple.400' : 'white'}
          testID={testID && `${testID}-text`}
          type={size === 'm' ? 'captionSmallDemiBold' : 'captionSmallDemiBoldMobile'}
          numberOfLines={1}
        >
          {text}
        </Text>
      </View>
      {subtitleText && subtitleText.length > 0 ? (
        <View>
          <Text
            color={active ? 'purple.400' : 'white'}
            testID={testID && `${testID}-subtitleText`}
            type={size === 'm' ? 'captionSmallDemiBold' : 'captionSmallDemiBoldMobile'}
            numberOfLines={1}
          >
            {subtitleText}
          </Text>
        </View>
      ) : null}

      {label && (
        <Text
          color={active ? 'purple.400' : 'white'}
          testID={testID && `${testID}-text-local`}
          type={size === 'm' ? 'captionSmallDemiBold' : 'captionSmallDemiBoldMobile'}
        >
          {`(${label})`}
        </Text>
      )}
    </View>
  );
};

export default Pill;
