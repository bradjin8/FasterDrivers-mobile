import {combineReducers, configureStore, createReducer} from "@reduxjs/toolkit"

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
          auth: {},
          dashboard: {}
        }
      }
    }
    return reducer(rootState, action);
  };

  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['*/fulfilled', '*/rejected', '*/pending'],
        ignoredPaths: [''],
        ignoredActionPaths: ['payload'],
      }
    })
  })
}
