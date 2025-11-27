import {createAsyncThunk} from "@reduxjs/toolkit";

import {authActions} from "./auth.slice";
import {store} from "..";
import {permissionsActions} from "../permissions/permissions.slice";
import authService from "../../services/auth/authService";
import {companyActions} from "../company/company.slice";

export const loginAction = createAsyncThunk(
  "auth/login",
  async (data, {dispatch}) => {
    try {
      const res = await authService.login(data);
      dispatch(
        authActions.loginSuccess({
          ...res,
          project_id: data.project_id,
          environment_ids: data?.environment_ids,
          currencies: data?.currencies,
        })
      );
      dispatch(companyActions.setCompanyId(res?.user?.company_id));
      dispatch(companyActions.setProjectId(data.project_id));
      dispatch(companyActions.setEnvironmentId(res?.environment_id));
      dispatch(companyActions.setDefaultPage(data?.default_page));
      dispatch(permissionsActions.setPermissions(res?.permissions));

      await authService
        .updateToken({
          refresh_token: res.token.access_token,
          env_id: res.environment_id,
          project_id: data.project_id,
        })
        .then((res) => {
          store.dispatch(authActions.setTokens(res));
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      throw new Error(error);
    }
  }
);
