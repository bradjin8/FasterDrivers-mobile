import { all } from "redux-saga/effects"

// sagas
import login from "../src/screenRedux/loginRedux"
import home from "../src/screenRedux/homeRedux"

export function* mainSaga() {
  yield all([login, home])
}
