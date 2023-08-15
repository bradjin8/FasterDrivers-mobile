import {createSlice} from "@reduxjs/toolkit";

const cart = createSlice({
  name: 'cart',
  initialState: {
    orderMap: {},
    deliveryAddress: null,
    visible: false,
    activeRestaurant: null,
    userId: null,
    lastUpdated: null,
  },
  reducers: {
    addToCart: {
      reducer: (state, {payload: {restaurantId, dishId, addons, details}}) => {
        // console.log('addToCart', restaurantId, dishId, addons, details)

        if (!restaurantId || !dishId) {
          return state
        }

        // new restaurant
        if (!state.orderMap[restaurantId]) {
          state.orderMap[restaurantId] = {}
        }

        // new dish ?
        if (!state.orderMap[restaurantId][dishId]) {
          state.orderMap[restaurantId][dishId] = {
            quantity: 1,
            addons,
            details,
          }
        } else {
          state.orderMap[restaurantId][dishId] = {
            ...state.orderMap[restaurantId][dishId],
            quantity: state.orderMap[restaurantId][dishId].quantity + 1,
            addons: state.orderMap[restaurantId][dishId].addons?.concat(addons) || addons,
          }
        }

        state.lastUpdated = Date.now()
        return state
      },
      prepare: (payload) => {
        return {
          payload: {
            restaurantId: payload.restaurantId || null,
            dishId: payload.dishId || null,
            addons: payload.addons || [],
            details: payload.details || {},
          },
        }
      }
    },
    removeFromCart: {
      reducer: (state, {payload: {restaurantId, dishId, addons}}) => {
        if (!restaurantId || !dishId) {
          return state
        }

        if (!state.orderMap[restaurantId][dishId]) {
          return state
        }

        if (state.orderMap[restaurantId][dishId].quantity === 1) {
          state.orderMap[restaurantId][dishId] = null
        } else {
          state.orderMap[restaurantId][dishId] = {
            ...state.orderMap[restaurantId][dishId],
            quantity: state.orderMap[restaurantId][dishId].quantity - 1,
            addons: state.orderMap[restaurantId][dishId].addons.filter(it => addons.indexOf(it) === -1),
          }
        }
        state.lastUpdated = Date.now()
        return state
      },
      prepare: (payload) => {
        return {
          payload: {
            restaurantId: payload.restaurantId || null,
            dishId: payload.dishId || null,
            addons: payload.addons || [],
          }
        }
      },
    },
    removeDishFromCart: (state, {payload: {restaurantId, dishId}}) => {
      if (!restaurantId || !dishId) {
        return state
      }
      if (state.orderMap[restaurantId][dishId]) {
        state.orderMap[restaurantId][dishId] = null
      }
      state.lastUpdated = Date.now()
      return state
    },
    emptyCart: (state) => {
      state.lastUpdated = Date.now()
      state.orderMap = {}
    },
    removeOrdersByRestaurant: (state, {payload: {restaurantId}}) => {
      if (!restaurantId) {
        return state
      }

      if (state.orderMap[restaurantId]) {
        state.orderMap[restaurantId] = null
      }
      state.lastUpdated = Date.now()
      return state
    },
    setDeliveryAddress: (state, {payload}) => {
      state.deliveryAddress = payload
    },
    openCart: (state) => {
      state.visible = true
    },
    closeCart: (state) => {
      state.visible = false
    },
    setActiveRestaurant: (state, {payload}) => {
      state.activeRestaurant = payload
    }
  }
})

export const {
  addToCart,
  removeFromCart,
  removeDishFromCart,
  removeOrdersByRestaurant,
  emptyCart,
  setDeliveryAddress,
  openCart,
  closeCart,
  setActiveRestaurant,
} = cart.actions
export default cart.reducer
