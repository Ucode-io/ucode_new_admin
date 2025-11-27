import {InsertDriveFile} from "@mui/icons-material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Backdrop,
  Box,
  Button,
  Card,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import {useEffect, useMemo, useRef, useState} from "react";
import {useFieldArray} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {useParams, useSearchParams} from "react-router-dom";
import {Container, Draggable} from "react-smooth-dnd";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import PageFallback from "../../../components/PageFallback";
import constructorTableService from "../../../services/constructorTableService";
import layoutService from "../../../services/layoutService";
import {store} from "../../../store";
import {applyDrag} from "../../../utils/applyDrag";
import {listToMap} from "../../../utils/listToMap";
import FilesSection from "../FilesSection";
import MainInfoForModal from "../MainInfoForModal";
import FixColumnsRelationSection from "./FixColumnsRelationSection";
import ManyToManyRelationCreateModal from "./ManyToManyRelationCreateModal";
import RelationTable from "./RelationTable";
import VisibleColumnsButtonRelationSection from "./VisibleColumnsButtonRelationSection";
import styles from "./style.module.scss";
import menuService, {useMenuGetByIdQuery} from "../../../services/menuService";
import RingLoaderWithWrapper from "../../../components/Loaders/RingLoader/RingLoaderWithWrapper";

const RelationSectionForModal = ({
  selectedTabIndex,
  setSelectedTabIndex,
  relations,
  loader,
  tableSlug: tableSlugFromProps,
  id: idFromProps,
  limit,
  setLimit,
  relatedTable,
  control,
  reset,
  setFormValue,
  watch,
  setSelectTab,
  selectedTab,
  errors,
  getAllData,
  fieldsMap: fieldsMapFromProps,
  editAcces,
  setEditAccess,
  data,
  setData,
}) => {
  const {i18n} = useTranslation();
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [type, setType] = useState(null);
  // const [data, setData] = useState([]);
  let [searchParams] = useSearchParams();
  const queryTab = searchParams.get("tab");
  const myRef = useRef();
  const {tableSlug: tableSlugFromParams, id: idFromParams, appId} = useParams();
  const tableSlug = tableSlugFromProps ?? tableSlugFromParams;
  const id = idFromProps ?? idFromParams;

  const [selectedManyToManyRelation, setSelectedManyToManyRelation] =
    useState(null);
  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState(
    {}
  );

  const getRelatedTabeSlug = useMemo(() => {
    return relations?.find((el) => el?.id === selectedTab?.relation_id);
  }, [relations, selectedTab]);

  const relatedTableSlug = getRelatedTabeSlug?.relatedTable;

  const {fields, remove, update} = useFieldArray({
    control,
    name: "multi",
  });

  const setCreateFormVisible = (relationId, value) => {
    setRelationsCreateFormVisible((prev) => ({
      ...prev,
      [relationId]: value,
    }));
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
    setSelectTab(el ?? relations[selectedTabIndex]);
  };

  // useEffect(() => {
  //   layoutService.getLayout(tableSlug, appId).then((res) => {
  //     const layout = {
  //       ...res,
  //       tabs: res?.tabs?.filter(
  //         (tab) =>
  //           tab?.relation?.permission?.view_permission === true ||
  //           tab?.type === "section"
  //       ),
  //     };
  //     const layout2 = {
  //       ...layout,
  //       tabs: layout?.tabs?.map((tab) => {
  //         return {
  //           ...tab,
  //           sections: tab?.sections?.map((section) => {
  //             return {
  //               ...section,
  //               fields: section?.fields?.map((field) => {
  //                 if (field?.is_visible_layout === undefined) {
  //                   return {
  //                     ...field,
  //                     is_visible_layout: true,
  //                   };
  //                 } else {
  //                   return field;
  //                 }
  //               }),
  //             };
  //           }),
  //         };
  //       }),
  //     };
  //     setData(layout2);
  //   });
  // }, [tableSlug, menuItem?.table_id, i18n?.language, menuItem?.id]);

  const isMultiLanguage = useMemo(() => {
    const allFields = [];
    selectedTab?.sections?.map((section) => {
      return section?.fields?.map((field) => {
        return allFields.push(field);
      });
    });
    return !!allFields.find((field) => field?.enable_multilanguage === true);
  }, [selectedTab]);

  // useEffect(() => {
  //   if (data?.tabs?.length > 0) {
  //     setSelectTab(data?.tabs?.[0]);
  //   }
  // }, [data?.tabs, data]);

  useEffect(() => {
    queryTab
      ? setSelectedTabIndex(parseInt(queryTab) - 1)
      : setSelectedTabIndex(0);
  }, [queryTab, setSelectedTabIndex]);

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    setSelectedObjects([]);
    setFormVisible(false);
  }, [selectedTabIndex]);

  useEffect(() => {
    setRelationsCreateFormVisible({
      [data?.id]: false,
    });
  }, [data]);

  const {
    data: {fieldsMap} = {
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
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      select: ({data}) => {
        return {
          fieldsMap: listToMap(data?.fields),
        };
      },
      enabled: !!relatedTableSlug,
    }
  );

  const updateLayout = (newData) => {
    layoutService.update(newData, tableSlug);
  };

  const toggleTabs = (tab) => {
    const newTabs = {
      ...data,
      tabs: data?.tabs?.map((t) => {
        if (t?.id === tab?.id) {
          return {
            ...t,
            attributes: {
              ...t?.attributes,
              is_visible_layout: !t?.attributes?.is_visible_layout,
            },
          };
        } else {
          return t;
        }
      }),
    };
    // setData(newTabs);
    updateLayout(newTabs);
  };

  const onDrop = (dropResult, colNumber) => {
    const result = applyDrag(data?.tabs, dropResult);

    if (!result) return;

    const newTabs = {
      ...data,
      tabs: result,
    };

    setData(newTabs);
    updateLayout(newTabs);
  };

  const removeTab = (tab) => {
    const newTabs = {
      ...data,
      tabs: data?.tabs?.filter((t) => t?.id !== tab?.id),
    };
    setData(newTabs);
    updateLayout(newTabs);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addRelationTab = (relation) => {
    const newTabs = {
      ...data,
      tabs: [
        ...data?.tabs,
        {
          ...relation,
        },
      ],
    };
    setData(newTabs);
    updateLayout(newTabs);
  };

  // const getLayoutList = () => {
  //   layoutService
  //     .getLayout(tableSlug, menuId, {
  //       "table-slug": tableSlug,
  //       language_setting: i18n?.language,
  //     })
  //     .then((res) => {
  //       const layout = {
  //         ...res,
  //         tabs: res?.tabs?.filter(
  //           (tab) =>
  //             tab?.relation?.permission?.view_permission === true ||
  //             tab?.type === "section"
  //         ),
  //       };
  //       setData(layout);
  //     })
  //     .finally(() => {
  //       setSelectTab(relations[selectedTabIndex]);
  //     })
  // };

  // useEffect(() => {
  //   getLayoutList();
  // }, [tableSlug, menuItem?.table_id, i18n?.language]);

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

      <Card className={styles.card}>
        <Tabs
          className={"react_detail"}
          selectedIndex={selectedTabIndex}
          style={{
            height: "100%",
            padding: "0 5px",
          }}
          onSelect={(index) => {
            setSelectedTabIndex(index);
          }}>
          {!data?.is_visible_section && (
            <div className={styles.cardHeader}>
              <TabList className={styles.tabList}>
                <Container
                  groupName="1"
                  onDrop={onDrop}
                  orientation="horizontal"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  dropPlaceholder={{className: "drag-row-drop-preview"}}
                  getChildPayload={(i) => data?.tabs?.[i] ?? {}}>
                  {data?.tabs?.map((el, index) =>
                    editAcces ? (
                      <Draggable
                        key={el.id}
                        style={{display: "flex", alignItems: "center"}}>
                        <>
                          <Tab
                            key={el.id}
                            className={`${styles.tabs_item} ${
                              selectedTabIndex === index
                                ? "custom-selected-tab"
                                : "custom-tab"
                            }`}
                            onClick={() => {
                              setSelectedIndex(index);
                              onSelect(el);
                            }}
                            style={{
                              marginRight: "0",
                            }}>
                            {data?.view_relation_type === "FILE" && (
                              <>
                                <InsertDriveFile /> Файлы
                              </>
                            )}
                            <div className="flex align-center gap-2 text-nowrap">
                              {(el?.relation &&
                                el?.relation?.table_from?.label) ||
                                el?.relation?.attributes?.[
                                  `label_to_${i18n?.language}`
                                ] ||
                                el?.attributes?.[`label_${i18n.language}`] ||
                                el?.relation?.attributes?.[
                                  `label_${i18n.language}`
                                ] ||
                                el?.label ||
                                el?.title}
                            </div>
                          </Tab>

                          <Button
                            onClick={() => removeTab(el)}
                            sx={{
                              height: "38px",
                              minWidth: "38px",
                              width: "38px",
                              borderRadius: "50%",
                            }}>
                            {/* {el?.attributes?.is_visible_layout || el?.attributes?.is_visible_layout === undefined ? <VisibilityOffIcon /> : <VisibilityIcon />} */}
                            <DeleteIcon
                              style={{
                                color: "red",
                              }}
                            />
                          </Button>

                          <Divider orientation="vertical" flexItem />
                        </>
                      </Draggable>
                    ) : (
                      (el?.attributes?.is_visible_layout ||
                        el?.attributes?.is_visible_layout === undefined) && (
                        <Tab
                          key={el.id}
                          className={`${styles.tabs_item} ${
                            selectedTabIndex === index
                              ? "custom-selected-tab"
                              : "custom-tab"
                          }`}
                          onClick={() => {
                            setSelectedIndex(index);
                            onSelect(el);
                          }}>
                          {data?.view_relation_type === "FILE" && (
                            <>
                              <InsertDriveFile /> Файлы
                            </>
                          )}
                          <div className="flex align-center gap-2 text-nowrap">
                            {(el?.relation &&
                              el?.relation?.table_from?.label) ||
                              el?.relation?.attributes?.[
                                `label_to_${i18n?.language}`
                              ] ||
                              el?.attributes?.[`label_${i18n.language}`] ||
                              el?.relation?.attributes?.[
                                `label_${i18n.language}`
                              ] ||
                              el?.label ||
                              el?.title}
                          </div>
                        </Tab>
                      )
                    )
                  )}
                </Container>

                {editAcces && relations?.length > 0 && (
                  <>
                    <Button
                      variant="outlined"
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                      sx={{
                        marginLeft: "10px",
                        height: "32px",
                        minWidth: "32px",
                        width: "32px",
                        maxWidth: "32px",
                      }}>
                      <AddRoundedIcon />
                    </Button>

                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}>
                      {relations?.map((relation) => (
                        <MenuItem
                          onClick={() => {
                            addRelationTab(relation);
                            handleClose();
                          }}>
                          {
                            relation?.attributes?.[
                              `label_from_${i18n.language}`
                            ]
                          }
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                )}
              </TabList>
              {editAcces ? (
                <SecondaryButton
                  onClick={() => setEditAccess((prev) => !prev)}
                  color=""
                  style={{
                    right: "16px",
                    border: "0px solid #2d6ce5",
                    padding: "4px",
                  }}>
                  <CloseIcon
                    style={{
                      color: "red",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                </SecondaryButton>
              ) : (
                <SecondaryButton
                  onClick={() => setEditAccess((prev) => !prev)}
                  color=""
                  style={{
                    right: "16px",
                    border: "0px solid #2d6ce5",
                    padding: "4px",
                  }}>
                  <EditIcon
                    style={{
                      color: "#2d6ce5",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                </SecondaryButton>
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
                    // getLayoutList={getLayoutList}
                    selectedTabIndex={selectedTabIndex}
                    data={data}
                  />
                </>
              )}
            </div>
          )}

          <Box
            sx={{
              height: "100%",
            }}>
            {loader ? (
              <RingLoaderWithWrapper />
            ) : (
              data?.tabs?.map((el) => (
                <TabPanel
                  key={el.id}
                  style={{
                    minHeight: "100%",
                  }}>
                  {!selectedTab?.relation_id ? (
                    <MainInfoForModal
                      control={control}
                      selectedTabIndex={selectedTabIndex}
                      loader={loader}
                      isMultiLanguage={isMultiLanguage}
                      computedSections={computedSections}
                      setFormValue={setFormValue}
                      relatedTable={relatedTable}
                      relation={data}
                      selectedIndex={selectedIndex}
                      errors={errors}
                      remove={remove}
                      editAcces={editAcces}
                      setData={setData}
                      data={data}
                      fieldsMapFromProps={fieldsMapFromProps}
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
                      key={data.id}
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
                      setFormValue={setFormValue}
                      fields={fields}
                      setFormVisible={setFormVisible}
                      formVisible={formVisible}
                      key={selectedTab.id}
                      relation={relations}
                      getRelatedTabeSlug={getRelatedTabeSlug}
                      createFormVisible={relationsCreateFormVisible}
                      setCreateFormVisible={setCreateFormVisible}
                      selectedObjects={selectedObjects}
                      setSelectedObjects={setSelectedObjects}
                      tableSlug={tableSlug}
                      id={id}
                      getAllData={getAllData}
                      type={type}
                      layoutData={data}
                    />
                  )}
                </TabPanel>
              ))
            )}
          </Box>
        </Tabs>
      </Card>
    </>
  );
};

export default RelationSectionForModal;
