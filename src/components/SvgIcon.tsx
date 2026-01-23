// src/components/SvgIcon.tsx

import React from 'react';
import type { StyleProp } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { ICONS, type IconName } from '../icons';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<any>;
} & Omit<SvgProps, 'width' | 'height' | 'color'>;

export default function SvgIcon({
  name,
  size = 24,
  color = '#222',
  style,
  ...svgProps
}: Props) {
  const Icon = ICONS[name];

  return (
    <Icon
      width={size}
      height={size}
      fill={color}
      color={color}
      preserveAspectRatio="xMidYMid meet"
      style={style}
      {...svgProps}
    />
  );
}
