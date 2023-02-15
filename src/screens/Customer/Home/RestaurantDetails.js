import React, {useEffect} from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { color, scale, scaleVertical, restaurantSettingData, screenWidth } from "utils";
import { Images } from "src/theme"
import { ActivityIndicators, Text } from "../../../components/index";
import Icon from 'react-native-vector-icons/dist/Feather';
import BaseScreen from "../../../components/BaseScreen";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantDetails } from "../../../screenRedux/customerRedux";
import { goBack } from "navigation/NavigationService";
import StarRating from "react-native-star-rating-new";

const RestaurantDetails = ({ route }) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.customerReducer.loading)
  const restaurantDetails = useSelector(state => state.customerReducer.restaurantDetails)
  const selectedRestaurant = route?.params.restaurant
  
  useEffect(() => {
    dispatch(getRestaurantDetails(selectedRestaurant))
  }, [])
  
  return (
    <BaseScreen style={styles.mainWrapper}>
      <View style={styles.container}>
        {loading && <ActivityIndicators />}
        <View>
          <Pressable onPress={() => goBack()} style={styles.backView}>
            <Icon name="arrow-left" size={20} color={color.black} />
          </Pressable>
          <Image source={restaurantDetails?.photo ? {uri: restaurantDetails.photo} : Images.item} style={styles.itemImage} />
        </View>
        
        <View style={styles.content}>
          <Text variant="text" color="item" fontSize={14} fontWeight="600">
            {restaurantDetails?.name}
          </Text>
          <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
            {restaurantDetails?.description}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={restaurantDetails?.rating_count}
              starSize={18}
              emptyStarColor={color.lightGray}
              fullStarColor={color.lightGray}
              starStyle={{color: color.primary, fontWeight: 'bold', marginRight: scaleVertical(2)}}
            />
            <Text variant="text" color="item" fontSize={14} fontWeight="600" style={{marginLeft: scaleVertical(5)}}>
              {restaurantDetails?.rating_count}
            </Text>
          </View>
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
  container: {flex: 1, backgroundColor: color.white },
  backView: {
    height: scale(25),
    width: scale(25),
    borderRadius: scale(12.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white,
    position: 'absolute',
    left: scaleVertical(25),
    top: scaleVertical(10),
    // right: 0,
    zIndex: 11
  },
  itemImage: {
    width: '100%',
    height: screenWidth/2.5,
  },
  content: {
    paddingHorizontal: scaleVertical(25),
    paddingVertical: scaleVertical(15),
  }
})

export default RestaurantDetails;
