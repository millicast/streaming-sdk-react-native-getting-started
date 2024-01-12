import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import Text from '../Text/Text';

import styles from './Timer.style';

const Timer = ({ testID }) => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const secondsDisplayValue = useMemo(() => {
    let value: number | string = seconds;

    if (seconds < 10) {
      value = `0${seconds}`;
    }

    if (seconds === 60) {
      setMinutes((prev) => prev + 1);
      setSeconds(0);
    }

    return value;
  }, [seconds]);

  const minutesDisplayValue = useMemo(() => {
    let value = `${minutes}:`;

    if (minutes < 10) {
      value = `0${minutes}:`;
    }

    if (minutes === 60) {
      setHours((prev) => prev + 1);
      setMinutes(0);
    }

    return value;
  }, [minutes]);

  const hoursDisplayValue = useMemo(() => {
    let value: string | null = `${hours}:`;

    if (hours < 1) {
      value = null;
    } else if (hours < 10) {
      value = `0${hours}:`;
    }

    return value;
  }, [hours]);

  return (
    <View testID={testID} style={[styles.container]}>
      <Text testID={testID && `${testID}-hour`} type="captionSmallDemiBold">
        {hoursDisplayValue}
      </Text>
      <Text testID={testID && `${testID}-min`} type="captionSmallDemiBold">
        {minutesDisplayValue}
      </Text>
      <Text testID={testID && `${testID}-sec`} type="captionSmallDemiBold">
        {secondsDisplayValue}
      </Text>
    </View>
  );
};

export default Timer;
