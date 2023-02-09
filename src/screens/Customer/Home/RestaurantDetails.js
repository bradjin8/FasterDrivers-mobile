import React, {useEffect} from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { color, scale, scaleVertical, restaurantSettingData } from "utils";
import { Images } from "src/theme"
import { ActivityIndicators, Text } from "../../../components/index";
import SimpleHeader from "components/SimpleHeader";
import BaseScreen from "../../../components/BaseScreen";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantDetails } from "../../../screenRedux/customerRedux";

const RestaurantDetails = ({ route }) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.customerReducer.loading)
  const restaurantDetails = useSelector(state => state.customerReducer.restaurantDetails)
  
  useEffect(() => {
    // /route?.params.userType
    dispatch(getRestaurantDetails("faf23853-1b3d-4666-a3f5-825542b118bf"))
  }, [])
  
  return (
    <BaseScreen style={styles.mainWrapper}>
      <View style={styles.container}>
        {loading && <ActivityIndicators />}
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

export default RestaurantDetails;
