import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-community/async-storage"
import { showMessage } from "react-native-flash-message"

// config
import { appConfig } from "../config/app"

// utils
import XHR from "../utils/XHR"
import { navigate } from "navigation/NavigationService"

//Types
const LOGIN_REQUEST = "SCREEN/LOGIN_REQUEST"

const initialState = {
  accessToken: false
}

//Actions
export const setAccessToken = accessToken => ({
  type: LOGIN_REQUEST,
  accessToken
})

//Reducers
export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        accessToken: action.accessToken,
      }
    default:
      return state
  }
}

//PhoneNumberSaga
function loginAPI(data) {
  const URL = `${appConfig.backendServerURL}/api/v4/`
  const options = {
    headers: {
      Accept: "application/json",
      // SessionID: userData.SessionID
    },
    method: "GET"
    data
  }
  return XHR(URL, options)
}

function* loginAction({ accessToken }) {
  debugger
  try {
    yield call(loginAPI, accessToken)
    if (resend) {
    } else {
      navigate("nextScreen", {
        something: 'something'
      })
    }
  } catch (e) {
    const { response } = e
    if (!response?.data?.Error) {
      showMessage({
        message: "Failed to resend code, please try again",
        type: "danger"
      })
    }
  } finally {
    yield put(reset())
  }
}

export default all([
  takeLatest(LOGIN_REQUEST, loginAction),
])
