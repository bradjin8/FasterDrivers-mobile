import React from "react";
import {StyleSheet, View} from "react-native";
import {WebView} from "react-native-webview";
import {color, scaleVertical} from "utils";
import SimpleHeader from "../../../components/SimpleHeader";

const TermCondition = ({}) => {
  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Terms and Conditions"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <WebView source={{uri: 'https://fancy-cherry-36842-staging.botics.co/api/v1/terms-and-conditions/'}}/>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingHorizontal: scaleVertical(25),
  },
})

export default TermCondition;


