import { Alert, Platform } from "react-native";
import * as Permissions from "react-native-permissions";
import ImagePicker from "react-native-image-crop-picker";
import { getGlobalOptions } from "@options";
const global = getGlobalOptions();

async function askPermission(permission) {
  try {
    let status = await Permissions.check(permission);
    if (status !== Permissions.RESULTS.GRANTED) {
      // if not already granted then ask
      status = await Permissions.request(permission);
      if (status !== Permissions.RESULTS.GRANTED) {
        // user denied on ask
        return false;
      }
    }
    return true;
  } catch (err) {
    console.log("askPermission err", err, " for permission", permission);
    return false;
  }
}

export async function getCameraGalleryPermissions() {
  // need both permissions for camera, so ask both on gallery and camera
  const { PERMISSIONS } = Permissions;
  let permission = Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA
  });

  const cameraPermissions = await askPermission(permission);
  permission = Platform.select({
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY
  });
  const storagePermissions = await askPermission(permission);
  console.log("cameraPermissions", cameraPermissions, "storagePermissions", storagePermissions)
  return cameraPermissions && storagePermissions;
}

function permissionsAlert() {
  Alert.alert(
    "Permissions Required",
    "App requires Camera & Photos access to function properly. Please go to settings to enable manually.",
    [
      {
        text: "Cancel",
        onPress: () => {
          console.log("Cancel Pressed");
        },
        style: "cancel"
      },
      {
        text: "Settings",
        onPress: () => {
          Permissions.openSettings().catch(() =>
            console.log("cannot open settings")
          );
        }
      }
    ]
  );
}

export const pickFromGallery = async (width = 500, height = 400) => {
  const havePermission = await getCameraGalleryPermissions();
  if (!havePermission) {
    permissionsAlert();
    return false;
  } else {
    try {
      const res = await ImagePicker.openPicker({
        width: width,
        height: height,
        cropping: true,
        mediaType: "photo",
        includeBase64: true
      });
      return res;
    } catch (err) {
      console.log("@@@@@@@@@@ pickFromGallery err", err);
      return false;
    }
  }
};

export const pickFromCamera = async (width = 500, height = 400) => {
  const havePermission = await getCameraGalleryPermissions();
  if (!havePermission) {
    permissionsAlert();
    return false;
  } else {
    try {
      const res = await ImagePicker.openCamera({
        width: width,
        height: height,
        cropping: true,
        mediaType: "photo",
        includeBase64: true,
      });
      return res;
    } catch (err) {
      console.log("@@@@@@@@@@ pickFromCamera err", err);
      return false;
    }
  }
};
