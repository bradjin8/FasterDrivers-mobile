import {persistReducer} from "redux-persist"
import AsyncStorage from "@react-native-community/async-storage"

//Reducers
import {loginReducer} from "../src/screenRedux/loginRedux"
import {restaurantReducer} from "../src/screenRedux/restaurantRedux"
import {customerReducer} from "../src/screenRedux/customerRedux"
import {homeReducer} from "../src/screenRedux/homeRedux"
import {driverReducer} from "../src/screenRedux/driverRedux"

const appPersistConfig = {
  key: "login",
  storage: AsyncStorage,
  timeout: null
}

export default {
  loginReducer: persistReducer(appPersistConfig, loginReducer),
  homeReducer,
  restaurantReducer,
  customerReducer,
  driverReducer,
}
