import Color from 'color';
import React, { useMemo } from 'react';

import useTheme from '../../hooks/useAppTheme';
import type { ColorKey, Sizes } from '../../theme/types';

import Icons from './IconComponents';
import type { IconComponentName } from './IconComponents';

export type ColorTone = 'light' | 'default' | 'dark';
export type IconSize = Extract<Sizes, 'xxs' | 'xs' | 's' | 'm' | 'l'>;

export type IconProps = {
  name: IconComponentName;
  color?: ColorKey;
  colorTone?: ColorTone;
  size?: IconSize;
  testID?: string;
  path?: string;
};

const IconSizes: { [key in IconSize]: { width: number; height: number } } = {
  xxs: { width: 10, height: 10 },
  xs: { width: 16, height: 16 },
  s: { width: 18, height: 18 },
  m: { width: 24, height: 24 },
  l: { width: 172, height: 172 },
};

const Icon = ({ name, color, colorTone = 'default', size = 'm', testID, path }: IconProps) => {
  const { colors, getColor } = useTheme();

  const handleFillColor = useMemo(() => {
    let fillColor = getColor(color, colors.white);

    if (colorTone === 'light') fillColor = Color(fillColor).lighten(0.2).hex();
    else if (colorTone === 'dark') fillColor = Color(fillColor).darken(0.5).hex();
    else return fillColor;

    return fillColor;
  }, [color, colorTone]);

  const IconSVG = path || Icons[name];

  return (
    <IconSVG testID={testID} width={IconSizes[size].width} height={IconSizes[size].height} fill={handleFillColor} />
  );
};

export default Icon;
