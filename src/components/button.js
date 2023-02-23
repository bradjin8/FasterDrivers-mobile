import React from 'react';
import { StyleSheet, ActivityIndicator, Pressable, View, Dimensions, Platform } from "react-native";
import { color, scale, scaleVertical } from 'utils';
import { Text } from './text';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
const { width, height } = Dimensions.get('window');

export function Button({
  variant = 'button',
  textColor = variant === 'link' ? 'primary' : variant === 'outline' ? "primary" : 'white',
  font = 'medium_600',
  fontSize = scaleVertical(14),
  loading = false,
  disabled = false,
  height,
  width,
  text,
  onPress,
  icon,
  style,
  isSecondary,
  noBG,
  mt,
  fontWeight,
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
  if(isSecondary) {
    buttonStyles.push({ ...styles.secondaryButton})
  }
  if(mt) {
    buttonStyles.push({ marginTop: scaleVertical(mt)})
  }
  if(noBG) {
    buttonStyles.push({backgroundColor: 'transparent'})
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
           <MaterialIcons name={icon} size={16} color={color.black} style={{marginRight: scale(5)}} />
           <Text
             color={isSecondary ? 'secondaryBtn' : textColor}
             font={font}
             fontSize={fontSize}
             fontWeight={fontWeight}
             textAlign={variant === 'button' || variant === 'round' || variant === 'outline' ? 'center' : 'left'}
             // style={variant === 'link' && { textDecorationLine: 'underline' }}
           >
             {text}
           </Text>
         </View>
       )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: scale(20),
    height: scaleVertical(60),
    // width: scale(width-50),
    backgroundColor: color.primary,
    justifyContent: 'center',
  },
  secondaryButton: {
    borderRadius: scale(20),
    height: scaleVertical(65),
    width: scale(width-50),
    backgroundColor: color.secondary,
    justifyContent: 'center',
  },
  round: {
    width: scale(58),
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: color.primary
  },
  link: {
    // marginTop: -3
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
