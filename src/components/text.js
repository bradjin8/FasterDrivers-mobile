import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { color as themeColors, scale, scaleVertical, typography } from 'utils';

export function Text({
  variant = 'text',
  style,
  color,
  font,
  fontSize,
  lineHeight,
  letterSpacing,
  textAlign,
  ...rest
}) {
  const customStyles = {
    color: themeColors[color],
    fontFamily: typography[font],
    fontSize: scaleVertical(fontSize),
    lineHeight: scaleVertical(lineHeight),
    letterSpacing: scale(letterSpacing),
    textAlign,
  };
  Object.keys(customStyles).forEach(
    key => !customStyles[key] && delete customStyles[key],
  );

  return (
    <RNText
      style={{
        ...styles[variant],
        ...customStyles,
        ...style,
      }}
      {...rest}
    />
  );
}

const BASE = {
  color: themeColors.text,
  letterSpacing: scale(-0.165),
};

const styles = StyleSheet.create({
  text: {
    ...BASE,
    fontFamily: typography.regular_400,
    fontSize: scaleVertical(14),
    lineHeight: scaleVertical(21),
  },
  h1: {
    ...BASE,
    fontFamily: typography.bold_700,
    fontSize: scaleVertical(40),
    lineHeight: scaleVertical(44),
  },
  h2: {
    ...BASE,
    fontFamily: typography.bold_700,
    fontSize: scaleVertical(28),
    lineHeight: scaleVertical(34),
  },
  h3: {
    ...BASE,
    fontFamily: typography.medium_600,
    fontSize: scaleVertical(24),
    lineHeight: scaleVertical(26),
  },
  h4: {
    ...BASE,
    fontFamily: typography.medium_600,
    fontSize: scaleVertical(20),
    lineHeight: scaleVertical(24),
  },
  h5: {
    ...BASE,
    fontFamily: typography.medium_600,
    fontSize: scaleVertical(18),
    lineHeight: scaleVertical(24),
  },
  label: {
    ...BASE,
    fontFamily: typography.regular_400,
    fontSize: scaleVertical(16),
    lineHeight: scaleVertical(21),
  },
  caption: {
    ...BASE,
    fontFamily: typography.bold_700,
    fontSize: scaleVertical(16),
    lineHeight: scaleVertical(21),
  },
  strong: {
    ...BASE,
    fontFamily: typography.bold_700,
    fontSize: scaleVertical(14),
    lineHeight: scaleVertical(21),
  },
  footNote: {
    ...BASE,
    fontFamily: typography.regular_400,
    fontSize: scaleVertical(12),
    lineHeight: scaleVertical(18),
  }
});
