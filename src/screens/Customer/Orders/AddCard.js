import React, { useState } from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
import { color, scaleVertical, customerSettingData, scale } from "utils";
import SimpleHeader from "../../../components/SimpleHeader";
import { Button, CustomTextInput, Text } from "../../../components/index";
import FontAwesomeIcons from 'react-native-vector-icons/dist/FontAwesome';
import { navigate } from "navigation/NavigationService";
import { useDispatch, useSelector } from "react-redux";

const AddCard = ({}) => {
  const dispatch = useDispatch()
  const [cardHolder, setCardHolder] = useState(null)
  
  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Add Card"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <Text variant="text" color="black" style={styles.inputTitle}>
            Card holder name
          </Text>
          <CustomTextInput
            value={cardHolder}
            placeholder="jennywilson@email.com"
            onChangeText={(text) => setCardHolder(text)}
            // onBlurText={onBlurUser}
            // hasError={userError}
            errorMessage={"Enter valid cardholder name"}
          />
        </View>
      </View>
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
})

export default AddCard;
