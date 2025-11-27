import {createAsyncThunk} from "@reduxjs/toolkit";
import applicationService from "../../services/applicationService";
import constructorTableService from "../../services/constructorTableService";
import {constructorTableActions} from "./constructorTable.slice";

export const fetchConstructorTableListAction = createAsyncThunk(
  "object/fetchConstructorTableList",
  async (appId, {dispatch}) => {
    dispatch(constructorTableActions.setLoader(true));
    dispatch(constructorTableActions.setList([]));
    try {
      const res = await applicationService.getById(appId);
      dispatch(constructorTableActions.setList(res.tables));
      dispatch(constructorTableActions.setApplications(res));
    } catch (error) {
      console.log(error);
      throw new Error(error);
    } finally {
      dispatch(constructorTableActions.setLoader(false));
    }
  }
);

export const createConstructorTableAction = createAsyncThunk(
  "object/createConstructorTable",
  async (data, {dispatch}) => {
    try {
      const res = await constructorTableService.create(data);

      console.log("resgfsdf", res, data);

      dispatch(
        constructorTableActions.add({
          ...res,
          ...data,
        })
      );
      return {...res, ...data, id: res?.id ? res?.id : data?.id};
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
);

export const updateConstructorTableAction = createAsyncThunk(
  "object/updateConstructorTable",
  async (data, {dispatch}) => {
    try {
      await constructorTableService.update(data);

      dispatch(constructorTableActions.setDataById(data));
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
);

export const deleteConstructorTableAction = createAsyncThunk(
  "object/deleteConstructorTable",
  async (tableSlug, {dispatch}) => {
    dispatch(constructorTableActions.setLoader(true));
    try {
      await constructorTableService.delete(tableSlug);

      dispatch(constructorTableActions.delete(tableSlug));
    } catch (error) {
      console.log(error);
      throw new Error(error);
    } finally {
      dispatch(constructorTableActions.setLoader(false));
    }
  }
);
