import {Alert, Linking, PermissionsAndroid, Platform, ToastAndroid} from "react-native";
import Geolocation from "react-native-geolocation-service";

export const hasPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert('Location permission denied');
  }

  if (status === 'disabled') {
    Alert.alert(`Turn on Location Services to determine your location.`, '', [
      {text: 'Go to Settings', onPress: openSetting},
      {
        text: "Don't Use Location", onPress: () => {
        }
      },
    ]);
  }

  return false;
};

export const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show(
      'Location permission denied by user.',
      ToastAndroid.LONG,
    );
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }
  return false;
};

export const getCurrentLocation = async () => {
  return new Promise(async (resolve, reject) => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      reject(new Error('Permission denied'));
    }

    Geolocation.getCurrentPosition((pos) => {
        // console.log('pos', pos)
        resolve(pos.coords)
      },
      (error) => {
        // See error code charts below.
        reject(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
    );
  })
};


export const extractLatLong = (location = '') => {
  const regex = /POINT\s\(([-\d.]+)\s([-+\d.]+)\)/;
  const matches = location.match(regex);
  const longitude = matches[1];
  const latitude = matches[2];
  return {latitude, longitude}
};
