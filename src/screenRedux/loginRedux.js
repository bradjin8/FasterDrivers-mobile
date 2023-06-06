import {all, call, put, takeLatest} from "redux-saga/effects"
import AsyncStorage from "@react-native-community/async-storage"
import {showMessage} from "react-native-flash-message"

// config
import {appConfig} from "../config/app"

// utils
import XHR from "../utils/XHR"
import {goBack, navigate} from "navigation/NavigationService";

//Types
const LOGIN_REQUEST_STARTED = "LOGIN_REQUEST_STARTED"
const LOGIN_REQUEST_COMPLETED = "LOGIN_REQUEST_COMPLETED"
const SIGNUP_REQUEST_STARTED = "SIGNUP_REQUEST_STARTED"
const SIGNUP_REQUEST_COMPLETED = "SIGNUP_REQUEST_COMPLETED"
const UPDATE_ACCOUNT_REQUEST_STARTED = "UPDATE_ACCOUNT_REQUEST_STARTED"
const UPDATE_ACCOUNT_REQUEST_COMPLETED = "UPDATE_ACCOUNT_REQUEST_COMPLETED"
const CHANGE_PASSWORD_REQUEST_STARTED = "CHANGE_PASSWORD_REQUEST_STARTED"
const CHANGE_PASSWORD_REQUEST_COMPLETED = "CHANGE_PASSWORD_REQUEST_COMPLETED"
const LOGOUT_REQUEST_STARTED = "LOGOUT_REQUEST_STARTED"
const REQUEST_FAILED = "REQUEST_FAILED"
const FORGOT_PASSWORD_REQUEST_STARTED = "FORGOT_PASSWORD_REQUEST_STARTED"
const FORGOT_PASSWORD_REQUEST_COMPLETED = "FORGOT_PASSWORD_REQUEST_COMPLETED"

const initialState = {
  loading: false,
  accessToken: null,
  user: null,
}

//Actions
export const loginRequest = (data) => ({
  type: LOGIN_REQUEST_STARTED,
  payload: data,
})
export const setSignInData = (data) => ({
  type: LOGIN_REQUEST_COMPLETED,
  payload: data,
})
export const signUpRequestStarted = (data) => ({
  type: SIGNUP_REQUEST_STARTED,
  payload: data,
})
export const setSignUpData = (data) => ({
  type: SIGNUP_REQUEST_COMPLETED,
  payload: data,
})
export const updateAccount = (data) => ({
  type: UPDATE_ACCOUNT_REQUEST_STARTED,
  payload: data,
})
export const updateAccountCompleted = (data) => ({
  type: UPDATE_ACCOUNT_REQUEST_COMPLETED,
  payload: data,
})
export const changePassword = (data) => ({
  type: CHANGE_PASSWORD_REQUEST_STARTED,
  payload: data,
})
export const changePasswordCompleted = () => ({
  type: CHANGE_PASSWORD_REQUEST_COMPLETED,
})
export const logoutRequest = (data) => ({
  type: LOGOUT_REQUEST_STARTED,
})
export const requestFailed = () => ({
  type: REQUEST_FAILED,
})

export const forgotPasswordRequest = (data) => ({
  type: FORGOT_PASSWORD_REQUEST_STARTED,
  payload: data,
})
export const forgotPasswordRequestCompleted = () => ({
  type: FORGOT_PASSWORD_REQUEST_COMPLETED,
})

//Reducers
export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case LOGIN_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        accessToken: action.payload.token,
        user: action.payload.user
      }
    case SIGNUP_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case SIGNUP_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        accessToken: action.payload.token,
        user: action.payload.user
      }
    case UPDATE_ACCOUNT_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case UPDATE_ACCOUNT_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        user: action.payload
      }
    case CHANGE_PASSWORD_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      }
    case CHANGE_PASSWORD_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
      }
    case REQUEST_FAILED:
      return {
        ...state,
        loading: false,
      }
    case LOGOUT_REQUEST_STARTED:
      AsyncStorage.clear()
      return {
        ...state,
        user: null,
        accessToken: null
      }
    case FORGOT_PASSWORD_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case FORGOT_PASSWORD_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}

//PhoneNumberSaga
function loginAPI(data) {
  const URL = `${appConfig.backendServerURL}/users/login/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

function signUpAPI(data) {
  const URL = `${appConfig.backendServerURL}/users/`
  const options = {
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

async function accountUpdateAPI(data) {
  const userAccount = await AsyncStorage.getItem("userAccount")
  const userData = JSON.parse(userAccount)
  const URL = `${appConfig.backendServerURL}/users/${userData.id}/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "PATCH",
    data: data
  }
  return XHR(URL, options)
}

export function forgotPasswordAPI(data) {
  const URL = `${appConfig.backendServerURL}/users/reset/`
  console.log("data", data)
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

async function changePasswordAPI(data) {
  const userAccount = await AsyncStorage.getItem("userAccount")
  const userData = JSON.parse(userAccount)
  const URL = `${appConfig.backendServerURL}/users/change_password/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

function* loginAction(data) {
  try {
    const resp = yield call(loginAPI, data.payload)
    if (resp?.data) {
      yield put(setSignInData(resp.data))
      AsyncStorage.setItem("userAccount", JSON.stringify(resp.data.user))
      AsyncStorage.setItem("token", resp.data.token)
      showMessage({
        message: "Successfully user login",
        type: "success"
      })
      if (resp?.data.user.type === "Restaurant") {
        navigate('RestaurantBottomBar')
      } else if (resp?.data.user.type === "Driver") {
        navigate('DriverBottomBar')
      } else {
        navigate('CustomerBottomBar')
      }
    }
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail[0] ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* signUpAction(data) {
  try {
    const resp = yield call(signUpAPI, data.payload)
    if (resp?.data) {
      yield put(setSignUpData(resp.data))
      AsyncStorage.setItem("userAccount", JSON.stringify(resp.data.user))
      AsyncStorage.setItem("token", resp.data.token)
      showMessage({
        message: "Successfully user has been created",
        type: "success"
      })
      if (resp?.data.user.type === "Restaurant") {
        navigate('RestaurantBottomBar', {
          screen: 'Settings',
          params: {
            screen: 'AccountInformation',
          }
        })
      } else if (resp?.data.user.type === "Driver") {
        navigate('DriverBottomBar', {
          screen: 'Settings',
          params: {
            screen: 'AccountInformation',
          }
        })
      } else {
        navigate('CustomerBottomBar', {
          screen: 'Settings',
          params: {
            screen: 'AccountInformation',
          }
        })
      }
    }
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    const error = response?.data?.email?.[0] || response?.data?.password?.[0]
    showMessage({
      message: error ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* accountUpdateAction(data) {
  try {
    const resp = yield call(accountUpdateAPI, data.payload)
    if (resp?.data) {
      AsyncStorage.setItem("userAccount", JSON.stringify(resp.data))
      yield put(updateAccountCompleted(resp.data))
      goBack()
      showMessage({
        message: "Successfully details updated",
        type: "success"
      })
    }
  } catch (e) {
    const {response} = e
    console.log("update-profile", response.data)
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* changePasswordAction(data) {
  try {
    const resp = yield call(changePasswordAPI, data.payload)
    if (resp?.data) {
      yield put(changePasswordCompleted())
      goBack()
      showMessage({
        message: "Password Updated Successfully",
        type: "success"
      })
    }
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* forgotPasswordAction(data) {
  try {
    const resp = yield call(forgotPasswordAPI, data.payload)
    yield put(forgotPasswordRequestCompleted())
    showMessage({
      message: "Requested reset password Successfully",
      type: "success"
    })
    goBack()
  } catch (e) {
    const {response} = e
    console.log('forgot-password', response)
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

export default all([
  takeLatest(LOGIN_REQUEST_STARTED, loginAction),
  takeLatest(SIGNUP_REQUEST_STARTED, signUpAction),
  takeLatest(UPDATE_ACCOUNT_REQUEST_STARTED, accountUpdateAction),
  takeLatest(CHANGE_PASSWORD_REQUEST_STARTED, changePasswordAction),
  takeLatest(FORGOT_PASSWORD_REQUEST_STARTED, forgotPasswordAction),
])
