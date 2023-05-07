import OrderStatusIndicator from "components/OrderStatusIndicator";
import React, {useEffect, useState} from "react";
import {Image, Pressable, ScrollView, StyleSheet, TextInput, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import {color, scale, scaleVertical, screenWidth} from "utils";
import {Images} from "src/theme";
import {ActivityIndicators, Button, Text} from "../../../components/index";
import Icon from "react-native-vector-icons/dist/Feather";
import {useDispatch, useSelector} from "react-redux";
import {ORDER_STATUS} from "../../../consts/orders";
import {getDishById, getRestaurantDetails, setUserCartItems} from "../../../screenRedux/customerRedux";
import {goBack, navigate} from "navigation/NavigationService";
import StarRating from "react-native-star-rating-new";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {Linking} from "react-native";

const OrderDetails = ({route}) => {
  const dispatch = useDispatch();
  const {loading, payment} = useSelector(state => state.customerReducer);
  const order = route?.params?.order;
  const {id, photo, name, street, city, zip_code, state, description, type, rating, rating_count} = order.restaurant
  const [orderedDishes, setOrderedDishes] = useState([])
  const [rate, setRate] = useState(0)
  const [review, setReview] = useState('')

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

  console.log('order', order)

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 65}}>
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
              halfStarEnabled={false}
              maxStars={1}
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

          {order?.driver && <View style={styles.driverContainer}>
            <View style={styles.flex}>
              <Image source={{uri: order?.driver?.photo || "https://fancy-cherry-36842.s3.amazonaws.com/media/restaurant/images/beafbe99-6412-41dd-b948-c8fb03be32c4.jpg"}} style={styles.avatar} resizeMode={'cover'}/>
              <View style={styles.column}>
                <Text color={'itemPrimary'} fontSize={10}>Courier</Text>
                <Text variant={'strong'}>Wade Warren</Text>
              </View>
            </View>
            <Pressable style={styles.phone} onPress={() => {
              const url = `tel:${order?.driver?.phone}`
              Linking.openURL(url)
                .then((res) => {
                  if (!res)
                    showMessage({
                      message: 'Driver does not have a phone number',
                      type: 'danger',
                    })
                })
            }}>
              <Image source={Images.Phone} resizeMode={'contain'}/>
            </Pressable>
          </View>}
          {order?.driver !== null && <Button
            onPress={() => {
              navigate('Map', {driver: order?.driver})
            }}
            text="Show on Map"
            textColor={'item'}
            noBG
            style={{marginHorizontal: scaleVertical(25), marginVertical: scaleVertical(10), borderColor: color.item, borderWidth: 1}}
          />}
          {order?.status === ORDER_STATUS.Delivered && <View style={styles.reviewContainer}>
            <View style={styles.rateContainer}>
              <Text variant={'strong'}>Tap to Rate</Text>
              <StarRating
                rating={rate}
                starSize={20}
                fullStarColor={color.primary}
                containerStyle={styles.rateStar}
                halfStarEnabled
                selectedStar={(rating) => setRate(rating)}
              />
            </View>
            <Text variant='strong'>Review the Restaurant:</Text>
            <TextInput
              style={styles.reviewText}
              placeholder={'Write your review here'}
              placeholderTextColor={color.darkGray}
              multiline
              numberOfLines={6}
              value={review}
              onChangeText={(text) => setReview(text)}
            />
          </View>}
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
    // right: 0,
    zIndex: 11,
  },
  itemImage: {
    width: "100%",
    height: screenWidth / 2.5,
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
  driverContainer: {
    width: wp(100),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(10),
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: wp(3),
    // flex: 1,
  },
  phone: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    backgroundColor: color.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewContainer: {
    marginHorizontal: scale(25),
    marginVertical: scale(10),
  },
  rateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1),
  },
  rateStar: {
    marginLeft: wp(2),
    width: wp(30)
  },
  reviewText: {
    marginTop: hp(1),
    borderRadius: scale(15),
    borderWidth: 1,
    borderColor: color.black,
    padding: scale(20),
    lineHeight: scale(20),
    minHeight: hp(15)
  }
});

export default OrderDetails;
