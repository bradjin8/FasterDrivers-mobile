import React, { useState } from "react";
import { StyleSheet, View, Image, ScrollView, Pressable } from "react-native";
import { color, scale, scaleVertical, restaurantSettingData } from "utils";
import { Images } from "src/theme"
import { Button, CustomTextInput, Text } from "../../../components/index";
import SimpleHeader from "components/SimpleHeader";
import BaseScreen from "../../../components/BaseScreen";
import { navigate } from "navigation/NavigationService";

const Menu = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState(null);
  
  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Menu"
        showBackIcon={true}
      />
      <View style={styles.container}>
        <View style={{paddingBottom: scaleVertical(10)}}>
          <CustomTextInput
            value={searchValue}
            placeholder="Search dishesh"
            onChangeText={(text) => setSearchValue(text)}
          />
        </View>
        
        <View style={styles.titleView}>
          <Text variant="text" color="black" fontSize={14} fontWeight="600">
            Dishes
          </Text>
          <View style={styles.btnView}>
            <Button loading={false} text='Add New' fontSize={16} onPress={() => navigate("AddNewDish")} />
          </View>
        </View>
  
        <ScrollView style={styles.scrollContainer}>
          {restaurantSettingData.map((setting) => {
            return(
              <Pressable onPress={() => {}}>
                <View  style={styles.listContain}>
                  <View style={{flexDirection: 'row'}}>
                    <Image source={setting.icon}  style={{width: 20, height: 20}} resizeMode="contain" />
                    <Text variant="text" color="black" fontSize={16} style={styles.inputTitle} fontWeight="400">
                      {setting.title}
                    </Text>
                  </View>
                  <Image source={Images.Next}  style={{width: 10, height: 10 }} resizeMode="contain"/>
                </View>
              </Pressable>
            )
          })}
        </ScrollView>

      </View>
    </BaseScreen>
  )
}
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
  btnView: {width: scale(100)},
  titleView: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  
  scrollContainer: {flex:1, paddingVertical: scaleVertical(10)},
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

export default Menu;
