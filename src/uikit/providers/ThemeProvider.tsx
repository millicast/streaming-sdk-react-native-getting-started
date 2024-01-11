import customThemes from '../theme/customThemes';
import defaultTheme from '../theme/defaultTheme';
import type {Theme, ThemeMode} from '../theme/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import deepMerge from 'lodash.merge';
import React, { createContext, useState, useEffect, useMemo } from 'react';

type ThemeContext = {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (value: ThemeMode) => Promise<void>;
};

type ThemeProviderProps = {
  theme?: Theme;
};

export const ThemeContext = createContext<ThemeContext>({ theme: defaultTheme } as ThemeContext);

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme }) => {
  const [themeState, setThemeState] = useState(defaultTheme);
  const [themeModeState, setThemeModeState] = useState<ThemeMode>('default');

  const setThemeMode = async (value: ThemeMode) => {
    setThemeModeState(value);
    try {
      await AsyncStorage.setItem('themeMode', value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const getStoredThemeMode = async () => {
    try {
      const value = await AsyncStorage.getItem('themeMode');
      if (value) {
        setThemeModeState(value);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  useEffect(() => {
    getStoredThemeMode();
  }, [setThemeMode, themeModeState]);

  useEffect(() => {
    setThemeState({ ...deepMerge(defaultTheme, customThemes[themeModeState], theme) });
  }, [theme, themeModeState]);

  const contextValue: ThemeContext = useMemo(
    () => ({
      theme: themeState,
      themeMode: themeModeState,
      setThemeMode,
    }),
    [themeState, themeModeState],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
