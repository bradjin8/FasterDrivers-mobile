import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Provider} from "react-redux"
import {PersistGate} from "redux-persist/integration/react";

import AuthLayout from "layouts/Auth.js";
import RestaurantLayout from "layouts/Restaurant.js";
import CustomerLayout from "layouts/Customer.js";
import AdminLayout from "layouts/Admin.js";
import {store, persistor} from "./store"
import "./assets/css/index.css";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Switch>
          <Route path={`/restaurant`} component={RestaurantLayout}/>
          <Route path={`/customer`} component={CustomerLayout}/>
          <Route path={`/admin`} component={AdminLayout}/>
          <Route path={`/`} component={AuthLayout}/>
        </Switch>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
