import axios from "axios"
// config
import { appConfig } from "../config/app"
import NetInfo from "@react-native-community/netinfo"

axios.defaults.headers.common["ApiSecretKey"] = appConfig.apiSecretKey
axios.defaults.headers.common["ApiClientID"] = appConfig.apiClientID

function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null
  }
  return response.json ? response.json() : response
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  error.status = response.status
  throw error
}

export default (url, options, callback = false) => {
  return NetInfo.fetch().then(state => {
    if (state.isConnected && state.isInternetReachable) {
      return axios(url, {
        ...options,
        headers: {
          ...options.headers,
          // Cookie: `SessionID=${options.headers?.SessionID}; ARRAffinity=2ffcedd6130e0eb275479b88a8a4332d13dee9e85629d376f936e98c038facff; ARRAffinitySameSite=2ffcedd6130e0eb275479b88a8a4332d13dee9e85629d376f936e98c038facff; ARRAffinity=2ffcedd6130e0eb275479b88a8a4332d13dee9e85629d376f936e98c038facff; ARRAffinitySameSite=2ffcedd6130e0eb275479b88a8a4332d13dee9e85629d376f936e98c038facff`,
          // "Cache-Control": "no-cache, no-store, must-revalidate",
          // Pragma: "no-cache",
          // Expires: 0
        }
      })
    } else {
      const error = new Error()
      error.response = false
      error.message = "Network error"
      error.status = 420
      throw error
    }
  })
}
