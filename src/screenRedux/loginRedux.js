import {all, call, put, takeLatest} from "redux-saga/effects"
import AsyncStorage from "@react-native-community/async-storage"
import {showMessage} from "react-native-flash-message"

// config
import {appConfig, BASE_URL} from "../config/app"

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
const REQUEST_COMPLETED = "REQUEST_COMPLETED"
const FORGOT_PASSWORD_REQUEST_STARTED = "FORGOT_PASSWORD_REQUEST_STARTED"
const FORGOT_PASSWORD_REQUEST_COMPLETED = "FORGOT_PASSWORD_REQUEST_COMPLETED"
const LOGIN_WITH_FACEBOOK_REQUEST_STARTED = "LOGIN_WITH_FACEBOOK_REQUEST_STARTED"
const LOGIN_WITH_GOOGLE_REQUEST_STARTED = "LOGIN_WITH_GOOGLE_REQUEST_STARTED"
const LOGIN_WITH_APPLE_REQUEST_STARTED = "LOGIN_WITH_APPLE_REQUEST_STARTED"
const DELETE_ACCOUNT_REQUEST_STARTED = "DELETE_ACCOUNT_REQUEST_STARTED"
const SEND_FEEDBACK_REQUEST_STARTED = "SEND_FEEDBACK_REQUEST_STARTED"
const SUBSCRIBE_REQUEST_STARTED = "SUBSCRIBE_REQUEST_STARTED"
const CHANGE_SUBSCRIPTION_REQUEST_STARTED = "CHANGE_SUBSCRIPTION_REQUEST_STARTED"
const UNSUBSCRIBE_REQUEST_STARTED = "UNSUBSCRIBE_REQUEST_STARTED"
const UNSUBSCRIBE_REQUEST_COMPLETED = "UNSUBSCRIBE_REQUEST_COMPLETED"
const SUBSCRIPTION_UPDATED = "SUBSCRIPTION_UPDATED"
const FETCH_PROFILE_REQUEST_STARTED = "FETCH_PROFILE_REQUEST_STARTED"
const FETCH_PROFILE_REQUEST_COMPLETED = "FETCH_PROFILE_REQUEST_COMPLETED"

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

export const loginWithFacebook = (data) => ({
  type: LOGIN_WITH_FACEBOOK_REQUEST_STARTED,
  payload: data,
})

export const loginWithGoogle = (data) => ({
  type: LOGIN_WITH_GOOGLE_REQUEST_STARTED,
  payload: data,
})

export const loginWithApple = (data) => ({
  type: LOGIN_WITH_APPLE_REQUEST_STARTED,
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
export const logoutRequest = () => ({
  type: LOGOUT_REQUEST_STARTED,
})
export const requestFailed = () => ({
  type: REQUEST_FAILED,
})

export const requestCompleted = () => ({
  type: REQUEST_COMPLETED,
})

export const forgotPasswordRequest = (data) => ({
  type: FORGOT_PASSWORD_REQUEST_STARTED,
  payload: data,
})
export const forgotPasswordRequestCompleted = () => ({
  type: FORGOT_PASSWORD_REQUEST_COMPLETED,
})

export const deleteAccountRequest = (data) => ({
  type: DELETE_ACCOUNT_REQUEST_STARTED,
  payload: data,
})

export const sendFeedbackRequest = (data) => ({
  type: SEND_FEEDBACK_REQUEST_STARTED,
  payload: data,
})

export const subscribeRequest = (data) => ({
  type: SUBSCRIBE_REQUEST_STARTED,
  payload: data,
})

export const changeSubscriptionRequest = (data) => ({
  type: CHANGE_SUBSCRIPTION_REQUEST_STARTED,
  payload: data,
})

export const subscriptionUpdated = (data) => ({
  type: SUBSCRIPTION_UPDATED,
  payload: data,
})

export const unsubscribeRequest = (data) => ({
  type: UNSUBSCRIBE_REQUEST_STARTED,
  payload: data,
})

export const unsubscribeRequestCompleted = () => ({
  type: UNSUBSCRIBE_REQUEST_COMPLETED,
})

export const fetchProfileRequest = () => ({
  type: FETCH_PROFILE_REQUEST_STARTED,
})

export const fetchProfileRequestCompleted = (data) => ({
  type: FETCH_PROFILE_REQUEST_COMPLETED,
  payload: data,
})

//Reducers
export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST_STARTED:
    case SIGNUP_REQUEST_STARTED:
    case LOGIN_WITH_FACEBOOK_REQUEST_STARTED:
    case LOGIN_WITH_GOOGLE_REQUEST_STARTED:
    case LOGIN_WITH_APPLE_REQUEST_STARTED:
    case UPDATE_ACCOUNT_REQUEST_STARTED:
    case DELETE_ACCOUNT_REQUEST_STARTED:
    case SEND_FEEDBACK_REQUEST_STARTED:
    case CHANGE_PASSWORD_REQUEST_STARTED:
    case FORGOT_PASSWORD_REQUEST_STARTED:
    case SUBSCRIBE_REQUEST_STARTED:
    case UNSUBSCRIBE_REQUEST_STARTED:
    case CHANGE_SUBSCRIPTION_REQUEST_STARTED:
    case FETCH_PROFILE_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case FETCH_PROFILE_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        user: action.payload
      }
    case LOGIN_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        accessToken: action.payload.token,
        user: action.payload.user
      }
    case SIGNUP_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        accessToken: action.payload.token,
        user: action.payload.user
      }
    case UPDATE_ACCOUNT_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        user: action.payload
      }
    case CHANGE_PASSWORD_REQUEST_COMPLETED:
    case FORGOT_PASSWORD_REQUEST_COMPLETED:
    case REQUEST_COMPLETED:
    case REQUEST_FAILED:
      return {
        ...state,
        loading: false,
      }
    case UNSUBSCRIBE_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          [state.user.type.toLowerCase()]: {
            ...state.user[state.user.type.toLowerCase()],
            subscription: null
          }
        }
      }
    case SUBSCRIPTION_UPDATED:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          [state.user.type.toLowerCase()]: {
            ...state.user[state.user.type.toLowerCase()],
            subscription: action.payload
          }
        }
      }
    case LOGOUT_REQUEST_STARTED:
      AsyncStorage.clear()
      return {
        ...state,
        user: null,
        accessToken: null
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

function loginWithFacebookAPI(data) {
  const URL = `${BASE_URL}/socials/facebook/login/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

function loginWithGoogleAPI(data) {
  const URL = `${BASE_URL}/socials/google/login/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

function loginWithAppleAPI(data) {
  const URL = `${BASE_URL}/socials/apple/login/`
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

export async function getProfileAPI() {
  const userAccount = await AsyncStorage.getItem("userAccount")
  const userData = JSON.parse(userAccount)
  const URL = `${appConfig.backendServerURL}/users/${userData.id}/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
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

async function deleteAccountAPI(data) {
  const URL = `${appConfig.backendServerURL}/users/${data}/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "DELETE",
  }
  return XHR(URL, options)
}

async function sendFeedbackAPI(data) {
  const URL = `${appConfig.backendServerURL}/admin/feedback/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

export async function fetchSubscriptionsAPI() {
  const URL = `${appConfig.backendServerURL}/subscriptions/plans/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }
  return XHR(URL, options)
}

export async function subscribeAPI(data) {
  // console.log("subscribe-data", data)
  const URL = `${appConfig.backendServerURL}/subscriptions/subscribe/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

export async function unsubscribeAPI() {
  const URL = `${appConfig.backendServerURL}/subscriptions/unsubscribe/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET"
  }
  return XHR(URL, options)
}

export async function changeSubscriptionAPI(data) {
  const URL = `${appConfig.backendServerURL}/subscriptions/change_subscription/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "PATCH",
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

function* loginWithGoogleAction(data) {
  try {
    const resp = yield call(loginWithGoogleAPI, data.payload)
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
      message: response?.data?.detail?.[0] ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* loginWithAppleAction(data) {
  try {
    const resp = yield call(loginWithAppleAPI, data.payload)
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
    console.log(response.data)
    showMessage({
      message: response?.data?.non_field_errors?.[0] ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* loginWithFacebookAction(data) {
  try {
    const resp = yield call(loginWithFacebookAPI, data.payload)
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
      message: response?.data?.detail?.[0] ?? "Something went wrong, Please try again!",
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
            screen: 'StripeConnect',
          }
        })
      } else if (resp?.data.user.type === "Driver") {
        navigate('DriverBottomBar', {
          screen: 'Settings',
          params: {
            screen: 'StripeConnect',
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

function* getProfileAction () {
  try {
    const resp = yield call(getProfileAPI)
    if (resp?.data) {
      yield put(fetchProfileRequestCompleted(resp.data))
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

function* deleteAccountAction(data) {
  try {
    const resp = yield call(deleteAccountAPI, data.payload)
    yield put(logoutRequest())
    showMessage({
      message: "Account Deleted",
      type: "success"
    })
  } catch (e) {
    const {response} = e
    console.log('delete-account', response)
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail?.[0] ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* sendFeedbackAction(data) {
  try {
    const resp = yield call(sendFeedbackAPI, data.payload)
    yield put(requestCompleted())
    showMessage({
      message: "Feedback sent Successfully",
      type: "success"
    })
    goBack()
  } catch (e) {
    const {response} = e
    console.log('send-feedback', response)
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* subscribeAction(data) {
  try {
    const resp = yield call(subscribeAPI, data.payload)
    yield put(fetchProfileRequest())
    showMessage({
      message: "Subscribed Successfully",
      type: "success"
    })
    goBack()
  } catch (e) {
    const {response} = e
    console.log('subscribe', response)
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* changeSubscriptionAction(data) {
  try {
    const resp = yield call(changeSubscriptionAPI, data.payload)
    yield put(fetchProfileRequest())
    showMessage({
      message: "Subscription Changed Successfully",
      type: "success"
    })
    goBack()
  } catch (e) {
    const {response} = e
    console.log('change-subscription', response)
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* unsubscribeAction() {
  try {
    const resp = yield call(unsubscribeAPI)
    yield put(fetchProfileRequest())
    showMessage({
      message: "Unsubscribed Successfully",
      type: "success"
    })
    goBack()
  } catch (e) {
    const {response} = e
    console.log('unsubscribe', response)
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
  takeLatest(LOGIN_WITH_FACEBOOK_REQUEST_STARTED, loginWithFacebookAction),
  takeLatest(LOGIN_WITH_GOOGLE_REQUEST_STARTED, loginWithGoogleAction),
  takeLatest(LOGIN_WITH_APPLE_REQUEST_STARTED, loginWithAppleAction),
  takeLatest(DELETE_ACCOUNT_REQUEST_STARTED, deleteAccountAction),
  takeLatest(SEND_FEEDBACK_REQUEST_STARTED, sendFeedbackAction),
  takeLatest(SUBSCRIBE_REQUEST_STARTED, subscribeAction),
  takeLatest(CHANGE_SUBSCRIPTION_REQUEST_STARTED, changeSubscriptionAction),
  takeLatest(UNSUBSCRIBE_REQUEST_STARTED, unsubscribeAction),
  takeLatest(FETCH_PROFILE_REQUEST_STARTED, getProfileAction),
])
