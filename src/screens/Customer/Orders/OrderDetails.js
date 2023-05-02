 import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { color, scale, scaleVertical, screenWidth } from "utils";
import { Images } from "src/theme";
import { ActivityIndicators, Button, Text } from "../../../components/index";
import Icon from "react-native-vector-icons/dist/Feather";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantDetails, setUserCartItems } from "../../../screenRedux/customerRedux";
import { goBack, navigate } from "navigation/NavigationService";
import StarRating from "react-native-star-rating-new";
import _ from 'lodash'

const OrderDetails = ({ route }) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.customerReducer.loading);
  const order = route?.params.order;
  const resDetails = useSelector(state => state.customerReducer.restaurantDetails)
  const { id, photo, name, street, city, zip_code, state, description, type, rating, rating_count  } = order.restaurant

  useEffect(() => {
    dispatch(getRestaurantDetails(order.restaurant.id))
  }, [order])

  if(loading) {
    return (<ActivityIndicators />)
  }
  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, flex: 1, marginBottom: -65 }}>
        <View>
          <Pressable onPress={() => goBack()} style={styles.backView}>
            <Icon name="arrow-left" size={20} color={color.black} />
          </Pressable>
          <Image source={photo ? { uri: photo } : Images.item}
                 style={styles.itemImage} />
        </View>

        <View style={styles.content}>
          <View style={styles.flex}>
            <Text variant="text" color="item" fontSize={14} fontWeight="600">
              {name}
            </Text>
            <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400" numberOfLines={2}
                  ellipsizeMode="tail">
              {street}, {city} - {zip_code}, {state}
            </Text>
          </View>
          <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
            {description}
          </Text>
          <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
            {type}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <StarRating
              disabled={false}
              halfStarEnabled={true}
              maxStars={5}
              rating={rating}
              starSize={18}
              emptyStarColor={color.lightGray}
              fullStarColor={color.primary}
              containerStyle={styles.starContainer}
              starStyle={styles.starStyle}
              selectedStar={(rating) => null}
            />
            <Text variant="text" color="item" fontSize={14} fontWeight="600" style={{ marginLeft: scaleVertical(5) }}>
              {rating}
            </Text>
          </View>
          <Button style={styles.btnStyle} variant="outline" text="Group Order" textColor="black" onPress={() => {}} fontSize={12} />
        </View>

        <View style={styles.itemContainer}>
        </View>

      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white,
  },
  container: { backgroundColor: color.white },
  backView: {
    height: scale(25),
    width: scale(25),
    borderRadius: scale(12.5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white,
    position: "absolute",
    left: scaleVertical(25),
    top: scaleVertical(10),
    // right: 0,
    zIndex: 11,
  },
  itemImage: {
    width: "100%",
    height: screenWidth / 2.5,
  },
  itemImageContain: {
    width: scaleVertical(80),
    height: scaleVertical(80),
  },
  content: {
    paddingHorizontal: scaleVertical(25),
    paddingVertical: scaleVertical(15),
  },
  itemContainer: {
    flex: 1,
    paddingLeft: scaleVertical(25),
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnStyle: {
    width: scaleVertical(100),
    borderColor: color.black,
    height: scaleVertical(45),
    marginTop: scaleVertical(15),
  },
  circle: {
    position: 'absolute',
    right: -20,
    top: -8,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    zIndex: 1,
    borderColor: color.white,
    borderWidth: scale(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.angry
  },
  itemTitle: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: scaleVertical(10)},
  noData: {textAlign: 'center', marginTop: scaleVertical(20)},
  starContainer: { width: 100, justifyContent: "space-evenly" },
  starStyle: { fontWeight: "bold", marginRight: scaleVertical(3), margin: 3 }
});

export default OrderDetails;
