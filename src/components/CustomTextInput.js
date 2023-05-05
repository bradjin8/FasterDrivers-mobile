import React from 'react';
import { TextInput, StyleSheet, View, Image } from "react-native";
import { color, scale, scaleVertical } from "utils";
import { Text } from './text';
import { Images } from "../theme";

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
  multiline,
  isImages,
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.searchSection}>
        {isImages && <Image source={Images.search} style={styles.searchIcon} />}
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
          style={[styles.input, style, {minHeight: scaleVertical(multiline ? 75 : null), textAlignVertical: multiline ? 'top' : 'center'}]}
          clearButtonMode="while-editing"
          selectTextOnFocus={true}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
        />
      </View>
      {hasError && <Text color="error" variant="text">{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: scaleVertical(5),
    marginBottom: scaleVertical(10)
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: color.secondary,
    borderRadius: scale(10),
    color: color.black,
    alignItems: 'center',
  },
  searchIcon: {
    width: scale(15),
    height: scale(15),
    // marginRight: scale(5),
    marginLeft: scale(15)
  },
  input: {
    flex: 1,
    paddingVertical: scale(12),
    paddingHorizontal: scale(15),
    fontFamily: 'Lato-Light',
  },
});
