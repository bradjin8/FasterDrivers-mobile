import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-community/async-storage"
import { showMessage } from "react-native-flash-message"

// config
import { appConfig } from "../config/app"

// utils
import XHR from "../utils/XHR"
import { goBack, navigate } from "navigation/NavigationService";

//Types
const GET_RESTAURANTS_REQUEST_STARTED = "GET_RESTAURANTS_REQUEST_STARTED"
const GET_RESTAURANTS_REQUEST_COMPLETED = "GET_RESTAURANTS_REQUEST_COMPLETED"
const REQUEST_FAILED = "REQUEST_FAILED"

const initialState = {
  loading: false,
  restaurants: null
}

//Actions
export const getRestaurantsData = (data) => ({
  type: GET_RESTAURANTS_REQUEST_STARTED,
  payload: data,
})
export const setRestaurantData = (data) => ({
  type: GET_RESTAURANTS_REQUEST_COMPLETED,
  payload: data,
})

export const requestFailed = () => ({
  type: REQUEST_FAILED,
})

//Reducers
export const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RESTAURANTS_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case GET_RESTAURANTS_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        restaurants: action.payload
      }
    case REQUEST_FAILED:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}

//PhoneNumberSaga
function getRestaurantAPI(data) {
  const URL = `${appConfig.backendServerURL}/restaurants/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
    data: data
  }
  return XHR(URL, options)
}

function* getRestaurantsAction(data) {
  try {
   const resp = yield call(getRestaurantAPI, data.payload)
    if(resp?.data) {
      yield put(setRestaurantData(resp.data))
     /* showMessage({
        message: "Successfully New dish added",
        type: "success"
      })*/
    }
  } catch (e) {
    const { response } = e
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail[0] ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

export default all([
  takeLatest(GET_RESTAURANTS_REQUEST_STARTED, getRestaurantsAction),
])
