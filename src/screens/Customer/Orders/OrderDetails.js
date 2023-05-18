import BaseScreen from "components/BaseScreen";
import DriverCard from "components/DriverCard";
import OrderStatusIndicator from "components/OrderStatusIndicator";
import RateModal from "components/RateModal";
import {goBack, navigate} from "navigation/NavigationService";
import React, {useEffect, useState} from "react";
import {Image, Linking, Pressable, ScrollView, StyleSheet, TextInput, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import StarRating from "react-native-star-rating-new";
import Icon from "react-native-vector-icons/dist/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {useDispatch, useSelector} from "react-redux";
import {Images} from "src/theme";
import {color, scale, scaleVertical, screenWidth} from "utils";
import {ActivityIndicators, Button, Text} from "../../../components/index";
import {ORDER_REVIEW_MODE, ORDER_STATUS} from "../../../consts/orders";
import {getDishById} from "../../../screenRedux/customerRedux";
import {Flex, Margin} from "../../../theme/Styles";

const OrderDetails = ({route}) => {
  const dispatch = useDispatch();
  const {loading, payment} = useSelector(state => state.customerReducer);
  const order = route?.params?.order;
  const {id, photo, name, street, city, zip_code, state, description, type, rating, rating_count} = order.restaurant
  const [orderedDishes, setOrderedDishes] = useState([])
  const [reviewMode, setReviewMode] = useState('')

  const fetchDishes = () => {
    if (order?.dishes) {
      // write a function to get all dishes by ids in the order
      Promise.all(order?.dishes.map((d) => getDishById(d.dish)))
        .then(_dishes => {
          setOrderedDishes(_dishes.map((d) => d.data))
        })
    }
  }

  useEffect(() => {
    fetchDishes()
  }, [order])

  if (loading) {
    return (<ActivityIndicators/>)
  }

  // console.log('order', order)

  return (
    <BaseScreen style={styles.mainWrapper}>
      <View style={styles.container} contentContainerStyle={{paddingBottom: 65}}>
        <View>
          <Pressable onPress={() => goBack()} style={styles.backView}>
            <Icon name="arrow-left" size={20} color={color.black}/>
          </Pressable>
          <Image source={photo ? {uri: photo} : Images.item}
                 style={styles.itemImage}/>
        </View>

        <View style={styles.content}>
          <View style={styles.flex}>
            <Text variant="h5" color="item" fontSize={14} fontWeight="600">
              {name}
            </Text>
            <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400"
                  ellipsizeMode="tail">
              {street}, {city}, {state} - {zip_code}
            </Text>
          </View>
          <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
            {description}
          </Text>
          <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
            {type}
          </Text>
          <View style={{flexDirection: "row", alignItems: "center", justifyContent: 'flex-start'}}>
            <StarRating
              disabled={true}
              halfStarEnabled={true}
              maxStars={5}
              rating={rating}
              starSize={18}
              emptyStarColor={color.primary}
              fullStarColor={color.primary}
              containerStyle={styles.starContainer}
              starStyle={styles.starStyle}
              selectedStar={(rating) => null}
            />
            <Text variant="text" color="item" fontSize={14} fontWeight="600" style={{marginLeft: scaleVertical(5)}}>
              {rating || '0.0'}
            </Text>
            <Text variant="text" color="item" fontSize={12} fontWeight="400" style={{marginLeft: scaleVertical(5)}}>
              ({rating_count})
            </Text>
            {order?.status === ORDER_STATUS.Delivered && !order?.restaurant_reviewed && <Pressable
              onPress={() => {
                setReviewMode(ORDER_REVIEW_MODE.RESTAURANT)
              }}
              style={[Margin.h10]}
            >
              <Text variant={'small'} color={'gray'}>Rate the restaurant</Text>
            </Pressable>}
          </View>
        </View>
        <OrderStatusIndicator status={order?.status}/>
        <View style={styles.itemContainer}>
          {orderedDishes?.map((dish, did) => {
            const {id, addons, name, price, image_1, image_2, description} = dish
            const quantity = order?.dishes?.[did]?.quantity || 0
            return (
              <View key={did} style={styles.dishContainer}>
                <Image source={image_1 ? {uri: image_1} : Images.item}
                       style={styles.itemImageContain}/>
                <View style={{marginLeft: scaleVertical(10), flexDirection: 'row', justifyContent: 'space-between', width: wp(76), paddingRight: wp(2)}}>
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      {quantity > 1 && <Text variant="text" color="primary" fontSize={14} fontWeight="400">
                        {quantity}x </Text>}
                      <Text variant="text" color="black" fontSize={14} fontWeight="600">
                        {name}
                      </Text>
                    </View>
                    <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
                      {description}
                    </Text>
                  </View>
                  <Text variant="text" color="itemPrimary" fontSize={12} fontWeight="400">
                    ${price}
                  </Text>
                </View>
              </View>
            )
          })}

          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text color={'item'} fontSize={16} fontWeight={'600'}>Price</Text>
              <Text color={'item'} fontSize={16}>${order?.sub_total}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text color={'item'} fontSize={16} fontWeight={'600'}>Fee</Text>
              <Text color={'item'} fontSize={16}>${order?.fees}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text color={'item'} fontSize={16} fontWeight={'600'}>Price</Text>
              <Text color={'item'} fontSize={16}>${order?.total}</Text>
            </View>
          </View>

          {order?.status === ORDER_STATUS.Unpaid && <View>
            <Button
              onPress={() => {
                navigate('Payment', {order})
              }}
              text="Pay Now"
              style={{marginHorizontal: scaleVertical(25), marginVertical: scaleVertical(10)}}
            />
          </View>}

          {order?.driver && <DriverCard driver={order?.driver} /> }
          {order?.status === ORDER_STATUS.InTransit && <Button
            onPress={() => {
              navigate('OrderOnMap', {order: order})
            }}
            text="Show on Map"
            textColor={'item'}
            noBG
            fontSize={16}
            fontWeight={'600'}
            style={{marginHorizontal: scaleVertical(25), marginVertical: scaleVertical(10), borderColor: color.item, borderWidth: 1}}
          />}
          {order?.status === ORDER_STATUS.Delivered && !order?.driver_reviewed && <View style={[Flex.itemsCenter]}>
            <Button
              onPress={() => {
                setReviewMode(ORDER_REVIEW_MODE.DRIVER)
              }}
              isSecondary={true}
              style={[Margin.h10]}
              text={`Rate ${order?.driver?.name}'s Delivery`}
              />
          </View>}
        </View>
      </View>
      <RateModal visible={reviewMode !== ''} order={order} close={() => setReviewMode('')} mode={reviewMode} />
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white,
  },
  container: {backgroundColor: color.white},
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
    zIndex: 11,
  },
  itemImage: {
    width: "100%",
    height: screenWidth / 3 * 2,
  },
  itemImageContain: {
    width: wp(20),
    height: wp(20),
  },
  content: {
    paddingHorizontal: scaleVertical(25),
    paddingVertical: scaleVertical(15),
  },
  itemContainer: {
    flex: 1,
    marginBottom: scaleVertical(20),
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
  itemTitle: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: scaleVertical(10)},
  noData: {textAlign: 'center', marginTop: scaleVertical(20)},
  starContainer: {justifyContent: "flex-start"},
  starStyle: {marginRight: scaleVertical(1)},
  dishContainer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: hp(0.2)},
  priceContainer: {
    marginTop: hp(1),
  },
  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between', width: wp(100),
    paddingHorizontal: wp(3),
    paddingVertical: scaleVertical(5),
  },
});

export default OrderDetails;
