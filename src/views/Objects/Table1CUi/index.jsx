import {Box} from "@mui/material";
import React, {useMemo, useState} from "react";
import TableUiHead from "./TableUiHead/TableUiHead";
import TableFilterBlock from "./TableFilterBlock";
import TableComponent from "./TableComponent/TableComponent";
import constructorObjectService from "../../../services/constructorObjectService";
import {useQuery} from "react-query";
import {useParams} from "react-router-dom";
import newTableService from "../../../services/newTableService";
import useFilters from "../../../hooks/useFilters";
import {customSortArray} from "../../../utils/customSortArray";

function Table1CUi({
  menuItem,
  view,
  fieldsMap,
  views,
  computedVisibleFields,
  selectedTabIndex,
  setSelectedTabIndex,
  settingsModalVisible,
  setSettingsModalVisible,
  isChanged,
  setIsChanged,
  selectedView,
  setSelectedView,
  control,
}) {
  const {tableSlug} = useParams();
  const [openFilter, setOpenFilter] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const {filters} = useFilters(tableSlug, view.id);
  const [searchText, setSearchText] = useState();

  function hasValidFilters(filters) {
    if (!filters || typeof filters !== "object") {
      return false;
    }

    return Object.keys(filters).some((key) => {
      const value = filters[key];
      if (typeof value === "string" && value.trim() !== "") return true;
      if (typeof value === "number") return true;
      if (Array.isArray(value) && value.length > 0) return true;
      if (
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length > 0
      )
        return true;
      return false;
    });
  }

  const {data: {filteredItems} = {data: []}} = useQuery({
    queryKey: [
      "GET_OBJECTS_LIST",
      {
        filters,
        searchText,
      },
    ],
    queryFn: () => {
      return constructorObjectService.getListV2(tableSlug, {
        data: {
          ...filters,
          search: searchText,
        },
      });
    },
    cacheTime: 10,
    enabled: hasValidFilters(filters) || Boolean(searchText),
    select: (res) => {
      const filteredItems = res?.data?.response;
      return {
        filteredItems,
      };
    },
  });

  const {data: {foldersList, count} = {data: []}, refetch} = useQuery(
    ["GET_FOLDER_LIST", {tableSlug, limit, offset}],
    () => {
      return newTableService.getFolderList({
        table_id: menuItem?.table_id,
        limit: limit,
        offset: offset,
      });
    },
    {
      enabled: Boolean(menuItem?.table_id) && !hasValidFilters(filters),
      cacheTime: 10,
      select: (res) => {
        const foldersList = res?.folder_groups ?? [];
        const count = res?.count;
        return {
          foldersList,
          count,
        };
      },
    }
  );

  const folders =
    hasValidFilters(filters) || Boolean(searchText)
      ? filteredItems
      : foldersList;

  const columns = useMemo(() => {
    const result = [];
    for (const key in view.attributes.fixedColumns) {
      if (view.attributes.fixedColumns.hasOwnProperty(key)) {
        if (view.attributes.fixedColumns[key]) {
          result.push({id: key, value: view.attributes.fixedColumns[key]});
        }
      }
    }

    const uniqueIdsSet = new Set();
    const uniqueColumns = view?.columns?.filter((column) => {
      if (!uniqueIdsSet.has(column)) {
        uniqueIdsSet.add(column);
        return true;
      }
      return false;
    });

    return customSortArray(
      uniqueColumns,
      result.map((el) => el.id)
    )
      ?.map((el) => fieldsMap[el])
      ?.filter((el) => el);
  }, [view, fieldsMap]);

  return (
    <Box>
      <TableUiHead
        menuItem={menuItem}
        views={views}
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={setSelectedTabIndex}
        settingsModalVisible={settingsModalVisible}
        setSettingsModalVisible={setSettingsModalVisible}
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      />
      <TableFilterBlock
        fields={columns}
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        view={view}
        fieldsMap={fieldsMap}
        menuItem={menuItem}
        setSearchText={setSearchText}
        computedVisibleFields={computedVisibleFields}
      />

      <TableComponent
        folders={folders}
        fields={columns}
        openFilter={openFilter}
        count={count}
        limit={limit}
        setLimit={setLimit}
        offset={offset}
        setOffset={setOffset}
        view={view}
        menuItem={menuItem}
        searchText={searchText}
        control={control}
        refetch={refetch}
      />
    </Box>
  );
}

export default Table1CUi;
