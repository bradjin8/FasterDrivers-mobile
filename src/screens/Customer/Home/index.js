import React, {useEffect} from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { color, scale, scaleVertical, restaurantSettingData } from "utils";
import { Images } from "src/theme"
import { ActivityIndicators, Text } from "../../../components/index";
import SimpleHeader from "components/SimpleHeader";
import BaseScreen from "../../../components/BaseScreen";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantsData } from "../../../screenRedux/customerRedux";

const Home = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.customerReducer.loading)
  const restaurants = useSelector(state => state.customerReducer.restaurants)

  useEffect(() => {
   dispatch(getRestaurantsData())
  }, [])
  
  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Home"
      />
      <View style={styles.container}>
        {loading && <ActivityIndicators />}
          <View>
            {restaurants?.map((rest, index) => {
              return(
                <View key={index.toString()}>
                  <Text variant="text" color="black" >
                    Rest
                  </Text>
                </View>
              )
            })}
          </View>
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

export default Home;
