/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useState, MutableRefObject } from 'react';
import { Platform, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

import useTheme from '../../hooks/useAppTheme';
import type { ColorKey } from '../../theme/types';
import IconButton from '../IconButton/IconButton';
import Text from '../Text/CustomText';

import styles from './Input.style';

/**
 *  const [inputValue, setInputValue] = useState('');
 *  const onChangeText = (text: string) => {
 *    setInputValue(text);
 *  }
 *
 *  <Input value={inputValue} label = {'label'} onChangeText = {onChangeText} />
 */
export type ValidationType = { valid: boolean; message?: string };

export type InputProps = TextInputProps & {
  value: string;
  label?: string;
  labelColor?: ColorKey;
  labelBackground?: ColorKey;
  textColor?: ColorKey;
  validation?: ValidationType;
  testID?: string;
  inputRef?: MutableRefObject<TextInput>;
};

const Input = ({
  label,
  value,
  onChangeText,
  labelColor,
  textColor,
  labelBackground,
  validation,
  testID,
  inputRef,
  ...props
}: InputProps) => {
  const { getColor, theme } = useTheme();
  const textInput = inputRef ?? useRef<TextInput>(null);
  const [textInputInFocus, setTextInputInFocus] = useState(false);

  const getBorderColor = () => {
    if (validation?.valid === false) {
      return getColor('infoError');
    }
    if (textInputInFocus) {
      return getColor('primary.400');
    }
    return getColor('grey.100');
  };

  return (
    <View testID={testID} style={styles.container}>
      <View style={[styles.labelContainer, { backgroundColor: labelBackground }]}>
        <Text type="captionRegular" color={getColor(labelColor, 'grey.500')}>
          {label}
        </Text>
      </View>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
          },
        ]}
      >
        <TextInput
          ref={textInput}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setTextInputInFocus(true)}
          onBlur={() => setTextInputInFocus(false)}
          style={{
            fontFamily: theme.fontFamily,
            color: getColor(textColor, 'black'),
          }}
          {...props}
        />
      </View>
      {value.length > 0 && !Platform.isTV && (
        <View style={styles.buttonContainer}>
          <IconButton
            variant="circle"
            icon="close"
            backgroundColor="transparent"
            iconColor={getColor(textColor, 'black')}
            size="xxs"
            onPress={() => {
              textInput?.current?.clear();
              onChangeText('');
            }}
          />
        </View>
      )}

      {validation?.message && (
        <View style={styles.errorContainer}>
          <Text type="captionRegular" color={validation?.valid === false ? 'infoError' : 'grey.600'}>
            {validation.message}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Input;
