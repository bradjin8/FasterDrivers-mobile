import {navigate} from "navigation/NavigationService";
import React from "react";
import {Alert, Image, Pressable, ScrollView, StyleSheet, View} from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {useDispatch, useSelector} from "react-redux";
import {color, customerSettingData, scaleVertical} from "utils";
import {Text} from "../../../components/index";
import SimpleHeader from "../../../components/SimpleHeader";
import {deleteAccountRequest, logoutRequest} from "../../../screenRedux/loginRedux";

const Settings = ({}) => {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.loginReducer)
  const redirectTo = (key) => {
    switch (key) {
      case 'logout':
        Alert.alert(`Are you sure you want to log out?`, '', [
          {
            text: 'Cancel', onPress: () => {
            }
          },
          {
            text: "Yes", onPress: () => {
              dispatch(logoutRequest())
            }
          },
        ]);
        break
      case 'deleteAccount':
        Alert.alert(`Are you sure you want to delete your account?`, '', [
          {
            text: 'Cancel', onPress: () => {
            }
          },
          {
            text: "Yes", onPress: () => {
              dispatch(deleteAccountRequest(user.id))
            }
          },
        ]);
        break
      case 'Wallet':
        navigate('Orders', {screen: 'Payment'})
        break
      default:
        key && navigate(key)
    }
  }

  return (
    <View style={styles.mainWrapper}>
      <SimpleHeader
        title="Settings"
        showBackIcon={true}
      />
      <ScrollView style={styles.container}>
        {customerSettingData.map((setting, index) => {
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
  nextArrow: {width: 10, height: 10 },
})

export default Settings;
