import {createSlice} from "@reduxjs/toolkit";

export const {actions: faresActions, reducer: faresReducer} = createSlice({
  name: "fares",
  initialState: {
    fares: [],
  },
  reducers: {
    setFares: (state, {payload}) => {
      state.fares = payload ?? [];
    },
  },
});
