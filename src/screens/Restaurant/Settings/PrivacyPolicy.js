import React from "react";
import { StyleSheet, View } from "react-native";
import { color, scaleVertical } from "utils";
import SimpleHeader from "../../../components/SimpleHeader";
import { Text } from "../../../components/index";

const PrivacyPolicy = ({}) => {
  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Privacy Policy"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <Text variant="text" color="black" fontSize={16} fontWeight="400">
          Privacy Policy Content
        </Text>
      </View>
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


