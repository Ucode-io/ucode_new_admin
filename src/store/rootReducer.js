import {combineReducers} from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import {mainReducer} from "./main/main.slice";
import {authReducer} from "./auth/auth.slice";
import {companyReducer} from "./company/company.slice";
import {faresActions, faresReducer} from "./fares/fares.slice";
import {alertReducer} from "./alert/alert.slice";

const mainPersistConfig = {
  key: "main",
  storage,
};

const authPersistConfig = {
  key: "auth",
  storage,
};

const companyPersistConfig = {
  key: "company",
  storage,
};

const faresPersistConfig = {
  key: "fares",
  storage,
};

const rootReducer = combineReducers({
  main: persistReducer(mainPersistConfig, mainReducer),
  auth: persistReducer(authPersistConfig, authReducer),
  company: persistReducer(companyPersistConfig, companyReducer),
  fares: persistReducer(faresPersistConfig, faresReducer),
  alert: alertReducer,
});

export default rootReducer;
