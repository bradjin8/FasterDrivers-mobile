import React from "react";
import {StyleSheet, View} from "react-native";
import {WebView} from "react-native-webview";
import {color, scaleVertical} from "utils";
import SimpleHeader from "../../../components/SimpleHeader";

const PrivacyPolicy = ({}) => {
  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Privacy Policy"
        showBackIcon={true}
      />
      <WebView style={styles.container} source={{uri: 'https://fancy-cherry-36842-staging.botics.co/api/v1/privacy-policy/'}}/>
    </View>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
})

export default PrivacyPolicy;


