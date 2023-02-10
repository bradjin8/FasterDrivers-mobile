import React from "react";
import { StyleSheet, View } from "react-native";
import { color, scale, scaleVertical, restaurantSettingData } from "utils";
import { Images } from "src/theme"
import { Button, CustomTextInput, Text } from "../../../components/index";
import SimpleHeader from "components/SimpleHeader";
import BaseScreen from "../../../components/BaseScreen";

const Map = () => {
  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Map"
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

export default Map;
