import React from "react"
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux"
import { color } from 'utils'

const Setting = props => {
  return (
    <View style={{flex: 1, backgroundColor: color.black}}>
      <Text>Text</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  icon: {
    height: 16,
    width: 10,
    resizeMode: "contain"
  }
})

const mapsStateToProps = state => ({
  // resendRequesting: state.loginReducer.requesting
})

const mapsDispatchToProps = dispatch => ({
  // setAccessToken: data => dispatch(setAccessToken(data))
})

export default connect(mapsStateToProps, mapsDispatchToProps)(Setting)
