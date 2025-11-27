import React, {useEffect, useMemo, useRef, useState} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {Box, CircularProgress, Menu, MenuItem} from "@mui/material";
import styles from "./style.module.scss";
import DetailPageSection from "./DetailPageSection";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useParams, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useFieldArray} from "react-hook-form";
import {useQuery} from "react-query";
import RelationTable from "./OneCRelationTable/RelationTable";
import {relationTabActions} from "../../../../store/relationTab/relationTab.slice";
import constructorTableService from "../../../../services/constructorTableService";
import {listToMap} from "../../../../utils/listToMap";
import constructorObjectService from "../../../../services/constructorObjectService";

function DetailPageTabs({
  selectedTabIndex,
  setSelectedTabIndex,
  relations,
  loader,
  getAllData = () => {},
  tableSlug: tableSlugFromProps,
  id: idFromProps,
  limit,
  setLimit,
  relatedTable,
  control,
  getValues,
  reset,
  setFormValue,
  watch,
  setSelectTab,
  selectedTab,
  data,
  setOffset = () => {},
  offset,
  setCount = () => {},
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const open = Boolean(anchorEl);

  const maxVisibleTabs = 5;
  const visibleTabs = data?.tabs?.slice(0, maxVisibleTabs);
  const moreTabs = data?.tabs?.slice(maxVisibleTabs);

  const {tableSlug: tableSlugFromParams, id: idFromParams, appId} = useParams();
  const tableSlug = tableSlugFromProps ?? tableSlugFromParams;
  const id = idFromProps ?? idFromParams;

  const [searchParams, setSearchParams] = useSearchParams();
  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState(
    {}
  );
  const [defaultValuesFromJwt, setDefaultValuesFromJwt] = useState({});
  const [jwtObjects, setJwtObjects] = useState([]);
  const {i18n} = useTranslation();
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [type, setType] = useState(null);
  const queryTab = searchParams.get("tab");
  const myRef = useRef();
  const dispatch = useDispatch();
  const tables = useSelector((state) => state?.auth?.tables);
  const tabSelected = useSelector((state) =>
    state?.relationTab?.tabs?.find((item) => item?.slug === tableSlug)
  );

  const filteredRelations = useMemo(() => {
    if (data?.table_id) {
      return data?.type;
    }
  }, [data]);

  const getRelatedTabeSlug = useMemo(() => {
    return relations?.find((el) => el?.id === selectedTab?.relation_id);
  }, [relations, selectedTab]);

  const relationFieldSlug = useMemo(() => {
    return relations.find((item) => item?.type === "Many2Dynamic");
  }, [relations]);

  const {fields, remove, append, update} = useFieldArray({
    control,
    name: "multi",
  });

  const relatedTableSlug = getRelatedTabeSlug?.relatedTable;

  const {
    data: {fieldsMap, views} = {
      views: [],
      fieldsMap: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", relatedTableSlug, i18n?.language],
    () => {
      return constructorTableService.getTableInfo(
        relatedTableSlug,
        {
          data: {},
        },
        params
      );
    },
    {
      select: ({data}) => {
        return {
          fieldsMap: listToMap(data?.fields),
          views: data?.views,
        };
      },
      enabled: !!relatedTableSlug,
    }
  );

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (index) => {
    setSelectedIndex(index);
    handleClose();
  };

  useEffect(() => {
    if (!selectedTab) {
      if (data?.tabs?.length > 0) {
        setSelectTab(data?.tabs?.[0]);
      }
    }
  }, [data, setSelectTab]);

  useEffect(() => {
    if (tabSelected?.slug) {
      setSelectedTabIndex(tabSelected?.tabIndex);
      setSelectTab(data?.tabs?.[tabSelected?.tabIndex]);
    } else {
      queryTab
        ? setSelectedTabIndex(parseInt(queryTab) - 1 ?? 0)
        : setSelectedTabIndex(0);
    }
  }, [queryTab, tabSelected, selectedTab, setSelectedTabIndex]);

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    setSelectedObjects([]);
    setFormVisible(false);
  }, [selectedTabIndex]);

  useEffect(() => {
    const result = {
      [filteredRelations?.id]: false,
    };

    setRelationsCreateFormVisible(result);
  }, [filteredRelations]);

  const setCreateFormVisible = (relationId, value) => {
    setRelationsCreateFormVisible((prev) => ({
      ...prev,
      [relationId]: value,
    }));
  };

  useEffect(() => {
    Boolean(getRelatedTabeSlug && relationFieldSlug) &&
      constructorObjectService
        .getList(
          getRelatedTabeSlug?.relatedTable,
          {
            data: {
              offset: 0,
              limit: 0,
              [`${relationFieldSlug?.relation_field_slug}.${tableSlug}_id`]:
                idFromParams,
            },
          },
          {
            language_setting: i18n?.language,
          }
        )
        .then((res) => {
          setJwtObjects(
            res?.data?.fields?.filter(
              (item) => item?.attributes?.object_id_from_jwt === true
            )
          );
        })
        .catch((a) => console.log("error", a));
  }, [getRelatedTabeSlug, idFromParams, relationFieldSlug, tableSlug]);

  useEffect(() => {
    let tableSlugsFromObj = jwtObjects?.map((item) => {
      return item?.table_slug;
    });

    let computeJwtObjs = tableSlugsFromObj?.map((item) => {
      return tables?.filter((table) => item === table?.table_slug);
    });

    setDefaultValuesFromJwt(
      computeJwtObjs?.map((item) => {
        return {
          [`${item?.[0]?.table_slug}_id`]: item?.[0]?.object_id,
        };
      })
    );
  }, [jwtObjects, tables]);

  const params = {
    language_setting: i18n?.language,
  };

  const computedVisibleFields = useMemo(() => {
    const mappedObjects = [];
    Object.values(fieldsMap)?.forEach((obj) => {
      if (obj.type === "LOOKUP" || obj.type === "LOOKUPS") {
        if (selectedTab?.attributes?.columns?.includes(obj.relation_id)) {
          mappedObjects.push(obj);
        }
      } else {
        if (selectedTab?.attributes?.columns?.includes(obj.id)) {
          mappedObjects.push(obj);
        }
      }
    });

    return mappedObjects.map((obj) => obj.id);
  }, [
    Object.values(fieldsMap)?.length,
    selectedTab?.attributes?.columns?.length,
  ]);

  return (
    <Box id="detailPageTabs">
      {data?.tabs?.length ? (
        <Tabs selectedIndex={selectedIndex} onSelect={handleTabChange}>
          <TabList>
            {visibleTabs?.map((item, index) => (
              <Tab
                onClick={() => {
                  dispatch(
                    relationTabActions.addTab({
                      slug: tableSlug,
                      tabIndex: index,
                    })
                  );
                  setSelectedIndex(index);
                }}
                key={item.id}
                className={styles.reactTabs}>
                {item.label}
              </Tab>
            ))}
            {moreTabs?.length > 0 && (
              <>
                <button onClick={handleMoreClick} className={styles.moreButton}>
                  Еще
                  <KeyboardArrowDownIcon />
                </button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <Box sx={{minWidth: "200px"}}>
                    {moreTabs?.map((item, index) => (
                      <MenuItem
                        sx={{
                          padding: "10px 15px",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#667085",
                        }}
                        key={item.id}
                        onClick={() => handleTabChange(maxVisibleTabs + index)}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Box>
                </Menu>
              </>
            )}
          </TabList>

          {data?.tabs?.map((item) => (
            <TabPanel style={{width: "100%", overflow: "auto"}} key={item.id}>
              {item?.type === "section" ? (
                <DetailPageSection
                  control={control}
                  item={item}
                  watch={watch}
                  selectedTab={selectedTab}
                  selectedIndex={selectedIndex}
                />
              ) : (
                <RelationTable
                  ref={myRef}
                  loader={loader}
                  remove={remove}
                  reset={reset}
                  selectedTabIndex={selectedTabIndex}
                  watch={watch}
                  view={getRelatedTabeSlug}
                  selectedTab={selectedTab}
                  control={control}
                  getValues={getValues}
                  setFormValue={setFormValue}
                  fields={fields}
                  setFormVisible={setFormVisible}
                  formVisible={formVisible}
                  key={selectedTab?.id}
                  relation={relations}
                  createFormVisible={relationsCreateFormVisible}
                  setCreateFormVisible={setCreateFormVisible}
                  selectedObjects={selectedObjects}
                  setSelectedObjects={setSelectedObjects}
                  tableSlug={tableSlug}
                  id={id}
                  type={type}
                  fieldsMap={fieldsMap}
                  relatedTable={relatedTable}
                  getAllData={getAllData}
                  layoutData={data}
                  computedVisibleFields={computedVisibleFields}
                  limit={limit}
                  setLimit={setLimit}
                  setOffset={setOffset}
                  offset={offset}
                  setCount={setCount}
                />
              )}
            </TabPanel>
          ))}
        </Tabs>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "calc(100vh - 200px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <CircularProgress size={50} sx={{color: "#449424"}} />
        </Box>
      )}
    </Box>
  );
}

export default DetailPageTabs;
