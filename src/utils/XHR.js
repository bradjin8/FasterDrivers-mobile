import axios from "axios"
// config
import { appConfig } from "../config/app"
import NetInfo from "@react-native-community/netinfo"
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-community/async-storage";

// axios.defaults.headers.common["ApiSecretKey"] = appConfig.apiSecretKey
// axios.defaults.headers.common["ApiClientID"] = appConfig.apiClientID

export default async (url, options, callback = false) => {
  // return NetInfo.fetch().then(async state => {
  //   if (state.isConnected && state.isInternetReachable) {
  const token = await AsyncStorage.getItem("token")
  return axios(url, {
    ...options,
    headers: {
      ...(token && { 'Authorization': `Token ${token}` }),
      'Accept': "application/json",
      'Content-Type': 'multipart/form-data',
      ...options.headers,
    }
  })
  // }
  // else {
  //   showMessage({
  //     message: "Failed to reach server due to network issue, please try again",
  //     type: "danger"
  //   })
  // }
  // })
}
