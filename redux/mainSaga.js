import { all } from "redux-saga/effects"

// sagas
import login from "../src/screenRedux/loginRedux"
import home from "../src/screenRedux/homeRedux"
import restaurant from "../src/screenRedux/restaurantRedux"
import customer from "../src/screenRedux/customerRedux"

export function* mainSaga() {
  yield all([login, home, restaurant, customer])
}
