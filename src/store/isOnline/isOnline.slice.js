import {createSlice} from "@reduxjs/toolkit";

export const {actions: isOnlineReducerAction, reducer: isOnlineReducer} =
  createSlice({
    name: "isOnline",
    initialState: {
      isOnline: navigator.isOnline,
    },
    reducers: {
      setisOnline: (state, {payload}) => {
        state.isOnline = payload ?? {};
      },
    },
  });
