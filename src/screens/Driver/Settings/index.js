import {navigate} from "navigation/NavigationService";
import React from "react";
import {Image, Pressable, ScrollView, StyleSheet, View} from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {useDispatch} from "react-redux";
import {color, driverSettingData, scaleVertical} from "utils";
import {Text} from "../../../components/index";
import SimpleHeader from "../../../components/SimpleHeader";
import {logoutRequest} from "../../../screenRedux/loginRedux";

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
        {driverSettingData.map((setting, index) => {
          return(
            <Pressable onPress={() =>  redirectTo(setting.key)} key={index.toString()}>
              <View  style={styles.listContain}>
                <View style={{flexDirection: 'row'}}>
                  <Image source={setting.icon}  style={{width: 20, height: 20}} resizeMode="contain" />
                  <Text variant="text" color="black" fontSize={16} style={styles.inputTitle} fontWeight="400">
                    {setting.title}
                  </Text>
                </View>
                <SimpleLineIcons name={'arrow-right'} size={10} color={color.black}/>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputTitle: {
    paddingHorizontal: scaleVertical(20)
  },
})

export default Settings;
