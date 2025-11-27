import {createSlice} from "@reduxjs/toolkit";

export const {actions: permissionsActions, reducer: permissionsReducer} =
  createSlice({
    name: "permissions",
    initialState: {
      permissions: {},
    },
    reducers: {
      setPermissions: (state, {payload}) => {
        state.permissions = payload.reduce((acc, curr) => {
          acc[curr.table_slug] = {
            read: curr.read !== "No",
            write: curr.write !== "No",
            update: curr.update !== "No",
            delete: curr.delete !== "No",
            pdf_action: curr.pdf_action !== "No",
            add_field: curr.add_field !== "No",
            automation: curr.automation !== "No",
            language_btn: curr.language_btn !== "No",
            settings: curr.settings !== "No",
            share_modal: curr.share_modal !== "No",
            view_create: curr.view_create !== "No",
            add_filter: curr.add_filter !== "No",
            field_filter: curr.field_filter !== "No",
            fix_column: curr.fix_column !== "No",
            columns: curr.columns !== "No",
            group: curr.group !== "No",
            excel_menu: curr.excel_menu !== "No",
            tab_group: curr.tab_group !== "No",
            search_button: curr.search_button !== "No",
          };
          return acc;
        }, {});
      },
    },
  });
