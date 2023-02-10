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
const GET_RESTAURANT_DETAILS_REQUEST_STARTED = "GET_RESTAURANT_DETAILS_REQUEST_STARTED"
const GET_RESTAURANT_DETAILS_REQUEST_COMPLETED = "GET_RESTAURANT_DETAILS_REQUEST_COMPLETED"
const REQUEST_FAILED = "REQUEST_FAILED"

const initialState = {
  loading: false,
  restaurants: null,
  restaurantDetails: null
}

//Actions
export const getRestaurantsData = (data) => ({
  type: GET_RESTAURANTS_REQUEST_STARTED,
  payload: data,
})
export const getRestaurantDetails = (data) => ({
  type: GET_RESTAURANT_DETAILS_REQUEST_STARTED,
  payload: data,
})
export const setRestaurantData = (data) => ({
  type: GET_RESTAURANTS_REQUEST_COMPLETED,
  payload: data,
})
export const setRestaurantDetails = (data) => ({
  type: GET_RESTAURANT_DETAILS_REQUEST_COMPLETED,
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
    case GET_RESTAURANT_DETAILS_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      }
    case GET_RESTAURANT_DETAILS_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        restaurantDetails: action.payload
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

function getRestaurantDetailsAPI(data) {
  const URL = `${appConfig.backendServerURL}/restaurants/${data}/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }
  return XHR(URL, options)
}

function* getRestaurantsAction(data) {
  try {
   const resp = yield call(getRestaurantAPI, data.payload)
    if(resp?.data) {
      yield put(setRestaurantData(resp.data))
    }
  } catch (e) {
    const { response } = e
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* getRestaurantDetailsAction(data) {
  try {
    debugger
   const resp = yield call(getRestaurantDetailsAPI, data.payload)
    if(resp?.data) {
      yield put(setRestaurantDetails(resp.data))
    }
  } catch (e) {
    const { response } = e
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

export default all([
  takeLatest(GET_RESTAURANT_DETAILS_REQUEST_STARTED, getRestaurantDetailsAction),
  takeLatest(GET_RESTAURANTS_REQUEST_STARTED, getRestaurantsAction),
])
