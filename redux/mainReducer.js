import { persistReducer } from "redux-persist"
import AsyncStorage from "@react-native-community/async-storage"

//Reducers
import { loginReducer } from "../src/screenRedux/loginRedux"
import { homeReducer } from "../src/screenRedux/homeRedux"
const appPersistConfig = {
  key: "login",
  storage: AsyncStorage,
  timeout: null
}

export default {
  loginReducer: persistReducer(appPersistConfig, loginReducer),
  homeReducer
}
