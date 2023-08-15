import {createSlice} from "@reduxjs/toolkit";

const ui = createSlice({
  name: 'ui',
  initialState: {
    keyword: '',
    activeOrder: null,
    needToRefresh: false,
    activeDish: null,
    needToRefreshDishes: false,
  },
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload
    },
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload
    },
    setNeedToRefresh: (state, action) => {
      state.needToRefresh = action.payload
    },
    setActiveDish: (state, action) => {
      state.activeDish = action.payload
    },
    setNeedToRefreshDishes: (state, action) => {
      state.needToRefreshDishes = action.payload
    }
  }
})

export const {
  setKeyword,
  setActiveOrder,
  setNeedToRefresh,
  setActiveDish,
  setNeedToRefreshDishes,
} = ui.actions
export default ui.reducer
