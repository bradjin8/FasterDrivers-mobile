import {all, call, put, takeLatest} from "redux-saga/effects"
import AsyncStorage from "@react-native-community/async-storage"
import {showMessage} from "react-native-flash-message"

// config
import {appConfig} from "../config/app"

// utils
import XHR from "../utils/XHR"
import {goBack, navigate} from "navigation/NavigationService";
import restaurantDetails from "screens/Customer/Home/RestaurantDetails";
import _ from "lodash";

//Types
const GET_RESTAURANTS_REQUEST_STARTED = "GET_RESTAURANTS_REQUEST_STARTED"
const GET_RESTAURANTS_REQUEST_COMPLETED = "GET_RESTAURANTS_REQUEST_COMPLETED"
const CREATE_NEW_ORDER_REQUEST_STARTED = "CREATE_NEW_ORDER_REQUEST_STARTED"
const CREATE_NEW_ORDER_REQUEST_COMPLETED = "CREATE_NEW_ORDER_REQUEST_COMPLETED"
const GET_MY_ORDERS_REQUEST_STARTED = "GET_MY_ORDERS_REQUEST_STARTED"
const GET_MY_ORDERS_REQUEST_COMPLETED = "GET_MY_ORDERS_REQUEST_COMPLETED"
const UPDATE_ADDRESSES_REQUEST_STARTED = "UPDATE_ADDRESSES_REQUEST_STARTED"
const GET_ADDRESSES_REQUEST_STARTED = "GET_ADDRESSES_REQUEST_STARTED"
const GET_ADDRESSES_REQUEST_COMPLETED = "GET_ADDRESSES_REQUEST_COMPLETED"
const SET_CART_ITEMS = "SET_CART_ITEMS"
const GET_RESTAURANT_DETAILS_REQUEST_STARTED = "GET_RESTAURANT_DETAILS_REQUEST_STARTED"
const GET_RESTAURANT_DETAILS_REQUEST_COMPLETED = "GET_RESTAURANT_DETAILS_REQUEST_COMPLETED"
const REQUEST_FAILED = "REQUEST_FAILED"

const initialState = {
  loading: false,
  locationLoading: false,
  restaurants: null,
  addresses: null,
  carts: [],
  restaurantDetails: null,
  orders: [],
}

//Actions
export const getRestaurantsData = (data) => ({
  type: GET_RESTAURANTS_REQUEST_STARTED,
  payload: data,
})
export const getAddressesData = () => ({
  type: GET_ADDRESSES_REQUEST_STARTED,
})
export const updateAddresses = (id, data) => ({
  type: UPDATE_ADDRESSES_REQUEST_STARTED,
  payload: data,
  id
})
export const setAddressesData = (data) => ({
  type: GET_ADDRESSES_REQUEST_COMPLETED,
  payload: data,
})
export const setUserCartItems = (data) => ({
  type: SET_CART_ITEMS,
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
export const createNewOrder = (data) => ({
  type: CREATE_NEW_ORDER_REQUEST_STARTED,
  payload: data,
})
export const createNewOrderFinished = (data) => ({
  type: CREATE_NEW_ORDER_REQUEST_COMPLETED,
  payload: data,
})
export const getMyOrders = (data) => ({
  type: GET_MY_ORDERS_REQUEST_STARTED,
  payload: data,
})
export const getMyOrdersFinished = (data) => ({
  type: GET_MY_ORDERS_REQUEST_COMPLETED,
  payload: data,
})
export const requestFailed = () => ({
  type: REQUEST_FAILED,
})

//Reducers
export const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RESTAURANTS_REQUEST_STARTED:
      if (action.payload !== null) {
        return {
          ...state
        }
      }
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
    case GET_ADDRESSES_REQUEST_STARTED:
      return {
        ...state,
        locationLoading: true
      }
    case GET_ADDRESSES_REQUEST_COMPLETED:
      return {
        ...state,
        locationLoading: false,
        addresses: action.payload
      }
    case UPDATE_ADDRESSES_REQUEST_STARTED:
      return {
        ...state,
        locationLoading: true
      }
    case SET_CART_ITEMS:
      return {
        ...state,
        carts: action.payload
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
    case CREATE_NEW_ORDER_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      }
    case CREATE_NEW_ORDER_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
      }
    case GET_MY_ORDERS_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      }
    case GET_MY_ORDERS_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        orders: action.payload,
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
  let URL = `${appConfig.backendServerURL}/restaurants/`
  if (data) {
    URL = `${appConfig.backendServerURL}/restaurants/?search=${data} `
  }
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }
  return XHR(URL, options)
}

function getAddressesAPI() {
  const URL = `${appConfig.backendServerURL}/customers/address/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }
  return XHR(URL, options)
}

function updateAddressesAPI(id, data) {
  const URL = `${appConfig.backendServerURL}/customers/address/${id}/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "PATCH",
    data: data
  }
  return XHR(URL, options)
}

function createNewOrderAPI(data) {
  const URL = `${appConfig.backendServerURL}/orders/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

function getMyOrdersAPI(data) {
  const URL = `${appConfig.backendServerURL}/orders/?user=${data}&status=Pending`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
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
    if (resp?.data) {
      yield put(setRestaurantData(resp.data))
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

function* getAddressesAction() {
  try {
    const resp = yield call(getAddressesAPI)
    if (resp?.data) {
      yield put(setAddressesData(resp.data))
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

function* updateAddressesAction(data) {
  try {
    const resp = yield call(updateAddressesAPI, data.id, data.payload)
    if (resp?.data) {
      yield put(getAddressesData())
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

function* createNewOrderAction(data) {
  try {
    const resp = yield call(createNewOrderAPI, data.payload)
    debugger
    if (resp?.data) {
      yield put(createNewOrderFinished(resp.data))
    }
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    debugger
    showMessage({
      message: response?.data?.detail ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* getMyOrdersAction(data) {
  try {
    const resp = yield call(getMyOrdersAPI, data.payload)
    debugger
    if (resp?.data) {
      yield put(getMyOrdersFinished(resp.data))
    }
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    debugger
    showMessage({
      message: response?.data?.detail ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* getRestaurantDetailsAction(data) {
  try {
    const resp = yield call(getRestaurantDetailsAPI, data.payload)
    if (resp?.data) {
      yield put(setRestaurantDetails(resp.data))
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

export default all([
  takeLatest(GET_RESTAURANT_DETAILS_REQUEST_STARTED, getRestaurantDetailsAction),
  takeLatest(GET_RESTAURANTS_REQUEST_STARTED, getRestaurantsAction),
  takeLatest(GET_ADDRESSES_REQUEST_STARTED, getAddressesAction),
  takeLatest(UPDATE_ADDRESSES_REQUEST_STARTED, updateAddressesAction),
  takeLatest(CREATE_NEW_ORDER_REQUEST_STARTED, createNewOrderAction),
  takeLatest(GET_MY_ORDERS_REQUEST_STARTED, getMyOrdersAction),
])
