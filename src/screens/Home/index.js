import React from "react"
import { StyleSheet, View } from "react-native";
import { color, scale } from "utils";
import { Button, CustomTextInput } from '../../components/index';
import SimpleHeader from '../../components/SimpleHeader';
import { useSelector, useDispatch } from "react-redux";
import { setAccessToken } from "../../screenRedux/loginRedux"

const Home = props => {
  const accessToken = useSelector(state => state.loginReducer.accessToken)
  const dispatch = useDispatch()
  dispatch(setAccessToken('accessToken'))
  
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <SimpleHeader />
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
