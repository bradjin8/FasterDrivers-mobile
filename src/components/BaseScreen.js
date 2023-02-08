import React, { useState } from 'react';
import { StatusBar, StyleSheet, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color } from "utils";

const BaseScreen = ({
  bounces = false,
  children,
  enableOnAndroid = true,
  style,
}) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  
  return (
    <SafeAreaView style={style}>
      <KeyboardAwareScrollView
        scrollEnabled={scrollEnabled}
        enableOnAndroid={enableOnAndroid}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        extraScrollHeight={150}
        // contentContainerStyle={styles.KeyboardAvoidingViewContainerStyle}
        style={styles.KeyboardAvoidingView}
        bounces={bounces}
        onKeyboardDidHide={() => setScrollEnabled(true)}
        onKeyboardDidShow={() => setScrollEnabled(false)}
      >
        <StatusBar barStyle="light-content" />
          {children}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default BaseScreen;

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
  },
  KeyboardAvoidingViewContainerStyle: {
    flex: 1,
  },
});
