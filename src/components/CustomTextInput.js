import React from 'react';
import { TextInput, StyleSheet, View } from "react-native";
import { color, scale, scaleVertical } from "utils";
import { Text } from './text';

export const CustomTextInput = ({
  value,
  placeholder,
  keyboardType,
  returnKeyType,
  onChangeText,
  onBlurText,
  onSubmitEditing,
  secureTextEntry,
  autoCorrect,
  autoCapitalize,
  maxLength,
  style,
  textColor,
  hasError,
  errorMessage,
  multiline
}) => {
  
  return (
    <View>
    <TextInput
      color={textColor || color.black}
      value={value}
      placeholderTextColor={color.secondaryBtn}
      placeholder={placeholder}
      keyboardType={keyboardType || "default"}
      returnKeyType={returnKeyType || "done"}
      onChangeText={onChangeText}
      onBlur={onBlurText}
      onSubmitEditing={onSubmitEditing}
      secureTextEntry={secureTextEntry}
      autoCorrect={autoCorrect || false}
      autoCapitalize={autoCapitalize || "none"}
      maxLength={maxLength}
      style={[styles.input, style, {minHeight: scaleVertical(multiline ? 75 : null)}]}
      clearButtonMode="while-editing"
      selectTextOnFocus={true}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
    />
      {hasError && <Text color="error" variant="text">{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: color.secondary,
    borderRadius: scale(10),
    paddingVertical: scale(10),
    marginVertical: scaleVertical(5),
    padding: scale(15),
    color: color.black,
  },
});
