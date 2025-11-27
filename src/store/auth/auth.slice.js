import {createSlice} from "@reduxjs/toolkit";
// import { listToMap } from "../../utils/listToMap";

const initialState = {
  isAuth: false,
  token: null,
  refreshToken: null,
  userInfo: null,
  roleInfo: null,
  permissions: {},
  loginTableSlug: "",
  userId: "",
  projectId: "",
  tables: [],
  environmentId: "",
  resourceId: "",
  after_login: false,
  environment_ids: [],
  access_type: "",
  user_data: null,
};

export const {actions: authActions, reducer: authReducer} = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, {payload}) {
      state.token = payload.token.access_token;
      state.refreshToken = payload.token.refresh_token;
      state.userInfo = payload.user;
      state.user_data = payload.user_data;
      state.clientType = payload.client_type;
      state.roleInfo = payload.role;
      state.loginTableSlug = payload.login_table_slug;
      state.userId = payload.user_id;
      state.tables = payload.tables;
      state.projectId = payload.project_id;
      state.environmentId = payload.environment_id;
      state.resourceId = payload.resource_id;
      state.globalPermissions = payload.global_permission;
      state.environment_ids = payload.environment_ids;
      // state.permissions = listToMap(payload.permissions?.map(el => ({...el, name: el.name?.replace('ROOT/', '')})), "name")

      state.permissions = payload?.permissions
        ? payload?.permissions?.reduce((acc, curr) => {
            acc[curr.table_slug] = {
              // there is 3 cases ['Yes', 'No', 'Dynamic (Connection name)']
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
          }, {})
        : [];
      state.loading = false;
      state.after_login = true;
    },
    setTokens(state, {payload}) {
      state.token = payload.token.access_token;
      state.refreshToken = payload.token.refresh_token;
      state.isAuth = true;
    },
    setPermission(state, {payload}) {
      state.permissions =
        payload?.permissions?.reduce((acc, curr) => {
          acc[curr.table_slug] = {
            // there is 3 cases ['Yes', 'No', 'Dynamic (Connection name)']
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
            fix_column: curr.fix_column !== "No",
            columns: curr.columns !== "No",
            group: curr.group !== "No",
            excel_menu: curr.excel_menu !== "No",
            tab_group: curr.tab_group !== "No",
            add_filter: curr.add_filter !== "No",
            field_filter: curr.field_filter !== "No",
            search_button: curr.search_button !== "No",
          };
          return acc;
        }, {}) || [];
    },
    logout: (state) => initialState,
    setStatus(state, payload) {
      state.access_type = payload;
    },
  },
});
