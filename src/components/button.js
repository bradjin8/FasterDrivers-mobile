import React from 'react';
import { StyleSheet, ActivityIndicator, Pressable, View } from 'react-native';
import { color, scale, scaleVertical } from 'utils';
import { Text } from './text';

export function Button({
  variant = 'button',
  textColor = variant === 'link' ? 'primary' : variant === 'outline' ? "" : 'white',
  font = 'medium_600',
  fontSize = scaleVertical(14),
  loading = false,
  disabled = false,
  height,
  width,
  text,
  onPress,
  icon,
  style
}) {
  const buttonStyles = [];
  if (variant === 'button') {
    buttonStyles.push(styles.button);
  }
  if (variant === 'round') {
    buttonStyles.push({ ...styles.button, ...styles.round });
  }
  if (variant === 'link') {
    buttonStyles.push({ ...styles.link });
  }
  if (variant === 'outline') {
    buttonStyles.push({ ...styles.button, ...styles.outline });
  }
  if (height) {
    buttonStyles.push({ height: scaleVertical(height) });
  }
  if (width) {
    buttonStyles.push({ width: scale(width) });
  }

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[buttonStyles, style, isDisabled && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            color={textColor}
            font={font}
            fontSize={fontSize}
            textAlign={variant === 'button' || variant === 'round' || variant === 'outline' ? 'center' : 'left'}
            style={variant === 'link' && { textDecorationLine: 'underline' }}
          >{text}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: scale(16),
    height: scaleVertical(64),
    backgroundColor: color.darkGray,
    justifyContent: 'center',
  },
  round: {
    width: scale(58),
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffff'
  },
  link: {
    marginTop: -3
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    position: 'absolute',
    right: 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
