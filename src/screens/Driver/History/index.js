import SimpleHeader from "components/SimpleHeader";
import React from "react";
import {StyleSheet, View} from "react-native";
import {color, scaleVertical} from "utils";
import BaseScreen from "../../../components/BaseScreen";

const History = () => {
  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="History"
        showBackIcon={true}
      />
      <View style={styles.container}>

      </View>
    </BaseScreen>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
})

export default History;
