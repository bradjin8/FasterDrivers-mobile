import React from 'react';
import { TextInput, StyleSheet, View } from "react-native";
import { color, scale, scaleVertical } from "utils";
import { Text } from './text';
import DropDownPicker from "react-native-dropdown-picker";

export const CustomDropDown = ({
  openCategory,
  category,
  categoryOptions,
  setOpenCategory,
  setCategory,
  setCategoryOptions,
  hasError,
  errorMessage,
}) => {

  return (
    <View>
      <DropDownPicker
        style={styles.dropDown}
        placeholder={""}
        open={openCategory}
        value={category}
        items={categoryOptions}
        setOpen={setOpenCategory}
        setValue={setCategory}
        setItems={setCategoryOptions}
        dropDownContainerStyle={{
          borderWidth: 0,
          borderRadius: 10,
          backgroundColor: color.white,
        }}
        labelStyle={{
          fontFamily: "Lato-Light",
        }}
        listItemLabelStyle={{
          fontFamily: "Lato-Light",
        }}
      />
      {hasError && <Text color="error" variant="text">{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  dropDown: {
    backgroundColor: color.secondary,
    borderRadius: scale(10),
    paddingVertical: scale(10),
    marginVertical: scaleVertical(5),
    padding: scale(15),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderWidth: 0,
  },
});
