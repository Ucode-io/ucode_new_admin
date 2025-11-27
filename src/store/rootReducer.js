import {combineReducers} from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import {alertReducer} from "./alert/alert.slice";
import {authReducer} from "./auth/auth.slice";
import storage from "redux-persist/lib/storage";
import {constructorTableReducer} from "./constructorTable/constructorTable.slice";
import {tableColumnReducer} from "./tableColumn/tableColumn.slice";
import {tabRouterReducer} from "./tabRouter/tabRouter.slice";
import {applicationReducer} from "./application/application.slice";
import {menuReducer} from "./menuItem/menuItem.slice";
import {quickFiltersReducer} from "./filter/quick_filter";
import {companyReducer} from "./company/company.slice";
import {cashboxReducer} from "./cashbox/cashbox.slice";
import {filterReducer} from "./filter/filter.slice";
import {tableSizeReducer} from "./tableSize/tableSizeSlice";
import {mainReducer} from "./main/main.slice";
import {selectedRowReducer} from "./selectedRow/selectedRow.slice";
import {languagesReducer} from "./globalLanguages/globalLanguages.slice";
import {paginationReducer} from "./pagination/pagination.slice";
import {relationTabReducer} from "./relationTab/relationTab.slice";
import {viewsReducer} from "./views/view.slice";
import {isOnlineReducer} from "./isOnline/isOnline.slice";
import {permissionsReducer} from "./permissions/permissions.slice";

const mainPersistConfig = {
  key: "main",
  storage,
};

const authPersistConfig = {
  key: "auth",
  storage,
};

const constructorTablePersistConfig = {
  key: "constructorTable",
  storage,
};

const applicationPersistConfig = {
  key: "application",
  storage,
};

const menuPersistConfig = {
  key: "menu",
  storage,
};

const languagesPersistConfig = {
  key: "languages",
  storage,
};

const companyPersistConfig = {
  key: "company",
  storage,
};

const tableColumnTablePersistConfig = {
  key: "tableColumn",
  storage,
};

const filtersPersistConfig = {
  key: "filter",
  storage,
};
const tableSizePersistConfig = {
  key: "tableSize",
  storage,
};

const tabRouterPersistConfig = {
  key: "tabRoute",
  storage,
};

const cashboxPersistConfig = {
  key: "cashbox",
  storage,
};

const selectedRowPersistConfig = {
  key: "selectedRow",
  storage,
};

const tablePagination = {
  key: "selectedPagination",
  storage,
};

const quickFiltersCount = {
  key: "quick_filters",
  storage,
};

const relationTab = {
  key: "relationTab",
  storage,
};

const viewTab = {
  key: "viewSelectedTab",
  storage,
};

const isOnline = {
  key: "isOnline",
  storage,
};

const permissions = {
  key: "permissions",
  storage,
};

// const groupFieldPersistConfig = {
//   key: "groupField",
//   storage,
// }

const rootReducer = combineReducers({
  main: persistReducer(mainPersistConfig, mainReducer),
  auth: persistReducer(authPersistConfig, authReducer),
  constructorTable: persistReducer(
    constructorTablePersistConfig,
    constructorTableReducer
  ),
  application: persistReducer(applicationPersistConfig, applicationReducer),
  menu: persistReducer(menuPersistConfig, menuReducer),
  quick_filter: persistReducer(quickFiltersCount, quickFiltersReducer),
  pagination: persistReducer(tablePagination, paginationReducer),
  languages: persistReducer(languagesPersistConfig, languagesReducer),
  company: persistReducer(companyPersistConfig, companyReducer),
  tableColumn: persistReducer(
    tableColumnTablePersistConfig,
    tableColumnReducer
  ),
  filter: persistReducer(filtersPersistConfig, filterReducer),
  // filter: filterReducer,
  tableSize: persistReducer(tableSizePersistConfig, tableSizeReducer),
  tabRouter: persistReducer(tabRouterPersistConfig, tabRouterReducer),
  relationTab: persistReducer(relationTab, relationTabReducer),
  cashbox: persistReducer(cashboxPersistConfig, cashboxReducer),
  selectedRow: persistReducer(selectedRowPersistConfig, selectedRowReducer),
  viewSelectedTab: persistReducer(viewTab, viewsReducer),
  // groupField: persistReducer(groupFieldPersistConfig, groupFieldReducer),
  alert: alertReducer,
  isOnline: persistReducer(isOnline, isOnlineReducer),
  permissions: persistReducer(permissions, permissionsReducer),
});

export default rootReducer;
