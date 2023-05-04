import { configureStore, createReducer, combineReducers } from "@reduxjs/toolkit"

export const getStore = (globalState) => {
  const appReducer = createReducer(globalState, _ => {
    return globalState
  })

  const reducer = combineReducers({
    app: appReducer,
  })

  const rootReducer = (rootState, action) => {
    if (action.type === 'login/logoutRequest/fulfilled') {
      if (rootState) {
        rootState = {
          ...rootState,
          auth: initialAuthState,
          dashboard: initialDashboardState
        }
      }
    }
    return reducer(rootState, action);
  };

  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      serializableCheck: false
    })
  })
}
