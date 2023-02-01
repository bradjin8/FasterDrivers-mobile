import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import { appConfig } from "src/config/app";
import XHR from "../utils/XHR"

export async function getProfileAPI() {
  const userAccount = await AsyncStorage.getItem("userAccount")
  const userData = JSON.parse(userAccount)
  const URL = `${appConfig.backendServerURL}/api/v4/Profile/${userData.Account.ID}`
  const options = {
    headers: {
      Accept: "application/json",
      SessionID: userData.SessionID
    },
    method: "GET"
  }
  return XHR(URL, options)
}
