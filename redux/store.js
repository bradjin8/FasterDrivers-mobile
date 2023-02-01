import combinedReducers from "./mainReducer"
import { compose } from "redux"
import createSagaMiddleware from "redux-saga"
import { persistCombineReducers } from "redux-persist"
import AsyncStorage from "@react-native-community/async-storage"
import { mainSaga } from "./mainSaga"
import { configureStore } from "@reduxjs/toolkit"

const sagaMiddleware = createSagaMiddleware()

/**
 * this app uses React Native Debugger, but it works without it
 */

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const middlewares = [sagaMiddleware]

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["login"]
}

const persistedReducer = persistCombineReducers(persistConfig, combinedReducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false
      // serializableCheck: false
    }).concat(middlewares)
})

sagaMiddleware.run(mainSaga)

export { store }
