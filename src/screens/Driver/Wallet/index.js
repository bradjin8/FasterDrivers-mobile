import DriverHeader from "components/DriverHeader";
import SimpleHeader from "components/SimpleHeader";
import React from "react";
import {StyleSheet, View} from "react-native";
import {useSelector} from "react-redux";
import {color, scaleVertical} from "utils";
import BaseScreen from "../../../components/BaseScreen";

const Wallet = () => {
  const {user: { name, driver: driver}} = useSelector((state) => state.loginReducer);

  return (
    <BaseScreen style={styles.mainWrapper}>
      <DriverHeader photo={driver?.photo} name={name}/>
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

export default Wallet;
