import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { color as themeColors, scale, scaleVertical, typography } from 'utils';

export const CustomTextInput = ({
  value,
  placeholder,
  keyboardType,
  returnKeyType,
  onChangeText,
  onSubmitEditing,
  secureTextEntry,
  autoCorrect,
  autoCapitalize,
  maxLength,
  style,
}) => {
  return (
    <TextInput
      value={value}
      placeholder={placeholder || "Enter text here"}
      keyboardType={keyboardType || "default"}
      returnKeyType={returnKeyType || "done"}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      secureTextEntry={secureTextEntry}
      autoCorrect={autoCorrect || false}
      autoCapitalize={autoCapitalize || "none"}
      maxLength={maxLength}
      style={[styles.input, style]}
      clearButtonMode="while-editing"
      selectTextOnFocus={true}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    paddingHorizontal: scale(10),
    marginVertical: scaleVertical(10),
    width: '100%',
    borderColor: themeColors.gray,
    borderWidth: 1,
    padding: scale(10),
  },
});
