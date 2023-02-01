import { StyleSheet, View, Image, TouchableOpacity, Pressable, ActivityIndicator } from "react-native"
import React from "react"
import { useNavigation } from "@react-navigation/native"
import { color, scale } from "utils";
//Themes
import Images from "../theme/Images"
//Components
import { Text } from "./text"

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
            style={{ paddingLeft: 2, paddingRight: 15, paddingVertical: 10 }}
            onPress={() => {
              showBackIcon && navigation.goBack()
            }}
          >
            <Image
              source={Images.HomeOn}
              style={{ width: 10, height: 17 }}
            />
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
        <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>
          {title}
        </Text>
      </View>
      {
        rightComponent ??
        <View style={{ paddingHorizontal: 20, }}>
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
              <Image source={rightIconSource} style={rightIconStyle} />
            )}
          </TouchableOpacity>
        </View>
      }
      
      <View style={styles.imageView}>
        {showRightButton && (
          <Pressable onPress={rightButtonPress} style={[styles.editButton, {width: 55}]}>
              {rightLoader ?
               <ActivityIndicator color={color.white} />
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
    justifyContent: "space-between",
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
})

export default SimpleHeader
