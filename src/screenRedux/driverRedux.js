import {showMessage} from "react-native-flash-message";
import {all, call, put, takeLatest} from "redux-saga/effects"

// config
import {appConfig} from "../config/app"

// utils
import XHR from "../utils/XHR"

//Types
const GET_ASSIGNED_ORDERS_REQUEST = "GET_ASSIGNED_ORDERS_REQUEST"
const GET_ASSIGNED_ORDERS_COMPLETED = "GET_ASSIGNED_ORDERS_COMPLETED"
const PICKUP_ORDER_REQUEST = "PICKUP_ORDER_REQUEST"
const PICKUP_ORDER_COMPLETED = "PICKUP_ORDER_COMPLETED"
const DELIVER_ORDER_REQUEST = "DELIVER_ORDER_REQUEST"
const DELIVER_ORDER_COMPLETED = "DELIVER_ORDER_COMPLETED"
const REQUEST_FAILED = "REQUEST_FAILED"

//Actions
export const getAssignedOrders = (data) => ({
  type: GET_ASSIGNED_ORDERS_REQUEST,
  payload: data,
})

const getAssignedOrdersCompleted = (data) => ({
  type: GET_ASSIGNED_ORDERS_COMPLETED,
  payload: data,
})

export const pickupOrder = (data) => ({
  type: PICKUP_ORDER_REQUEST,
  payload: data,
})

const pickupOrderCompleted = (data) => ({
  type: PICKUP_ORDER_COMPLETED,
  payload: data,
})

export const deliverOrder = (data) => ({
  type: DELIVER_ORDER_REQUEST,
  payload: data,
})

const deliverOrderCompleted = (data) => ({
  type: DELIVER_ORDER_COMPLETED,
  payload: data,
})

const requestFailed = () => ({
  type: REQUEST_FAILED,
})

//Reducers

const initialState = {
  loading: false,
  assignedOrders: [],
  needToRefresh: false,
}

export const driverReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSIGNED_ORDERS_REQUEST:
    case PICKUP_ORDER_REQUEST:
    case DELIVER_ORDER_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_ASSIGNED_ORDERS_COMPLETED:
      return {
        ...state,
        loading: false,
        assignedOrders: action.payload,
        needToRefresh: false,
      }
    case PICKUP_ORDER_COMPLETED:
    case DELIVER_ORDER_COMPLETED:
      return {
        ...state,
        loading: false,
        needToRefresh: true,
      }
    case REQUEST_FAILED:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}

// Saga
async function getAssignedOrdersAPI(data) {
  const URL = `${appConfig.backendServerURL}/orders/?driver=${data.driverId}&status=Driver Assigned,In Transit`
  const options = {
    headers: {
      Accept: "application/json"
    },
    method: "GET"
  }
  return XHR(URL, options)
}

function* getAssignedOrdersAction(data) {
  // console.log('get-assigned-orders-action', data)
  try {
    const resp = yield call(getAssignedOrdersAPI, data.payload)
    if (resp.status === 200) {
      yield put(getAssignedOrdersCompleted(resp?.data))
    } else {
      yield put(requestFailed())
    }
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    showMessage({
      message: response?.data ?? "Something went wrong",
      type: "danger",
    })
  } finally {
  }
}

async function pickupOrderAPI(data) {
  console.log('pickupOrderAPI', data)
  const URL = `${appConfig.backendServerURL}/orders/in_transit/?order=${data.orderId}`
  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "GET",
  }
  return XHR(URL, options)
}

function* pickupOrderAction(data) {
  try {
    const resp = yield call(pickupOrderAPI, data.payload)
    if (resp.status === 200) {
      yield put(pickupOrderCompleted(resp?.data))
      showMessage({
        message: "Order picked up successfully",
        type: "success",
      })
    } else {
      yield put(requestFailed())
    }
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    showMessage({
      message: response?.data ?? "Something went wrong",
      type: "danger",
    })
  } finally {
  }
}

async function deliverOrderAPI(data) {
  console.log('deliverOrderAPI', data)
  const URL = `${appConfig.backendServerURL}/orders/deliver/?order=${data.orderId}`
  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "GET",
  }
  return XHR(URL, options)
}

function* deliverOrderAction(data) {
  try {
    const resp = yield call(deliverOrderAPI, data.payload)
    if (resp.status === 200) {
      yield put(deliverOrderCompleted(resp?.data))
      showMessage({
        message: "Order delivered",
        type: "success",
      })
    } else {
      yield put({type: REQUEST_FAILED})
    }
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail ?? "Something went wrong",
      type: "danger",
    })
  } finally {
  }
}

export default all([
  takeLatest(GET_ASSIGNED_ORDERS_REQUEST, getAssignedOrdersAction),
  takeLatest(PICKUP_ORDER_REQUEST, pickupOrderAction),
  takeLatest(DELIVER_ORDER_REQUEST, deliverOrderAction),
])
