import {createSlice} from "@reduxjs/toolkit";

export const {actions: quickFiltersActions, reducer: quickFiltersReducer} =
  createSlice({
    name: "quick_filters",
    initialState: {
      quick_filters: 0,
    },
    reducers: {
      setQuickFiltersCount: (state, {payload}) => {
        state.quick_filters = payload ?? 0;
      },
    },
  });
