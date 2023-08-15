import {useToast} from "@chakra-ui/react";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query"
import {create} from "apisauce"
import {useDispatch, useSelector} from "react-redux";
import Endpoints, {API_ENDPOINT} from "../constants/endpoints";
import {USER_TYPES} from "../constants/users";
import {logout, updateUser} from "../reducers/auth";
import {setNeedToRefresh} from "../reducers/ui";
import {toFormData} from "../utils/hooks";

export const fasterDriverApi = createApi({
  reducerPath: "fasterDriverApi",
  baseQuery: fetchBaseQuery({baseUrl: API_ENDPOINT}),
  endpoints: (builder) => ({
    login: builder.query({
      query: () => Endpoints.LOGIN,
    }),
  }),
})

export const pub_api = create({
  baseURL: API_ENDPOINT,
})

export const loginApi = (data) => pub_api.post(Endpoints.LOGIN, toFormData(data))
export const signupApi = (data) => pub_api.post(Endpoints.USERS, toFormData(data))
export const forgotPasswordApi = (data) => pub_api.post(Endpoints.FORGOT_PASSWORD, toFormData(data))
export const resetPasswordApi = ({token, password_1, password_2}) =>
  pub_api.post(Endpoints.RESET_PASSWORD, toFormData({password_1, password_2}), {
    headers: {
      Authorization: `Token ${token}`,
    }
  })

export const useApi = () => {
  const {token, user} = useSelector((state) => state.auth)
  const {activeDish, activeOrder} = useSelector((state) => state.ui)
  const dispatch = useDispatch()
  const toast = useToast()

  const api = create({
    baseURL: API_ENDPOINT,
    headers: {
      Authorization: `Token ${token}`,
    }
  })
  api.axiosInstance.interceptors.response.use((response) => {
    return response
  }, (error) => {
    // console.log('error', error.response.status)
    if (error?.response?.status === 401) {
      dispatch(logout())
      toast({
        title: 'Unauthorized',
        description: 'Invalid token, please login again',
        status: 'error',
        duration: 3000,
      })
      throw new Error('Unauthorized')
    }
  })

  const logoutApi = () => api.get(Endpoints.LOGOUT)
  const changePasswordApi = (data) => api.post(Endpoints.CHANGE_PASSWORD, toFormData(data))
  const deleteAccountApi = () => api.delete(`${Endpoints.USERS}${user.id}/`)


  /*********** START_CUSTOMER_API *****/
  const getRestaurantsApi = () => api.get(Endpoints.GET_RESTAURANTS)
  const getRestaurantByIdApi = (id) => api.get(`${Endpoints.GET_RESTAURANTS}${id}/`)


  const getMyPaymentMethodsApi = () => api.get(Endpoints.GET_MY_PAYMENT_METHODS)
  const addPaymentMethodApi = ({paymentId, name}) => {
    const profile = user[user.type.toLowerCase()]
    let address
    if (profile.addresses?.length > 0) {
      address = {
        city: profile.addresses[0]?.city,
        country: profile.addresses[0]?.country || "US",
        line1: profile.addresses[0]?.street,
        state: profile.addresses[0]?.state,
        postal_code: profile.addresses[0]?.zip_code,
      }
    } else {
      address = {
        city: profile.city,
        country: profile.country || "US",
        line1: profile.street,
        state: profile.state,
        postal_code: profile.zip_code,
      }
    }
    return api.post(Endpoints.Add_PAYMENT_METHOD, {
      payment_method: paymentId,
      billing_details: {
        name: name,
        address,
      }
    })
  }
  const removePaymentMethodApi = (id) => api.post(Endpoints.REMOVE_PAYMENT_METHOD, toFormData({payment_method: id}))
  const payForOrderApi = (data) => api.post(Endpoints.PAY_FOR_ORDER, toFormData(data))


  const getOrdersApi = (status = []) => {
    let params
    switch (user.type) {
      case USER_TYPES.RESTAURANT:
        params = {
          restaurant: user.restaurant.id,
        }
        break
      case USER_TYPES.CUSTOMER:
        params = {
          user: user.id,
        }
        break
      default:
        params = {}
    }

    if (status?.length > 0) {
      params.status = status.join(',')
    }
    return api.get(`${Endpoints.ORDERS}`, params)
  }
  const createOrderApi = (data) => api.post(Endpoints.ORDERS, toFormData(data))


  const rateRestaurantApi = (data) => api.post(Endpoints.REVIEWS, toFormData(data))
  const rateDriverApi = (data) => api.post(Endpoints.DRIVER_REVIEWS, toFormData(data))
  const getRestaurantReviewsApi = (id) => api.get(`${Endpoints.REVIEWS}?restaurant=${id}`)


  const getAddressesApi = () => api.get(Endpoints.CUSTOMER_ADDRESSES)
  const addAddressApi = (data) => api.patch(`${Endpoints.USERS}${user.id}/`, toFormData(data))
  const updateAddressApi = (id, data) => api.patch(`${Endpoints.CUSTOMER_ADDRESSES}${id}/`, toFormData(data))
  const removeAddressApi = (id) => api.delete(`${Endpoints.CUSTOMER_ADDRESSES}${id}/`)
  /* END_CUSTOMER_API *****/

  /*** START_RESTAURANT_API ***/
  const fetchUserApi = () => api.get(`${Endpoints.USERS}${user.id}/`)
    .then((res) => {
      const {ok, data} = res
      if (ok) {
        dispatch(updateUser(data))
      }
      return res
    })

  const acceptAnOrderApi = (id) => api.get(`${Endpoints.ORDERS}accept/?order=${id}`)
  const rejectAnOrderApi = (id) => api.get(`${Endpoints.ORDERS}reject/?order=${id}`)

  const getNearbyDriversApi = () => api.get(Endpoints.GET_NEARBY_DRIVERS)
  const requestDriverApi = (data) => api.post(Endpoints.REQUEST_DRIVER, toFormData(data))
    .then(res => {
      dispatch(setNeedToRefresh(true))
      return res
    })

  const checkStripeAccountApi = () => api.get(Endpoints.CHECK_STRIPE_ACCOUNT)
  const connectStripeAccountApi = () => api.get(Endpoints.CONNECT_STRIPE_ACCOUNT)

  /* END_RESTAURANT_API *****/

  const getDishesApi = () => api.get(Endpoints.DISHES)
  const getDishApi = (id) => api.get(`${Endpoints.DISHES}${id}/`)
  const updateDishApi = (data) => api.patch(`${Endpoints.DISHES}${activeDish?.id}/`, toFormData(data), {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
  const deleteDishApi = (id) => api.delete(`${Endpoints.DISHES}${id}/`)

  const addDishApi = (data) => api.post(Endpoints.DISHES, toFormData(data), {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })



  const updateProfileApi = (data) => api.patch(`${Endpoints.USERS}${user.id}/`, toFormData(data), {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
  const sendFeedbackApi = (data) => api.post(Endpoints.SEND_FEEDBACK, toFormData(data))
  const sendInviteApi = (email) => api.get(Endpoints.SEND_INVITE, {email})


  const getSubscriptions = () => api.get(`${Endpoints.SUBSCRIPTIONS}plans/`)
  const updateSubscriptionPrice = (data) => api.patch(`${Endpoints.SUBSCRIPTIONS}update_price/`, toFormData(data))

  return {
    logoutApi,
    changePasswordApi,
    deleteAccountApi,

    getRestaurantsApi,
    getRestaurantByIdApi,

    getMyPaymentMethodsApi,
    addPaymentMethodApi,
    removePaymentMethodApi,

    getOrdersApi,
    createOrderApi,
    payForOrderApi,
    acceptAnOrderApi,
    rejectAnOrderApi,

    getAddressesApi,
    addAddressApi,
    updateAddressApi,
    removeAddressApi,

    getNearbyDriversApi,
    requestDriverApi,

    getDishesApi,
    getDishApi,
    updateDishApi,
    deleteDishApi,
    addDishApi,

    checkStripeAccountApi,
    connectStripeAccountApi,

    rateRestaurantApi,
    rateDriverApi,
    getRestaurantReviewsApi,

    fetchUserApi,
    updateProfileApi,

    sendFeedbackApi,
    sendInviteApi,

    getSubscriptions,
    updateSubscriptionPrice,
  }
}




export const useAdminApi = () => {
  const {token, user} = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const toast = useToast()

  const api = create({
    baseURL: `${API_ENDPOINT}admin/`,
    headers: {
      Authorization: `Token ${token}`,
    }
  })
  api.axiosInstance.interceptors.response.use((response) => {
    return response
  }, (error) => {
    // console.log('error', error.response.status)
    if (error?.response?.status === 401) {
      dispatch(logout())
      toast({
        title: 'Unauthorized',
        description: 'Invalid token, please login again',
        status: 'error',
        duration: 3000,
      })
      throw new Error('Unauthorized')
    }
  })

  const getUsers = () => api.get(`${Endpoints.USERS}?l=1000`)
  const getUsersWithActiveSubscription = () => api.get(Endpoints.USERS, {
    active_subscription: true
  })
  const deleteUser = (userId) => api.delete(`${Endpoints.USERS}${userId}/`)
  const suspendUser = (userId) => api.post(`${Endpoints.USERS}suspend/`, {user: userId})


  const getFeedbacks = () => api.get(Endpoints.FEEDBACK)
  const respondFeedback = (data) => api.post(`${Endpoints.FEEDBACK}respond/`, toFormData(data))

  const getHotKeywords = () => api.get(Endpoints.HOT_KEYWORDS)
  const addHotKeyword = (data) => api.post(Endpoints.HOT_KEYWORDS, toFormData(data))
  const updateHotKeyword = (id, data) => api.patch(`${Endpoints.HOT_KEYWORDS}${id}/`, toFormData(data))
  const deleteHotKeyword = (id) => api.delete(`${Endpoints.HOT_KEYWORDS}${id}/`)




  return {
    getUsers,
    deleteUser,
    suspendUser,

    getFeedbacks,
    respondFeedback,

    getHotKeywords,
    addHotKeyword,
    updateHotKeyword,
    deleteHotKeyword,

    getUsersWithActiveSubscription,
  }
}
