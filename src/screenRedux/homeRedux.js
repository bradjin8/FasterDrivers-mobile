import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-community/async-storage"
// import {showMessage} from 'react-native-flash-message';

// config
import { appConfig } from "../config/app"

// utils
import XHR from "../utils/XHR"

//Types
const HOME_FEED = "SCREEN/HOME_FEED"
//Actions
export const homeFeedRequest = () => ({
  type: HOME_FEED
})

//Reducers

const initialState = {
  homeFeedData: false,
}

export const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case HOME_FEED:
      return {
        ...state,
        requesting: true
      }
    default:
      return state
  }
}

// Saga
async function homeFeedAPi() {
  const URL = `${appConfig.backendServerURL}/api/`
  const options = {
    headers: {
      Accept: "application/json"
    },
    method: "GET"
  }
  return XHR(URL, options)
}

function* homeFeedData() {
  try {
    const response = yield call(homeFeedAPi)
    // yield put(homeFeedSuccess(response.data))
  } catch (e) {
    const { response } = e
    yield put(
      // homeFeedSuccess(response === undefined ? "false" : response?.data)
    )
  } finally {
  }
}

export default all([
  takeLatest(HOME_FEED, homeFeedData)
])
