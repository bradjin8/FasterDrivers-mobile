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
const ADD_NEW_DISH_REQUEST_COMPLETED = "ADD_NEW_DISH_REQUEST_COMPLETED"
const UPDATE_DISH_REQUEST_STARTED = "UPDATE_DISH_REQUEST_STARTED"
const UPDATE_DISH_REQUEST_COMPLETED = "UPDATE_DISH_REQUEST_COMPLETED"
const REQUEST_FAILED = "REQUEST_FAILED"
const VIEW_MY_ORDERS_REQUEST_STARTED = "VIEW_MY_ORDERS_REQUEST_STARTED"
const VIEW_MY_ORDERS_REQUEST_COMPLETED = "VIEW_MY_ORDERS_REQUEST_COMPLETED"
const ACCEPT_ORDER_REQUEST_STARTED = "ACCEPT_ORDER_REQUEST_STARTED"
const ACCEPT_ORDER_REQUEST_COMPLETED = "ACCEPT_ORDER_REQUEST_COMPLETED"
const REJECT_ORDER_REQUEST_STARTED = "REJECT_ORDER_REQUEST_STARTED"
const REJECT_ORDER_REQUEST_COMPLETED = "REJECT_ORDER_REQUEST_COMPLETED"
const GET_NEARBY_DRIVERS_REQUEST_STARTED = "GET_NEARBY_DRIVERS_REQUEST_STARTED"
const GET_NEARBY_DRIVERS_REQUEST_COMPLETED = "GET_NEARBY_DRIVERS_REQUEST_COMPLETED"
const ASSIGN_DRIVER_REQUEST_STARTED = "ASSIGN_DRIVER_REQUEST_STARTED"
const ASSIGN_DRIVER_REQUEST_COMPLETED = "ASSIGN_DRIVER_REQUEST_COMPLETED"


const initialState = {
  loading: false,
  dishes: [],
  myOrders: [],
  needToRefreshOrders: false,
  nearbyDrivers: [],
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
export const viewMyOrdersRequest = (data) => ({
  type: VIEW_MY_ORDERS_REQUEST_STARTED,
  payload: data,
})
export const setMyOrdersData = (data) => ({
  type: VIEW_MY_ORDERS_REQUEST_COMPLETED,
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
      }
    case UPDATE_DISH_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case UPDATE_DISH_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
      }
    case VIEW_MY_ORDERS_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case VIEW_MY_ORDERS_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        myOrders: action.payload,
        needToRefreshOrders: false,
      }
    case ACCEPT_ORDER_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case ACCEPT_ORDER_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        needToRefreshOrders: true,
      }
    case REJECT_ORDER_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case REJECT_ORDER_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        needToRefreshOrders: true,
      }
    case GET_NEARBY_DRIVERS_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case GET_NEARBY_DRIVERS_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        nearbyDrivers: action.payload,
      }
    case ASSIGN_DRIVER_REQUEST_STARTED:
      return {
        ...state,
        loading: true
      }
    case ASSIGN_DRIVER_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        needToRefreshOrders: true,
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

export function getDishAPI(id) {
  const URL = `${appConfig.backendServerURL}/dishes/${id}/`
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

function viewMyOrdersAPI(data) {
  // console.log('view-my-orders-api', data)
  const URL = `${appConfig.backendServerURL}/orders/?restaurant=${data?.restaurant}&status=${data?.status || ''}`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
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
      message: response?.data?.detail?.[0] ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* viewMyOrdersAction(data) {
  try {
    const resp = yield call(viewMyOrdersAPI, data.payload)

    if (resp?.data) {
      yield put(setMyOrdersData(resp.data))
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

export const acceptOrderRequest = (data) => ({
  type: ACCEPT_ORDER_REQUEST_STARTED,
  payload: data,
})

export const acceptOrderRequestFinished = (data) => ({
  type: ACCEPT_ORDER_REQUEST_COMPLETED,
  payload: data,
})

export const acceptOrderAPI = (data) => {
  const URL = `${appConfig.backendServerURL}/orders/accept/?order=${data}`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }
  return XHR(URL, options)
}

function* acceptOrderAction(data) {
  try {
    console.log('accept-order-action', data)
    const resp = yield call(acceptOrderAPI, data?.payload)
    if (resp?.data) {
      yield put(acceptOrderRequestFinished(resp.data))
      showMessage({
        message: "Order Accepted Successfully",
        type: "success"
      })
    }
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    console.log('accept-order-action-error', response)
    showMessage({
      message: response?.data?.detail ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}


// Reject order
export const rejectOrderRequest = (data) => ({
  type: REJECT_ORDER_REQUEST_STARTED,
  payload: data,
})

export const rejectOrderRequestFinished = (data) => ({
  type: REJECT_ORDER_REQUEST_COMPLETED,
  payload: data,
})

export const rejectOrderAPI = (data) => {
  const URL = `${appConfig.backendServerURL}/orders/reject/?order=${data}`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }
  return XHR(URL, options)
}

function* rejectOrderAction(data) {
  try {
    const resp = yield call(rejectOrderAPI, data?.payload)
    if (resp?.data) {
      yield put(rejectOrderRequestFinished(resp.data))
      showMessage({
        message: "Order Rejected Successfully",
        type: "success"
      })
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

export const checkStripeStatus = () => {
  const URL = `${appConfig.backendServerURL}/payments/check/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }
  return XHR(URL, options)
}

export const setUpStripeAccount = () => {
  const URL = `${appConfig.backendServerURL}/payments/account/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }
  return XHR(URL, options)
}

export const getNearByDriversRequest = () => ({
  type: GET_NEARBY_DRIVERS_REQUEST_STARTED,
})

const getNearbyDriversFinished = (data) => ({
  type: GET_NEARBY_DRIVERS_REQUEST_COMPLETED,
  payload: data,
})

export const getNearbyDriversAPI = () => {
  const URL = `${appConfig.backendServerURL}/restaurants/nearby_drivers/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }
  return XHR(URL, options)
}

function* getNearbyDriversAction() {
  try {
    const resp = yield call(getNearbyDriversAPI)
    if (resp?.data) {
      yield put(getNearbyDriversFinished(resp.data))
    }
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    showMessage({
      message: response?.data ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

export const assignDriverRequest = (data) => ({
  type: ASSIGN_DRIVER_REQUEST_STARTED,
  payload: data,
})

const assignDriverFinished = (data) => ({
  type: ASSIGN_DRIVER_REQUEST_COMPLETED,
  payload: data,
})

export const assignDriverAPI = (data) => {
  const URL = `${appConfig.backendServerURL}/restaurants/request_driver/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

function* assignDriverAction(data) {
  try {
    console.log('assign-driver', data.payload)
    const resp = yield call(assignDriverAPI, data.payload)
    if (resp?.data) {
      console.log('assign-driver', resp.data)
      yield put(assignDriverFinished(resp.data))
      showMessage({
        message: "Driver Assigned Successfully",
        type: "success"
      })
    }
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    console.log('assign-driver-error', response)
    showMessage({
      message: response?.data ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

export const updateDish = (data) => ({
  type: UPDATE_DISH_REQUEST_STARTED,
  payload: data,
})

const updateDishFinished = (data) => ({
  type: UPDATE_DISH_REQUEST_COMPLETED,
  payload: data,
})

export const updateDishAPI = (data) => {
  console.log('update-dish-api', data)
  const URL = `${appConfig.backendServerURL}/restaurants/dishes/${data.id}/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "PATCH",
    data: data.data
  }
  return XHR(URL, options)
}

function* updateDishAction(data) {
  try {
    const resp = yield call(updateDishAPI, data.payload)
    if (resp?.data) {
      yield put(updateDishFinished(resp.data))
      showMessage({
        message: "Dish Updated Successfully",
        type: "success"
      })
      goBack()
    }
  } catch (e) {
    const {response} = e
    console.log('update-dish-error', response.data)
    yield put(requestFailed())
    showMessage({
      message: response?.data ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

export default all([
  takeLatest(ADD_NEW_DISH_REQUEST_STARTED, addNewDishAction),
  takeLatest(GET_DISHES_REQUEST_STARTED, getDishesAction),
  takeLatest(VIEW_MY_ORDERS_REQUEST_STARTED, viewMyOrdersAction),
  takeLatest(ACCEPT_ORDER_REQUEST_STARTED, acceptOrderAction),
  takeLatest(REJECT_ORDER_REQUEST_STARTED, rejectOrderAction),
  takeLatest(GET_NEARBY_DRIVERS_REQUEST_STARTED, getNearbyDriversAction),
  takeLatest(ASSIGN_DRIVER_REQUEST_STARTED, assignDriverAction),
  takeLatest(UPDATE_DISH_REQUEST_STARTED, updateDishAction),
])
