import React from "react";
import { StyleSheet, View, ScrollView, Image, Pressable } from "react-native";
import { color, scaleVertical, restaurantSettingData } from "utils";
import SimpleHeader from "../../../components/SimpleHeader";
import { Text } from "../../../components/index";
import { Images } from "src/theme"
import { navigate } from "navigation/NavigationService";
import { useDispatch } from "react-redux";
import { logoutRequest } from "../../../screenRedux/loginRedux";

const Settings = ({}) => {
  const dispatch = useDispatch()

  const redirectTo = (key) => {
    if(key === "logout") {
      dispatch(logoutRequest())
    }
    key && navigate(key)
  }
  
  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Settings"
        showBackIcon={true}
      />
      <ScrollView style={styles.container}>
        {restaurantSettingData.map((setting, index) => {
          return(
            <Pressable onPress={() =>  redirectTo(setting.key)} key={index.toString()}>
              <View  style={styles.listContain}>
                <View style={{flexDirection: 'row'}}>
                  <Image source={setting.icon}  style={{width: 20, height: 20}} resizeMode="contain" />
                  <Text variant="text" color="black" fontSize={16} style={styles.inputTitle} fontWeight="400">
                    {setting.title}
                  </Text>
                </View>
                <Image source={Images.Next}  style={styles.nextArrow} resizeMode="contain"/>
              </View>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
  listContain: {
    flexDirection: 'row',
    paddingVertical: scaleVertical(16),
    justifyContent: 'space-between'
  },
  inputTitle: {
    paddingHorizontal: scaleVertical(20)
  },
  nextArrow: {width: 10, height: 10 },
})

export default Settings;
