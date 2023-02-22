import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Image, Pressable } from "react-native";
import { color, scaleVertical, customerSettingData, scale } from "utils";
import SimpleHeader from "../../../components/SimpleHeader";
import { Button, Text } from "../../../components/index";
import FontAwesomeIcons from 'react-native-vector-icons/dist/FontAwesome';
import { navigate } from "navigation/NavigationService";
import { useDispatch, useSelector } from "react-redux";
import { createNewOrder } from "../../../screenRedux/customerRedux";

const Payment = ({}) => {
  const dispatch = useDispatch()
  const cartItemsReducer = useSelector(state => state.customerReducer.carts)
  const [cartItems, setCartItems] = useState(cartItemsReducer)
  const addresses = useSelector(state => state.customerReducer.addresses);
  const defaultAddress = addresses?.find(o => o.default)
  
  const createPayment = () => {
    let data = new FormData();
    data.append('restaurant', cartItems[0].restaurant);
    
    if(defaultAddress) {
      data.append('address', defaultAddress.id);
    }
    cartItems.map((item, index) => {
      data.append(`dishes[${index}]dish`, item.id);
      data.append(`dishes[${index}]quantity`, item.quantity);
      // data.append('dishes[0]dish_addons[0]item', "7516a864-c9b8-494e-be5b-8b80b2bfd7fd");
      // data.append('dishes[0]dish_addons[0]quantity', "2");
    })
    dispatch(createNewOrder(data))
  }
  
  const renderFinalTotal = () => {
    return  cartItems.length && cartItems.reduce((prev,curr) => {
      return prev + (curr.quantity * curr.price)
    }, 0).toFixed(2)
  }
  
  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Payment"
        showBackIcon={true}
      />
      <ScrollView style={styles.container}>
        <View style={styles.pricingView}>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">Total</Text>
          <Text variant="text" color="black" fontSize={14} fontWeight="400">${renderFinalTotal()}</Text>
        </View>
        <View style={styles.innerContain}>
          {addresses?.map((address, index) => {
            return(
              <Pressable style={styles.itemContain} key={index.toString()}>
                {address.default && <View style={styles.checkView}>
                  <FontAwesomeIcons name="check-circle" size={16} color={color.primary} />
                </View>}
                <Text variant="text" color="black" fontSize={16} fontWeight="700">Master Card</Text>
                <View style={[styles.flexDirection, styles.paddingTop]}>
                  <FontAwesomeIcons name="cc-mastercard" size={16} color={color.black} style={{marginRight: scaleVertical(10)}} />
                  <Text variant="text" color="black" fontSize={16} fontWeight="400">************* 436</Text>
                </View>
              </Pressable>
            )
          })}
          <Button
            style={styles.btnStyle}
            variant="outline"
            text="Add New Payment Method"
            textColor="black"
            onPress={() => {}}
            fontSize={16}
            fontWeight="600"
            icon="add"
          />
        </View>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {
    flex: 1,
    backgroundColor: color.white,
    padding: scaleVertical(25),
  },
  flexDirection: {
    flexDirection: "row",
  },
  paddingTop: {
    paddingTop: scaleVertical(5),
  },
  innerContain: {
    marginBottom: 25,
    backgroundColor: color.white,
    padding: scaleVertical(10)
  },
  itemContain: {
    backgroundColor: color.secondary,
    borderRadius: scale(10),
    borderColor: color.primary,
    borderWidth: scale(1),
    marginBottom: scale(15),
    padding: scale(10),
    justifyContent: 'center',
  },
  checkView: {
    position: 'absolute',
    right: -4,
    top: -6,
  },
  pricingView: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: scaleVertical(3),
  },
  btnStyle: {
    borderColor: color.black,
  },
})

export default Payment;
