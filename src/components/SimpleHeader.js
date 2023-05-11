import {StyleSheet, View, Image, TouchableOpacity, Pressable, ActivityIndicator} from "react-native"
import React from "react"
import {useNavigation} from "@react-navigation/native"
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {color, scale, scaleVertical} from "utils";
//Themes
import Images from "../theme/Images"
//Components
import {Text} from "./text"

const SimpleHeader = props => {
  const {
    title,
    showBackIcon,
    leftTitle,
    showLeftButton,
    leftButtonPress,
    rightTitle,
    showRightButton,
    rightButtonPress,
    rightLoader,
    rightIconSource,
    showRightIcon,
    rightIconStyle,
    rightIconNavigation,
    temporarilyStopRightIcon,
    refRBSheet,
    enterChallange,
    rightComponent
  } = props

  const navigation = useNavigation()
  return (
    <View style={styles.mainView}>
      <View style={styles.imageView}>
        {showLeftButton && (
          <Pressable onPress={leftButtonPress} style={styles.editButton}>
            <Text variant="caption" color="black">
              {leftTitle}
            </Text>
          </Pressable>
        )}
        {showBackIcon && (
          <TouchableOpacity
            style={styles.backIconView}
            onPress={() => {
              showBackIcon && navigation.goBack()
            }}
          >
            <MaterialIcons name={'arrow-back'} size={scale(20)} color={color.white}/>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginLeft: enterChallange ? 30 : 0,
        }}
      >
        <Text variant={'h5'} color={'black'} fontSize={14}>
          {title}
        </Text>
      </View>
      {
        rightComponent ??
        <View style={{paddingHorizontal: 20,}}>
          <TouchableOpacity
            // disabled={true}
            onPress={() => {
              if (showRightIcon && !temporarilyStopRightIcon) {
                navigation.navigate("Search")
              } else {
                refRBSheet && refRBSheet.current.open()
              }
            }}
          >
            {showRightIcon && (
              <Image source={rightIconSource} style={rightIconStyle}/>
            )}
          </TouchableOpacity>
        </View>
      }

      <View style={styles.imageView}>
        {showRightButton && (
          <Pressable onPress={rightButtonPress} style={[styles.editButton, {width: 55}]}>
            {rightLoader ?
              <ActivityIndicator color={color.white}/>
              :
              <Text variant="caption" color="black">
                {rightTitle}
              </Text>}
          </Pressable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainView: {
    height: scale(60),
    backgroundColor: color.white,
    alignItems: "center",
    // justifyContent: "space-between",
    flexDirection: "row"
  },
  imageView: {
    paddingHorizontal: scale(10),
  },
  editButton: {
    alignItems: 'center',
    padding: scale(5),
    paddingHorizontal: scale(10),
    borderRadius: scale(10)
  },
  backIconView: {
    width: scaleVertical(30),
    height: scaleVertical(30),
    borderRadius: scaleVertical(15),
    backgroundColor: color.black,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default SimpleHeader
