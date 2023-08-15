export const WEBAPP_URL = "https://fasterdrivers.com";
const PRODUCTION_URL = "https://fancy-cherry-36842.botics.co/";
const STAGING_URL = "https://fancy-cherry-36842-staging.botics.co/";
export const BASE_URL = PRODUCTION_URL;

export const API_ENDPOINT = `${BASE_URL}api/v1/`;

export default {
  LOGIN: 'users/login/',
  USERS: 'users/',
  LOGOUT: 'users/logout/',
  FORGOT_PASSWORD: 'users/reset/',
  RESET_PASSWORD: 'users/forgot_password/',
  CHANGE_PASSWORD: 'users/change_password/',

  GET_RESTAURANTS: 'restaurants/',
  GET_MY_PAYMENT_METHODS: 'payments/my_cards/',
  Add_PAYMENT_METHOD: 'payments/add_payment_method/',
  REMOVE_PAYMENT_METHOD: 'payments/revoke_payment_method/',
  PAY_FOR_ORDER: 'payments/process/',

  ORDERS: 'orders/',
  DISHES: 'dishes/',
  REVIEWS: 'reviews/',
  DRIVER_REVIEWS: 'driver-reviews/',

  SEND_FEEDBACK: 'admin/feedback/',
  SEND_INVITE: 'users/invitation/',


  GET_NEARBY_DRIVERS: 'restaurants/nearby_drivers/',
  REQUEST_DRIVER: 'restaurants/request_driver/',

  CHECK_STRIPE_ACCOUNT: 'payments/check/',
  CONNECT_STRIPE_ACCOUNT: 'payments/account/?device=web',

  CUSTOMER_ADDRESSES: 'customers/address/',


  FEEDBACK: 'feedback/',
  HOT_KEYWORDS: 'hot_keywords/',
  SUBSCRIPTIONS: 'subscriptions/',
}
