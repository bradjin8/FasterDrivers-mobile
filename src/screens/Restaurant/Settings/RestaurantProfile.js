import React, { useState, useRef } from "react";
import { StyleSheet, View, Image, Platform, Pressable } from "react-native";
import { color, scale, scaleVertical } from "utils";
import { Images } from "src/theme"
import { Button, CustomTextInput, Text } from "../../../components";
import BaseScreen from "../../../components/BaseScreen";
import SimpleHeader from "components/SimpleHeader";
import { useDispatch, useSelector } from "react-redux";
import { updateRestaurant } from "../../../screenRedux/loginRedux";
import { pickFromCamera, pickFromGallery } from "utils/Camera";
import ActionSheet from "react-native-actionsheet";

const RestaurantProfile = () => {
  const actionSheet = useRef(null);
  const ImagePickerOptions = ["Take Photo", "Choose from Gallery", "Cancel"];
  const dispatch = useDispatch();
  const user = useSelector(state => state.loginReducer.user)
  const loading = useSelector(state => state.loginReducer.loading)
  const [pickImage, setPickImage] = useState(user?.restaurant?.photo)
  const [changeImage, setChangeImage] = useState(null)
  const [restaurantDetails, setRestaurantDetails] = useState({
    "restaurant.name": user.restaurant.name,
    "restaurant.phone": user.restaurant.phone,
    "restaurant.street": user.restaurant.street,
    "restaurant.city": user.restaurant.city,
    "restaurant.state": user.restaurant.state,
    "restaurant.zip_code": user.restaurant.zip_code,
    "restaurant.website": user.restaurant.website,
    "restaurant.ein_number": user.restaurant.ein_number,
    "restaurant.description": user.restaurant.description,
    "restaurant.type": user.restaurant.type,
  })

  const onChangeText = (key, text) => {
    setRestaurantDetails(prevState => ({ ...prevState, [key]: text }));
  }

  const onSave = () => {
    let data = new FormData();
    if(changeImage) {
      data.append('restaurant.photo', {
        name: `rnd-${pickImage.path}`,
        type: pickImage.mime,
        uri: Platform.OS === 'ios' ? pickImage.sourceURL.replace('file://', '') : pickImage.path,
        data: pickImage.data
      });
    }
    data.append("restaurant.name", restaurantDetails["restaurant.name"]);
    data.append("restaurant.phone", restaurantDetails["restaurant.phone"]);
    data.append("restaurant.street", restaurantDetails["restaurant.street"]);
    data.append("restaurant.city", restaurantDetails["restaurant.city"]);
    data.append("restaurant.state", restaurantDetails["restaurant.state"]);
    data.append("restaurant.zip_code", restaurantDetails["restaurant.zip_code"]);
    data.append("restaurant.website", restaurantDetails["restaurant.website"]);
    data.append("restaurant.ein_number", restaurantDetails["restaurant.ein_number"]);
    data.append("restaurant.description", restaurantDetails["restaurant.description"]);
    data.append("restaurant.type", restaurantDetails["restaurant.type"]);

    dispatch(updateRestaurant(data))
  }

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="My Restaurant"
        showBackIcon={true}
      />
      <View style={styles.container}>

        <View style={styles.imageContain}>
          <Pressable style={styles.imageButton} onPress={() => actionSheet.current.show()}>
            <View style={styles.pencileView}>
              <Image source={Images.Edit} style={{width: scaleVertical(12), height: scaleVertical(12)}} />
            </View>
            {pickImage ?
             <Image source={{uri: changeImage ? pickImage?.path : pickImage}} style={styles.actualImage} defaultSource={Images.Capture} />
            :
             <Image source={Images.Capture} defaultSource={Images.Capture} style={styles.icon} />
            }
          </Pressable>
        </View>

        <View>
          <Text variant="text" color="black" >
            Restaurant Name
          </Text>
          <CustomTextInput
            value={restaurantDetails["restaurant.name"]}
            onChangeText={(text) => onChangeText("restaurant.name", text)}
          />
          <Text variant="text" color="black" >
            Street
          </Text>
          <CustomTextInput
            value={restaurantDetails["restaurant.street"]}
            onChangeText={(text) => onChangeText("restaurant.street", text)}
          />
          <Text variant="text" color="black" >
            City
          </Text>
          <CustomTextInput
            value={restaurantDetails["restaurant.city"]}
            onChangeText={(text) => onChangeText("restaurant.city", text)}
          />

          <View style={styles.stateView}>
            <View style={{width: '47%'}}>
              <Text variant="text" color="black" >
                State
              </Text>
              <CustomTextInput
                value={restaurantDetails["restaurant.state"]}
                onChangeText={(text) => onChangeText("restaurant.state", text)}
              />
            </View>
            <View style={{width: '47%'}}>
              <Text variant="text" color="black" >
                Zip Code
              </Text>
              <CustomTextInput
                value={restaurantDetails["restaurant.zip_code"]}
                onChangeText={(text) => onChangeText("restaurant.zip_code", text)}
              />
            </View>
          </View>

          <Text variant="text" color="black" >
            Website
          </Text>
          <CustomTextInput
            value={restaurantDetails["restaurant.website"]}
            onChangeText={(text) => onChangeText("restaurant.website", text)}
          />
          <Text variant="text" color="black" >
            EIN Number
          </Text>
          <CustomTextInput
            value={restaurantDetails["restaurant.ein_number"]}
            onChangeText={(text) => onChangeText("restaurant.ein_number", text)}
          />
          <Text variant="text" color="black" >
            Phone Number
          </Text>
          <CustomTextInput
            value={restaurantDetails["restaurant.phone"]}
            onChangeText={(text) => onChangeText("restaurant.phone", text)}
          />
          <Text variant="text" color="black" >
            Type of the restaurant
          </Text>
          <CustomTextInput
            value={restaurantDetails["restaurant.type"]}
            onChangeText={(text) => onChangeText("restaurant.type", text)}
          />
          <Text variant="text" color="black" >
            Description
          </Text>
          <CustomTextInput
            value={restaurantDetails["restaurant.description"]}
            onChangeText={(text) => onChangeText("restaurant.description", text)}
            multiline={true}
            style={{textAlignVertical: 'top'}}
          />
        </View>
        <View style={{marginTop: scaleVertical(25)}}>
          <Button loading={loading} text='Save' fontSize={16} onPress={() => onSave()} />
        </View>
      </View>
      <ActionSheet
        ref={actionSheet}
        title={"Select Image"}
        options={ImagePickerOptions}
        cancelButtonIndex={2}
        onPress={async (index) => {
          let res;
          switch (index) {
            case 0:
              res = await pickFromCamera();
              break;
            case 1:
              res = await pickFromGallery();
              break;
          }
          if (res) {
            setChangeImage(true)
            setPickImage(res)
          }
        }}
      />
    </BaseScreen>
  )
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: color.white
  },
  container: {flex: 1, backgroundColor: color.white, padding: scaleVertical(25)},
  imageContain: {width: '100%', justifyContent: 'center',alignItems: 'center'},
  imageButton: {
    width: scaleVertical(80),
    height: scaleVertical(80),
    borderRadius: scaleVertical(40),
    marginVertical: scaleVertical(25),
    backgroundColor: color.lightGray,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pencileView: {
    width: scaleVertical(25), height: scaleVertical(25), borderRadius: scaleVertical(12.5),
    backgroundColor: color.white, position: 'absolute', top: 0, right: 0, alignItems: 'center', justifyContent: 'center', zIndex: 100
  },
  actualImage: {
    width: scaleVertical(80),
    height: scaleVertical(80),
    borderRadius: scaleVertical(40)
  },
  icon: {
    width: scale(36),
    height: scaleVertical(30),
    tintColor: 'white'
  },
  stateView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default RestaurantProfile;
