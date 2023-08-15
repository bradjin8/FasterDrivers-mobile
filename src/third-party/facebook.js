import {AccessToken, LoginManager} from "react-native-fbsdk-next"

export const authorizeWithFB = async () => {
  const fb_result = await LoginManager.logInWithPermissions([
    "public_profile",
    "email"
  ])
  if (!fb_result.isCancelled) {
    const data = await AccessToken.getCurrentAccessToken()
    return data.accessToken
  } else {
    throw new Error("The user canceled the signin request.")
  }
}
