import {createSlice} from "@reduxjs/toolkit";

export const {actions: relationTabActions, reducer: relationTabReducer} =
  createSlice({
    name: "relationTab",
    initialState: {
      tabs: [],
    },
    reducers: {
      addTab: (state, {payload}) => {
        const {slug, tabIndex} = payload;
        const existingEntryIndex = state?.tabs.findIndex(
          (entry) => entry.slug === slug
        );

        if (existingEntryIndex !== -1) {
          state.tabs[existingEntryIndex].tabIndex = tabIndex;
        } else {
          state.tabs.push({slug, tabIndex});
        }
      },
      clear: (state, action) => {
        state.tabs = [];
      },
    },
  });
