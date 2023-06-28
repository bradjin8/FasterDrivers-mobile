const HOST = "fancy-cherry-36842.botics.co"
export const BASE_URL = `https://${HOST}`
export const appConfig = {
  // todo add library to handle env variables
  backendServerURL: `${BASE_URL}/api/v1`,
  websocketUrl: `ws://${HOST}/ws`,
  apiClientID: 'c789e448-1d21-48e9-a51a-d4c7b995af53',
  apiSecretKey: 'dVBprfsHsIr8Z5aCoVua',
  defaultTimeout: 5000,
  urlScheme: 'fasterdrivers',
  appStoreId: 'com.fasterdrivers.ios',
  webAppUrl: 'https://fasterdrivers.vercel.app'
}

export const GOOGLE = {
  WEB_CLIENT_ID: '592134203023-94uubclul41i4er7mkadi0266pepi6oa.apps.googleusercontent.com',
  WEB_CLIENT_SECRET: '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',
  IOS_CLIENT_ID: '592134203023-r2s6smi9hf7v7l1eebolk97r3fk1ticq.apps.googleusercontent.com',
  MAP_API_KEY: "AIzaSyCAcAhKPua5L2ewpRU_P6lmvI37lSIg6Hk",
}

export const STRIPE_PUBLISHABLE_KEY = "pk_test_51N0lDHHuKvl8e8x17JvdYH74CJRg0NL0J7HkA3zCX01uL9hznDEUH8R78GeJjzZ76OC0dzF4RiUaPPB8Uu43zJHC00DPzy6QUK"
export const STRIPE_MERCHANT_ID = "acct_1N0lDHHuKvl8e8x1"


export const APPLE = {
  SERVICE_ID: 'com.fasterdrivers.ios.appleauth',
  REDIRECT_CALLBACK_URL: `${BASE_URL}/accounts/apple/login/callback/`,
}
