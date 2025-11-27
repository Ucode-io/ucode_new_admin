import { createSlice } from "@reduxjs/toolkit";

export const { actions: languagesActions, reducer: languagesReducer } = createSlice({
  name: "languages",
  initialState: {
    list: [],
    defaultLanguage: null,
  },
  reducers: {
    setLanguagesItems: (state, { payload }) => {
      state.list = payload ?? [];
    },
    setDefaultLanguage: (state, { payload }) => {
      state.defaultLanguage = payload;
    }
  },
});
