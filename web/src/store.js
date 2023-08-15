import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import {fasterDriverApi} from "./services/fasterDriver";
import authReducer from './reducers/auth'
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from './reducers/cart'
import uiReducer from './reducers/ui'

const persistConfig = {
  key: 'root',
  storage,
  // blacklist: [fasterDriverApi.reducerPath],
  whitelist: ['auth', 'cart'] // reducers to be persisted
}


const rootReducer = combineReducers({
  [fasterDriverApi.reducerPath]: fasterDriverApi.reducer,
  auth: authReducer,
  cart: cartReducer,
  ui: uiReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(fasterDriverApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store)
