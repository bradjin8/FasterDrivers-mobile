import {all, call, put, takeLatest} from "redux-saga/effects"
import AsyncStorage from "@react-native-community/async-storage"
import {showMessage} from "react-native-flash-message"

// config
import {appConfig} from "../config/app"

// utils
import XHR from "../utils/XHR"
import {goBack, navigate} from "navigation/NavigationService";

//Types
const GET_DISHES_REQUEST_STARTED = "GET_DISHES_REQUEST_STARTED"
const GET_DISHES_REQUEST_COMPLETED = "GET_DISHES_REQUEST_COMPLETED"
const ADD_NEW_DISH_REQUEST_STARTED = "ADD_NEW_DISH_REQUEST_STARTED"
const ADD_NEW_DISH_REQUEST_COMPLETED = "ADD_NEW_DISH_REQUEST_STARTED"
const REQUEST_FAILED = "REQUEST_FAILED"

const initialState = {
  loading: false,
  dishes: []
}

//Actions
export const getDishesRequest = () => ({
  type: GET_DISHES_REQUEST_STARTED,
})
export const setDishesData = (data) => ({
  type: GET_DISHES_REQUEST_COMPLETED,
  payload: data,
})
export const addNewDishRequest = (data) => ({
  type: ADD_NEW_DISH_REQUEST_STARTED,
  payload: data,
})
export const setDishData = (data) => ({
  type: ADD_NEW_DISH_REQUEST_COMPLETED,
  payload: data,
})

export const requestFailed = () => ({
  type: REQUEST_FAILED,
})

//Reducers
export const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DISHES_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      }
    case GET_DISHES_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        dishes: action.payload,
      }
    case ADD_NEW_DISH_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case ADD_NEW_DISH_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        dishes: [...state.dishes, action.payload],
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

function getDishesAPI() {
  const URL = `${appConfig.backendServerURL}/dishes/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }
  return XHR(URL, options)
}

function addNewDishAPI(data) {
  const URL = `${appConfig.backendServerURL}/dishes/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

function* getDishesAction() {
  try {
    const resp = yield call(getDishesAPI)
    if (resp?.data) {
      yield put(setDishesData(resp.data))
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

function* addNewDishAction(data) {
  try {
    const resp = yield call(addNewDishAPI, data.payload)
    if (resp?.data) {
      yield put(setDishData(resp.data))
      showMessage({
        message: "Successfully New dish added",
        type: "success"
      })
      goBack();
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

export default all([
  takeLatest(ADD_NEW_DISH_REQUEST_STARTED, addNewDishAction),
  takeLatest(GET_DISHES_REQUEST_STARTED, getDishesAction),
])
