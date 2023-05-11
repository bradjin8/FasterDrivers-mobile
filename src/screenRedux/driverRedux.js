import {showMessage} from "react-native-flash-message";
import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-community/async-storage"

// config
import { appConfig } from "../config/app"

// utils
import XHR from "../utils/XHR"

//Types
const GET_ASSIGNED_ORDERS_REQUEST = "GET_ASSIGNED_ORDERS_REQUEST"
const GET_ASSIGNED_ORDERS_COMPLETED = "GET_ASSIGNED_ORDERS_COMPLETED"
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

const requestFailed = () => ({
  type: REQUEST_FAILED,
})

//Reducers

const initialState = {
  loading: false,
  assignedOrders: [],
}

export const driverReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSIGNED_ORDERS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_ASSIGNED_ORDERS_COMPLETED:
      return {
        ...state,
        loading: false,
        assignedOrders: action.payload
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
async function getAssignedOrdersAPI({driverId}) {
  const URL = `${appConfig.backendServerURL}/orders/?driver=${driverId}&status=Driver Assigned`
  const options = {
    headers: {
      Accept: "application/json"
    },
    method: "GET"
  }
  return XHR(URL, options)
}

function* getAssignedOrdersAction({payload}) {
  try {
    const resp = yield call(getAssignedOrdersAPI, payload)
    if (resp.status === 200) {
      yield put(getAssignedOrdersCompleted(resp?.data))
    } else {
      yield put({ type: REQUEST_FAILED })
    }
  } catch (e) {
    const { response } = e
    yield put(requestFailed())
    showMessage({
      message: response?.data ?? "Something went wrong",
      type: "danger",
    })
  } finally {
  }
}

export default all([
  takeLatest(GET_ASSIGNED_ORDERS_REQUEST, getAssignedOrdersAction)
])
