import React, { useState } from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
import { color, scaleVertical, customerSettingData, scale } from "utils";
import SimpleHeader from "../../../components/SimpleHeader";
import { Button, CustomTextInput, Text } from "../../../components/index";
import FontAwesomeIcons from 'react-native-vector-icons/dist/FontAwesome';
import { navigate } from "navigation/NavigationService";
import { useDispatch, useSelector } from "react-redux";
import BaseScreen from "../../../components/BaseScreen";

const AddCard = ({}) => {
  const dispatch = useDispatch()
  const [cardHolder, setCardHolder] = useState(null)
  const [cardNumber, setCardNumber] = useState(null)
  const [cardDate, setCardDate] = useState(null)
  const [cvv, setCvv] = useState(null)
  
  const onBlurCard = () => {};
  
  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Add Card"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={{width: '100%',}}>
          <Text variant="text" color="black" style={styles.inputTitle}>
            Card holder name
          </Text>
          <CustomTextInput
            value={cardHolder}
            placeholder="Card holder name"
            onChangeText={(text) => setCardHolder(text)}
            onBlurText={onBlurCard}
          />
          
          <Text variant="text" color="black" style={styles.inputTitle}>
            Card number
          </Text>
          <CustomTextInput
            value={cardNumber}
            placeholder="_ _ _ _  _ _ _ _  _ _ _ _  _ _ _ _"
            onChangeText={(text) => setCardNumber(text)}
            onBlurText={onBlurCard}
          />
          
          <View style={styles.flexDirection}>
            <View style={styles.widthHalf}>
              <Text variant="text" color="black" style={styles.inputTitle}>
                Expire date
              </Text>
              <CustomTextInput
                value={cardDate}
                placeholder="mm/yyyy"
                onChangeText={(text) => setCardDate(text)}
                onBlurText={onBlurCard}
              />
            </View>
            <View style={styles.widthHalf}>
              <Text variant="text" color="black" style={styles.inputTitle}>
                CVV
              </Text>
              <CustomTextInput
                value={cvv}
                placeholder="***"
                onChangeText={(text) => setCvv(text)}
                onBlurText={onBlurCard}
              /></View>
          </View>
          <Button loading={false} text="Add Card" mt={20} onPress={() => navigate("AddCard")} />
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
  container: {
    flex: 1,
    backgroundColor: color.white,
    padding: scaleVertical(25),
  },
  flexDirection: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  widthHalf: {
    width: '47%',
  }
})

export default AddCard;
