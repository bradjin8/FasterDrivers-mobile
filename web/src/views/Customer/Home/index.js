// Chakra imports
// assets
// Custom icons
import React from "react";
import Restaurant from "./Restaurant";
import RestaurantList from "./RestaurantList";


export const customerHomeRoutes = [
  {
    path: "/customer/home/:id",
    name: "Restaurant",
    component: Restaurant,
  },
  {
    path: "",
    name: "Restaurants",
    component: RestaurantList,
  },
]
