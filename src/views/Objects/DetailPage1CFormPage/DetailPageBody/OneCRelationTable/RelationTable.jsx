import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {useParams, useSearchParams} from "react-router-dom";
import constructorObjectService from "../../../../../services/constructorObjectService";
import {useMenuGetByIdQuery} from "../../../../../services/menuService";
import {listToMap} from "../../../../../utils/listToMap";
import {objectToArray} from "../../../../../utils/objectToArray";
import RelationTableBody from "./RelationTableBody";
import RelationTableFilter from "./RelationTableFilter";
import RelationTableHead from "./RelationTableHead";
import styles from "./style.module.scss";
import AddRow from "../../DetailPageTable/AddRow";
import AddIcon from "@mui/icons-material/Add";
import {customSortArray} from "../../../../../utils/customSortArray";

function RelationTable({
  relation,
  shouldGet,
  id,
  selectedTabIndex,
  setFormValue,
  setFormVisible,
  selectedTab,
  type,
  getAllData = () => {},
  layoutData,
  view,
  limit = 10,
  setLimit = () => {},
  setCount = () => {},
  control,
  offset,
}) {
  const {tableSlug} = useParams();
  const [filters, setFilters] = useState({});
  const {i18n} = useTranslation();
  const [relOptions, setRelOptions] = useState([]);
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [menuItem, setMenuItem] = useState(null);
  const [addRow, setAddRow] = useState(false);

  const {loader: menuLoader} = useMenuGetByIdQuery({
    menuId: searchParams.get("menuId"),
    queryParams: {
      enabled: Boolean(searchParams.get("menuId")),
      onSuccess: (res) => {
        setMenuItem(res);
      },
    },
  });

  const getRelatedTabeSlug = useMemo(() => {
    return relation?.find((el) => el?.id === selectedTab?.relation_id);
  }, [relation, selectedTab?.relation_id, tableSlug]);

  const computedFilters = useMemo(() => {
    const relationFilter = {};

    if (getRelatedTabeSlug?.type === "Many2Many")
      relationFilter[`${tableSlug}_ids`] = id;
    else if (getRelatedTabeSlug?.type === "Many2Dynamic")
      relationFilter[
        `${getRelatedTabeSlug?.relation_field_slug}.${tableSlug}_id`
      ] = id;
    else if (
      getRelatedTabeSlug?.relation_index &&
      getRelatedTabeSlug?.relation_index > 1
    )
      relationFilter[`${tableSlug}_id_${getRelatedTabeSlug?.relation_index}`] =
        id;
    else relationFilter[`${tableSlug}_id`] = id;
    return {
      ...filters,
      ...relationFilter,
    };
  }, [
    filters,
    tableSlug,
    id,
    getRelatedTabeSlug?.type,
    getRelatedTabeSlug?.relation_field_slug,
  ]);

  const {data: {tableData = [], columns = [], fieldsMap = {}} = {}, refetch} =
    useQuery(
      [
        "GET_OBJECT_LIST_ROW",
        getRelatedTabeSlug?.relatedTable,
        shouldGet,
        searchText,
        {
          filters: computedFilters,
          offset: offset,
          limit,
        },
      ],
      () => {
        return constructorObjectService.getList(
          getRelatedTabeSlug?.relatedTable,
          {
            data: {
              offset: offset,
              limit: limit,
              from_tab: type === "relation" ? true : false,
              search: searchText,
            },
          },
          {
            language_setting: i18n?.language,
          }
        );
      },
      {
        enabled: Boolean(getRelatedTabeSlug?.relatedTable),
        select: ({data}) => {
          const tableData = id ? objectToArray(data.response ?? {}) : [];
          const fieldsMap = listToMap(data.fields);
          const array = [];
          for (const key in getRelatedTabeSlug?.attributes?.fixedColumns) {
            if (
              getRelatedTabeSlug?.attributes?.fixedColumns.hasOwnProperty(key)
            ) {
              if (getRelatedTabeSlug?.attributes?.fixedColumns[key])
                array.push({
                  id: key,
                  value: getRelatedTabeSlug?.attributes?.fixedColumns?.[key],
                });
            }
          }

          const columns = customSortArray(
            (Array.isArray(
              layoutData?.tabs?.[selectedTabIndex]?.attributes?.columns
            )
              ? layoutData?.tabs?.[selectedTabIndex]?.attributes?.columns
              : []) ?? getRelatedTabeSlug?.columns,
            array.map((el) => el.id)
          )
            ?.map((el) => fieldsMap[el])
            ?.filter((el) => el);

          const quickFilters = getRelatedTabeSlug.quick_filters
            ?.map(({field_id}) => fieldsMap[field_id])
            ?.filter((el) => el);
          setCount(data?.count || 0);
          return {
            tableData,
            columns,
            quickFilters,
            fieldsMap,
          };
        },
        onSuccess: () => {
          setFormValue("multi", tableData);
        },
      }
    );

  const computedRelationFields = useMemo(() => {
    return Object.values(fieldsMap)?.filter((element) => {
      return element?.type === "LOOKUP" || element?.type === "LOOKUPS";
    });
  }, [fieldsMap]);

  const getOptionsList = () => {
    const computedIds = computedRelationFields?.map((item) => ({
      table_slug: item?.slug,
      ids:
        item?.type === "LOOKUP"
          ? Array.from(new Set(tableData?.map((obj) => obj?.[item?.slug])))
          : Array.from(
              new Set([].concat(...tableData?.map((obj) => obj?.[item?.slug])))
            ),
    }));
    tableData?.length &&
      computedRelationFields?.forEach((item, index) => {
        constructorObjectService
          .getListV2(item?.table_slug, {
            data: {
              limit: 10,
              offset: 0,
              additional_request: {
                additional_field: "guid",
                additional_values: computedIds?.find(
                  (computedItem) => computedItem?.table_slug === item?.slug
                )?.ids,
              },
            },
          })
          .then((res) => {
            if (relOptions?.length > 0) {
              setRelOptions((prev) => {
                const updatedOptions = prev.map((option) => {
                  if (option.table_slug === item?.table_slug) {
                    return {
                      table_slug: item?.table_slug,
                      response: res?.data?.response,
                      relationId: item?.relation_id,
                    };
                  }
                  return option;
                });
                return updatedOptions;
              });
            } else {
              setRelOptions((prev) => [
                ...prev,
                {
                  table_slug: item?.table_slug,
                  response: res?.data?.response,
                  relationId: item?.relation_id,
                },
              ]);
            }
          });
      });
  };

  const addNewRow = () => {
    setAddRow(!addRow);
  };

  useEffect(() => {
    if (getRelatedTabeSlug?.default_editable) {
      setFormVisible(true);
    }
  }, [getRelatedTabeSlug?.default_editable, setFormVisible]);

  useEffect(() => {
    getOptionsList();
  }, [tableData, computedRelationFields]);

  useEffect(() => {
    if (isNaN(parseInt(getRelatedTabeSlug?.default_limit))) setLimit(10);
    else setLimit(parseInt(getRelatedTabeSlug?.default_limit));
  }, [getRelatedTabeSlug?.default_limit]);

  return (
    <>
      <RelationTableFilter
        fieldsMap={fieldsMap}
        view={getRelatedTabeSlug}
        getAllData={getAllData}
        selectedTabIndex={selectedTabIndex}
        data={layoutData}
        fields={columns}
        setSearchText={setSearchText}
        addNewRow={addNewRow}
      />
      <div className={styles.tableComponent}>
        <table className={styles.expandable_table}>
          <thead>
            <tr>
              <th
                style={{
                  width: "60px",
                  textAlign: "center",
                }}>
                №
              </th>
              {columns?.map((column) => (
                <RelationTableHead
                  view={getRelatedTabeSlug}
                  column={column}
                  fieldsMap={fieldsMap}
                  data={layoutData}
                  selectedTabIndex={selectedTabIndex}
                  getAllData={getAllData}
                />
              ))}
              <th style={{width: "60px"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((item, index) => (
              <RelationTableBody
                view={getRelatedTabeSlug}
                columns={columns}
                item={item}
                index={index}
                tableData={tableData}
                control={control}
                menuItem={menuItem}
                offset={offset}
                limit={limit}
                relatedTableSlug={getRelatedTabeSlug?.relatedTable}
                refetch={refetch}
              />
            ))}
            {addRow && (
              <AddRow
                fields={columns}
                relatedTableSlug={getRelatedTabeSlug?.relatedTable}
                view={view}
                data={tableData}
                setAddRow={setAddRow}
                padding={"20px"}
                refetch={refetch}
              />
            )}
            {!addRow && (
              <tr>
                <td
                  onClick={addNewRow}
                  style={{
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    borderTop: "none",
                    cursor: "pointer",
                  }}>
                  <AddIcon sx={{fontSize: "20px", color: "#000"}} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RelationTable;
