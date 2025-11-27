import {createSlice} from "@reduxjs/toolkit";

export const {actions: viewsActions, reducer: viewsReducer} = createSlice({
  name: "viewTab",
  initialState: {
    viewTab: [],
  },
  reducers: {
    setViewTab: (state, {payload}) => {
      const {tableSlug, tabIndex} = payload;
      const existingEntryIndex = state.viewTab.findIndex(
        (entry) => entry.tableSlug === tableSlug
      );

      if (existingEntryIndex !== -1) {
        state.viewTab[existingEntryIndex].tabIndex = tabIndex;
      } else {
        state.viewTab.push({tableSlug, tabIndex});
      }
    },
  },
});
