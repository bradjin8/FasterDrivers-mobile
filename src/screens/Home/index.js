import React from "react"
import { StyleSheet, View } from "react-native";
import { color, scale } from "utils";
import { Button, CustomTextInput } from '../../components/index';

const Home = props => {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{flex: 1, backgroundColor: color.primary}}>
        <CustomTextInput />
        <Button text='Cancel' fontSize={16} style={{ marginBottom: 5 }} onPress={() => {}} />
        <Button variant={'outline'} text='Report Comment' fontSize={16} style={{ marginBottom: 5 }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: scale(10)
  },
})

export default Home
