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
const GET_PAYMENTS_REQUEST_STARTED = "GET_PAYMENTS_REQUEST_STARTED"
const GET_PAYMENTS_REQUEST_COMPLETED = "GET_PAYMENTS_REQUEST_COMPLETED"
const ADD_PAYMENT_REQUEST_STARTED = "ADD_PAYMENT_REQUEST_STARTED"
const ADD_PAYMENT_REQUEST_COMPLETED = "ADD_PAYMENT_REQUEST_COMPLETED"
const DELETE_PAYMENT_REQUEST_STARTED = "DELETE_PAYMENT_REQUEST_STARTED"
const DELETE_PAYMENT_REQUEST_COMPLETED = "DELETE_PAYMENT_REQUEST_COMPLETED"
const PAY_ORDER_REQUEST_STARTED = "PAY_ORDER_REQUEST_STARTED"
const PAY_ORDER_REQUEST_COMPLETED = "PAY_ORDER_REQUEST_COMPLETED"
const GENERATE_TEST_PAYMENT_REQUEST_STARTED = "GENERATE_TEST_PAYMENT_REQUEST_STARTED"
const GENERATE_TEST_PAYMENT_REQUEST_COMPLETED = "GENERATE_TEST_PAYMENT_REQUEST_COMPLETED"
const UPDATE_CUSTOMER_REQUEST_STARTED = "UPDATE_CUSTOMER_REQUEST_STARTED"
const UPDATE_CUSTOMER_REQUEST_COMPLETED = "UPDATE_CUSTOMER_REQUEST_COMPLETED"
const REQUEST_FAILED = "REQUEST_FAILED"

const initialState = {
  loading: false,
  locationLoading: false,
  restaurants: null,
  addresses: null,
  carts: [],
  restaurantDetails: null,
  orders: [],
  payments: [],
  testPayment: null,
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
export const getPaymentsRequest = (data) => ({
  type: GET_PAYMENTS_REQUEST_STARTED,
  payload: data,
})
export const getPaymentsRequestFinished = (data) => ({
  type: GET_PAYMENTS_REQUEST_COMPLETED,
  payload: data,
})
export const addPaymentRequest = (data) => ({
  type: ADD_PAYMENT_REQUEST_STARTED,
  payload: data,
})
export const addPaymentRequestFinished = (data) => ({
  type: ADD_PAYMENT_REQUEST_COMPLETED,
  payload: data,
})
export const deletePaymentRequest = (data) => ({
  type: DELETE_PAYMENT_REQUEST_STARTED,
  payload: data,
})
export const deletePaymentRequestFinished = (data) => ({
  type: DELETE_PAYMENT_REQUEST_COMPLETED,
  payload: data,
})
export const payOrderRequest = (data) => ({
  type: PAY_ORDER_REQUEST_STARTED,
  payload: data,
})
export const payOrderRequestFinished = (data) => ({
  type: PAY_ORDER_REQUEST_COMPLETED,
  payload: data,
})
export const generateTestPaymentRequest = (data) => ({
  type: GENERATE_TEST_PAYMENT_REQUEST_STARTED,
  payload: data,
})
export const generateTestPaymentRequestFinished = (data) => ({
  type: GENERATE_TEST_PAYMENT_REQUEST_COMPLETED,
  payload: data,
})

export const updateCustomerRequest = (data) => ({
  type: UPDATE_CUSTOMER_REQUEST_STARTED,
  payload: data,
})
export const updateCustomerRequestFinished = (data) => ({
  type: UPDATE_CUSTOMER_REQUEST_COMPLETED,
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
    case GET_PAYMENTS_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      }
    case GET_PAYMENTS_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        payments: action.payload.data,
      }
    case ADD_PAYMENT_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      }
    case ADD_PAYMENT_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
      }
    case DELETE_PAYMENT_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      }
    case DELETE_PAYMENT_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
      }
    case PAY_ORDER_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      }
    case PAY_ORDER_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
      }
    case GENERATE_TEST_PAYMENT_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      }
    case GENERATE_TEST_PAYMENT_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
        testPayment: action.payload,
      }
    case UPDATE_CUSTOMER_REQUEST_STARTED:
      return {
        ...state,
        loading: true,
      }
    case UPDATE_CUSTOMER_REQUEST_COMPLETED:
      return {
        ...state,
        loading: false,
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

export function createNewOrderAPI(data) {
  console.log('create-new-order-api', data)
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
  const URL = `${appConfig.backendServerURL}/orders/?user=${data.user}&status=${data.status?.join(',')}`
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

export function getDishById(id) {
  const URL = `${appConfig.backendServerURL}/dishes/${id}/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }
  return XHR(URL, options)
}

function getPaymentsAPI() {
  const URL = `${appConfig.backendServerURL}/payments/my_cards/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }
  return XHR(URL, options)
}

function addPaymentAPI(data) {
  console.log('add-payment-api', data)
  const URL = `${appConfig.backendServerURL}/payments/add_payment_method/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

function deletePaymentAPI(data) {
  const URL = `${appConfig.backendServerURL}/payments/revoke_payment_method/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

export function payOrderAPI(data) {
  console.log('pay-order-api', data)
  const URL = `${appConfig.backendServerURL}/payments/process/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    data: data
  }
  return XHR(URL, options)
}

export function updateCustomerAPI(data) {
  console.log('update-customer-api', data)
  const URL = `${appConfig.backendServerURL}/users/${data}/`
  const options = {
    headers: {
      Accept: "application/json",
    },
    method: "PATCH",
    data: data
  }
  return XHR(URL, options)
}

function* updateCustomerAction(data) {
  try {
    const resp = yield call(updateCustomerAPI, data.payload)
    if (resp?.data) {
      yield put(updateCustomerRequestFinished(resp.data))
      showMessage({
        message: "Profile updated successfully!",
        type: "success"
      })
      goBack()
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
    navigate("Orders")
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    debugger
    showMessage({
      message: response?.data?.detail?.[0] ?? response?.data ?? "Something went wrong, Please try again!",
      type: "danger"
    })
    navigate("Orders")
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
    showMessage({
      message: response?.data?.detail?.[0] ?? response?.data ?? "Something went wrong, Please try again!",
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
      message: response?.data?.detail?.[0] ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* getPaymentsAction() {
  try {
    const resp = yield call(getPaymentsAPI)
    if (resp?.data) {
      yield put(getPaymentsRequestFinished(resp.data))
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

function* addPaymentAction(data) {
  try {
    const resp = yield call(addPaymentAPI, data.payload)
    if (resp?.data) {
      yield put(addPaymentRequestFinished(resp.data))
    }
    goBack();
  } catch (e) {
    const {response} = e
    console.log('add-payment-api-res', response)
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail?.[0] ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* deletePaymentAction(data) {
  try {
    const resp = yield call(deletePaymentAPI, data.payload)
    if (resp?.data) {
      yield put(deletePaymentRequestFinished(resp.data))
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

function* payOrderAction(data) {
  try {
    const resp = yield call(payOrderAPI, data.payload)
    if (resp?.data) {
      yield put(payOrderRequestFinished(resp.data))
    }
    navigate("Orders")
  } catch (e) {
    const {response} = e
    yield put(requestFailed())
    showMessage({
      message: response?.data?.detail ?? "Something went wrong, Please try again!",
      type: "danger"
    })
  }
}

function* generateTestPaymentAction(data) {
  try {
    const resp = yield call(generateTestPaymentRequest, data.payload)
    if (resp?.data) {
      yield put(generateTestPaymentRequestFinished(resp.data))
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
  takeLatest(GET_PAYMENTS_REQUEST_STARTED, getPaymentsAction),
  takeLatest(ADD_PAYMENT_REQUEST_STARTED, addPaymentAction),
  takeLatest(DELETE_PAYMENT_REQUEST_STARTED, deletePaymentAction),
  takeLatest(PAY_ORDER_REQUEST_STARTED, payOrderAction),
  takeLatest(GENERATE_TEST_PAYMENT_REQUEST_STARTED, generateTestPaymentAction),
  takeLatest(UPDATE_CUSTOMER_REQUEST_STARTED, updateCustomerAction),
])
