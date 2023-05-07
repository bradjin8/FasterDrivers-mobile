import React, {useState} from 'react';
import {StatusBar, StyleSheet, ScrollView, KeyboardAvoidingView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {color} from "utils";

const BaseScreen = ({
                      bounces = false,
                      children,
                      enableOnAndroid = true,
                      style,
                      noScrollView = false,
                    }) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <SafeAreaView style={style}>
      {noScrollView ?
        <KeyboardAvoidingView
          style={styles.KeyboardAvoidingView}
        >
          <StatusBar barStyle="light-content"/>
          {children}
        </KeyboardAvoidingView>
        :
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
          <StatusBar barStyle="light-content"/>
          {children}
        </KeyboardAwareScrollView>}
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
