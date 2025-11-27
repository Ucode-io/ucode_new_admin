import {createSlice} from "@reduxjs/toolkit";

export const {actions: companyActions, reducer: companyReducer} = createSlice({
  name: "company",
  initialState: {
    companies: [],
    projects: [],
    environments: [],
    companyItem: {},
    projectItem: {},
    environmentItem: {},
    companyId: null,
    projectId: null,
    environmentId: null,
    version: null,
    defaultPage: "",
  },
  reducers: {
    setCompanies: (state, {payload}) => {
      state.companies = payload ?? [];
    },
    setProjects: (state, {payload}) => {
      state.projects = payload ?? [];
    },
    setEnvironments: (state, {payload}) => {
      state.environments = payload ?? [];
    },
    setCompanyItem: (state, {payload}) => {
      state.companyItem = payload ?? {};
    },
    setProjectItem: (state, {payload}) => {
      state.projectItem = payload ?? {};
    },
    setEnvironmentItem: (state, {payload}) => {
      state.environmentItem = payload ?? {};
    },
    setCompanyId: (state, {payload}) => {
      state.companyId = payload ?? "";
    },
    setProjectId: (state, {payload}) => {
      state.projectId = payload ?? "";
    },
    setEnvironmentId: (state, {payload}) => {
      state.environmentId = payload ?? "";
    },
    setVersion: (state, {payload}) => {
      state.version = payload ?? "";
    },
    setDefaultPage: (state, {payload}) => {
      state.defaultPage = payload ?? "";
    },
  },
});
