import MultipleInsertButton from "@/views/Objects/components/MultipleInsertForm";
import {Add, InsertDriveFile} from "@mui/icons-material";
import {Card, Divider, Menu} from "@mui/material";
import {useEffect, useMemo, useRef, useState} from "react";
import {useFieldArray} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {useParams, useSearchParams} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import PageFallback from "../../../components/PageFallback";
import constructorTableService from "../../../services/constructorTableService";
import {listToMap} from "../../../utils/listToMap";
import FilesSection from "../FilesSection";
import NewMainInfo from "../NewMainInfo";
import CustomActionsButton from "../components/CustomActionsButton";
import FixColumnsRelationSection from "./FixColumnsRelationSection";
import ManyToManyRelationCreateModal from "./ManyToManyRelationCreateModal";
import RelationTable from "./RelationTable";
import VisibleColumnsButtonRelationSection from "./VisibleColumnsButtonRelationSection";
import styles from "./style.module.scss";
import {useDispatch, useSelector} from "react-redux";
import constructorObjectService from "../../../services/constructorObjectService";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import ExcelDownloadButton from "../components/ExcelButtons/ExcelDownloadButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {relationTabActions} from "../../../store/relationTab/relationTab.slice";

const NewRelationSection = ({
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
  errors,
  menuItem,
  data,
}) => {
  const {tableSlug: tableSlugFromParams, id: idFromParams, appId} = useParams();
  const tableSlug = tableSlugFromProps ?? tableSlugFromParams;
  const id = idFromProps ?? idFromParams;

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedManyToManyRelation, setSelectedManyToManyRelation] =
    useState(null);
  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState(
    {}
  );
  const [defaultValuesFromJwt, setDefaultValuesFromJwt] = useState({});
  const [jwtObjects, setJwtObjects] = useState([]);
  const {i18n} = useTranslation();
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [type, setType] = useState(null);
  const queryTab = searchParams.get("tab");
  const myRef = useRef();
  const dispatch = useDispatch();
  const tables = useSelector((state) => state?.auth?.tables);
  const tabSelected = useSelector((state) =>
    state?.relationTab?.tabs?.find((item) => item?.slug === tableSlug)
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const {fields, remove, append, update} = useFieldArray({
    control,
    name: "multi",
  });

  useEffect(() => {
    update();
  }, [update]);

  const selectedRelation = filteredRelations?.[selectedTabIndex];
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

  /*****************************JWT START*************************/

  const navigateToCreatePage = () => {
    let mapped = {
      [`${tableSlug}_id`]: idFromParams ?? "",
    };
    defaultValuesFromJwt.forEach((el) => {
      let keys = Object.keys(el);
      let values = Object.values(el);
      mapped[keys[0]] = values[0];
    });
    // const relation = filteredRelations[selectedTabIndex];
    if (getRelatedTabeSlug?.type === "Many2Many")
      setSelectedManyToManyRelation(getRelatedTabeSlug);
    else {
      append(mapped);
      setFormVisible(true);
    }
  };

  const computedSections = useMemo(() => {
    const sections = [];
    data?.tabs?.[selectedTabIndex]?.sections?.map((el) => {
      return !sections?.[el] && sections.push(el);
    });
    return sections;
  }, [data, selectedTabIndex]);

  const onSelect = (el) => {
    setType(el?.type);
    setSelectTab(el || relations[selectedTabIndex]);
  };

  /*****************************JWT END*************************/

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

  const isMultiLanguage = useMemo(() => {
    const allFields = [];
    selectedTab?.sections?.map((section) => {
      return section?.fields?.map((field) => {
        return allFields.push(field);
      });
    });
    return !!allFields.find((field) => field?.enable_multilanguage === true);
  }, [selectedTab]);

  const relatedTableSlug = getRelatedTabeSlug?.relatedTable;

  const params = {
    language_setting: i18n?.language,
  };

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
    <>
      {selectedManyToManyRelation && (
        <ManyToManyRelationCreateModal
          relation={selectedManyToManyRelation}
          closeModal={() => setSelectedManyToManyRelation(null)}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      {data ? (
        <Card className={styles.card}>
          <Tabs
            className={"react_detail"}
            selectedIndex={selectedTabIndex}
            onSelect={(index) => {
              setSelectedTabIndex(index);
            }}>
            {!data?.is_visible_section && (
              <div className={styles.cardHeader}>
                <TabList className={styles.tabList}>
                  {data?.tabs?.map((el, index) => (
                    <Tab
                      key={el.id}
                      className={`${styles.tabs_item} ${
                        selectedTabIndex === index
                          ? "custom-selected-tab"
                          : "custom-tab"
                      }`}
                      onClick={() => {
                        dispatch(
                          relationTabActions.addTab({
                            slug: tableSlug,
                            tabIndex: index,
                          })
                        );
                        setSelectedIndex(index);
                        onSelect(el);
                      }}>
                      {data?.view_relation_type === "FILE" && (
                        <>
                          <InsertDriveFile /> Файлы
                        </>
                      )}
                      <div className="flex align-center gap-2 text-nowrap">
                        {el?.type === "relation"
                          ? el?.relation?.attributes?.[
                              `label_to_${i18n?.language}`
                            ]
                          : el?.attributes?.[`label_${i18n?.language}`] ||
                            el?.label}
                      </div>
                    </Tab>
                  ))}
                </TabList>

                <div className="flex gap-2">
                  <CustomActionsButton
                    tableSlug={selectedRelation?.relatedTable}
                    selectedObjects={selectedObjects}
                    setSelectedObjects={setSelectedObjects}
                  />

                  {selectedTab?.relation?.type === "Many2Many" &&
                    relatedTable && (
                      <RectangleIconButton
                        color="success"
                        size="small"
                        onClick={navigateToCreatePage}
                        disabled={!id}>
                        <Add style={{color: "#007AFF"}} />
                      </RectangleIconButton>
                    )}

                  {data[selectedTabIndex]?.multiple_insert && (
                    <MultipleInsertButton
                      view={filteredRelations[selectedTabIndex]}
                      tableSlug={
                        filteredRelations[selectedTabIndex].relatedTable
                      }
                    />
                  )}

                  {getRelatedTabeSlug && (
                    <>
                      <FixColumnsRelationSection
                        relatedTable={getRelatedTabeSlug}
                        fieldsMap={fieldsMap}
                        getAllData={getAllData}
                      />
                      <Divider orientation="vertical" flexItem />
                      <VisibleColumnsButtonRelationSection
                        currentView={getRelatedTabeSlug}
                        fieldsMap={fieldsMap}
                        getAllData={getAllData}
                        selectedTabIndex={selectedTabIndex}
                        // refetch={refetch}
                        data={data}
                      />
                      <button
                        className={styles.moreButton}
                        onClick={handleClick}>
                        <MoreHorizIcon
                          style={{
                            color: "#888",
                          }}
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {loader ? (
              <PageFallback />
            ) : (
              data?.tabs?.map((el, index) => (
                <TabPanel key={el.id}>
                  {selectedTab?.type === "section" ? (
                    <NewMainInfo
                      control={control}
                      loader={loader}
                      isMultiLanguage={isMultiLanguage}
                      computedSections={computedSections}
                      setFormValue={setFormValue}
                      relatedTable={relatedTable}
                      relation={data}
                      selectedIndex={selectedIndex}
                      errors={errors}
                      watch={watch}
                    />
                  ) : data?.relatedTable === "file" ? (
                    <FilesSection
                      setFormValue={setFormValue}
                      remove={remove}
                      reset={reset}
                      watch={watch}
                      control={control}
                      formVisible={formVisible}
                      relation={data}
                      createFormVisible={relationsCreateFormVisible}
                      setCreateFormVisible={setCreateFormVisible}
                    />
                  ) : (
                    <RelationTable
                      ref={myRef}
                      loader={loader}
                      remove={remove}
                      reset={reset}
                      selectedTabIndex={selectedTabIndex}
                      watch={watch}
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
                    />
                  )}
                </TabPanel>
              ))
            )}
          </Tabs>
        </Card>
      ) : null}

      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              // width: 100,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}>
        <div className={styles.menuBar}>
          <ExcelDownloadButton
            computedVisibleFields={computedVisibleFields}
            view={views?.[0]}
            selectedTab={selectedTab}
            relatedTable={relatedTable}
          />
        </div>
      </Menu>
    </>
  );
};

export default NewRelationSection;
