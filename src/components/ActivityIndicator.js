import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { color } from "utils";

export function ActivityIndicators({
  ...rest
}) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size='large' color={color.primary}  />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    backgroundColor: color.white,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
