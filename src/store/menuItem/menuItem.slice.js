import { createSlice } from "@reduxjs/toolkit";

export const { actions: menuActions, reducer: menuReducer } = createSlice({
  name: "menu",
  initialState: {
    menuItem: {},
    menuTemplate: "",
    invite: false,
  },
  reducers: {
    setMenuItem: (state, { payload }) => {
      state.menuItem = payload ?? {};
    },
    setInvite: (state, { payload }) => {
      state.invite = payload ?? false;
    },
    setMenuLayout: (state, { payload }) => {
      state.menuTemplate = payload ?? {};
    },
  },
});
