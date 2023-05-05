import React, { useRef, useState } from "react";
import { StyleSheet, View, Image, Pressable, ScrollView, Platform } from "react-native";
import { color, scale, scaleVertical } from "utils";
import { Images } from "src/theme"
import { Button, Text, CustomTextInput, CustomDropDown } from "../../../components/index";
import { navigate } from "navigation/NavigationService";
import SimpleHeader from "components/SimpleHeader";
import BaseScreen from "../../../components/BaseScreen";
import { pickFromCamera, pickFromGallery } from "utils/Camera";
import ActionSheet from "react-native-actionsheet";
import { useDispatch, useSelector } from "react-redux";
import { addNewDishRequest, restaurantReducer } from "../../../screenRedux/restaurantRedux";

const AddNewDish = ({}) => {
  const actionSheet = useRef(null);
  const dispatch = useDispatch()
  const loading = useSelector(state => state.restaurantReducer.loading)
  const ImagePickerOptions = ["Take Photo", "Choose from Gallery", "Cancel"];
  const [uploadImage, setUploadImage] = useState([]);
  const [newDish, setNewDish] = useState({});
  const [changeImage, setChangeImage] = useState(null)
  const [category, setCategory] = useState(null);
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([
    {label: 'Burger', value: 'Burger'},
    {label: 'Wings', value: 'Wings'},
    {label: 'Salads', value: 'Salads'},
    {label: 'Soups', value: 'Soups'},
  ])
  const [addons, setAddons] = useState([])

  const { name, description, price, sku_number } = newDish

  const onChangeText = (key, text) => {
    setNewDish(prevState => ({ ...prevState, [key]: text }));
  }

  const onSave = () => {
    let data = new FormData();
    if(changeImage) {
      uploadImage.map((image, index) => {
        data.append(`image_${index+1}`, {
          name: `rnd-${image.path}`,
          type: image.mime,
          uri: Platform.OS === 'ios' ? image.sourceURL.replace('file://', '') : image.path,
          data: image.data
        });
      });
    }
    data.append("name", name);
    data.append("category", category);
    data.append("description", description);
    data.append("price", price);
    data.append("sku_number", sku_number);
    data.append("addons", addons)

    dispatch(addNewDishRequest(data));
  }

  return (
    <BaseScreen style={styles.mainWrapper}>
      <SimpleHeader
        title="Add New Dish"
        showBackIcon={true}
      />
      <View style={styles.container}>

        <ScrollView horizontal={true} style={styles.scrollContain}>
          {uploadImage.map((image, index) => {
            return(
              <View style={styles.imageContain} key={index.toString()}>
                <Image source={{uri: image.path}} style={styles.actualImage} defaultSource={Images.Capture} />
              </View>
            )
          })}
          <Pressable style={styles.imageButton} onPress={() => actionSheet.current.show()}>
            <Image source={Images.Capture} defaultSource={Images.Capture} style={styles.icon} />
          </Pressable>
        </ScrollView>

        <View style={{flexDirection: 'column-reverse'}}>
          <CustomTextInput
            value={sku_number}
            onChangeText={(text) => onChangeText("sku_number", text)}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            SKU NUMBER
          </Text>

          <CustomTextInput
            value={price}
            onChangeText={(text) => onChangeText("price", text)}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            PRICE
          </Text>

          <CustomTextInput
            value={description}
            onChangeText={(text) => onChangeText("description", text)}
            multiline={true}
            style={{textAlignVertical: 'top'}}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            DESCRIPTION
          </Text>

          <CustomTextInput
            value={name}
            onChangeText={(text) => onChangeText("name", text)}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            NAME OF DISH
          </Text>

          <CustomDropDown
            openCategory={openCategory}
            category={category}
            categoryOptions={categoryOptions}
            setOpenCategory={setOpenCategory}
            setCategory={setCategory}
            setCategoryOptions={setCategoryOptions}
          />
          <Text variant="text" color="black" style={styles.inputTitle}>
            CATEGORY
          </Text>
        </View>

        <View>
          <Pressable>
            <Text variant={'strong'} color={'primary'} fontWeight={'400'}>
              Add Ons +
            </Text>
          </Pressable>
        </View>

        <View style={styles.btnView}>
          <Button loading={loading} text='Save' fontSize={16} onPress={() => onSave()} />
          <Button textColor={'black'} noBG text='Cancel' fontSize={16} mt={10} onPress={() => navigate("AddNewDish")} />
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
            setUploadImage(uploadImage => [...uploadImage, res]);
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
  scrollContain: {
    paddingBottom: scaleVertical(30)
  },
  imageContain: {
    width: scaleVertical(80),
    height: scaleVertical(80),
    borderRadius: scaleVertical(40),
    marginRight: scale(15),
  },
  imageButton: {
    marginRight: scale(15),
    width: scaleVertical(80),
    height: scaleVertical(80),
    borderRadius: scaleVertical(40),
    backgroundColor: color.lightGray,
    justifyContent: 'center',
    alignItems: 'center'
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
  btnView: {
    paddingVertical: scaleVertical(10)
  }
})

export default AddNewDish;

