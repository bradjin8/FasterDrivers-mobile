import {createSlice} from "@reduxjs/toolkit";

const auth = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
  },
  reducers: {
    setUser: {
      reducer: (state, action) => {
        state = action.payload
        return state
      },
      prepare: (payload) => {
        return {
          payload: {
            token: payload.token || null,
            user: payload.user || null,
          },
        }
      }
    },
    updateUser: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.token = null
      state.user = null
    }
  }
})

export const {setUser, updateUser, logout} = auth.actions
export default auth.reducer
