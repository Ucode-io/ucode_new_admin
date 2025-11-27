import styles from "@/views/Objects/TableView/styles.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import {Button, Divider, Menu} from "@mui/material";
import {add, differenceInDays, endOfMonth, set, startOfMonth} from "date-fns";
import React, {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useQueries, useQuery, useQueryClient} from "react-query";
import {useParams} from "react-router-dom";
import CRangePicker from "../../../components/DatePickers/CRangePicker";
import FiltersBlock from "../../../components/FiltersBlock";
import FRow from "../../../components/FormElements/FRow";
import HFSelect from "../../../components/FormElements/HFSelect";
import PageFallback from "../../../components/PageFallback";
import useFilters from "../../../hooks/useFilters";
import constructorObjectService from "../../../services/constructorObjectService";
import constructorViewService from "../../../services/constructorViewService";
import {getRelationFieldTabsLabel} from "../../../utils/getRelationFieldLabel";
import {listToMap} from "../../../utils/listToMap";
import listToOptions from "../../../utils/listToOptions";
import {selectElementFromEndOfString} from "../../../utils/selectElementFromEnd";
import ViewTabSelector from "../components/ViewTypeSelector";
import TimeLineBlock from "./TimeLineBlock";
import TimeLineGroupBy from "./TimeLineGroupBy";
import style from "./styles.module.scss";
import constructorTableService from "../../../services/constructorTableService";
import {useTranslation} from "react-i18next";
import listToLanOptions from "../../../utils/listToLanOptions";

export default function TimeLineView({
  view,
  selectedTabIndex,
  setSelectedTabIndex,
  views,
  selectedTable,
  setViews,
  isViewLoading,
}) {
  const {tableSlug} = useParams();
  const {filters} = useFilters(tableSlug, view.id);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const [dateFilters, setDateFilters] = useState([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);
  const {i18n} = useTranslation();

  const [fieldsMap, setFieldsMap] = useState({});
  const [dataFromQuery, setDataFromQuery] = useState([]);

  useEffect(() => {
    setSelectedView(views?.[selectedTabIndex] ?? {});
  }, [views, selectedTabIndex]);

  const groupFieldIds = view.group_fields;
  const groupFields = groupFieldIds
    .map((id) => fieldsMap[id])
    .filter((el) => el);

  const datesList = useMemo(() => {
    if (!dateFilters?.[0] || !dateFilters?.[1]) return [];

    const differenceDays = differenceInDays(dateFilters[1], dateFilters[0]);

    const result = [];
    for (let i = 0; i <= differenceDays; i++) {
      result.push(add(dateFilters[0], {days: i}));
    }
    return result;
  }, [dateFilters]);

  const recursionFunctionForAddIsOpen = (data) => {
    return data?.map((el) => {
      if (el?.data?.length) {
        return {
          ...el,
          isOpen: false,
          data: recursionFunctionForAddIsOpen(el?.data),
        };
      } else {
        return {
          ...el,
          isOpen: false,
        };
      }
    });
  };

  // FOR DATA
  const {data: {data} = {data: []}, isLoading} = useQuery(
    [
      "GET_OBJECTS_LIST_WITH_RELATIONS",
      {tableSlug, filters, dateFilters, view},
    ],
    () => {
      return constructorObjectService.getListV2(tableSlug, {
        data: {
          ...filters,
          view_type: "TIMELINE",
          gte: dateFilters[0],
          lte: dateFilters[1],
          with_relations: true,
          builder_service_view_id:
            view?.attributes?.group_by_columns?.length !== 0 ? view?.id : null,
        },
      });
    },
    {
      select: (res) => {
        const data = res.data?.response?.map((row) => ({
          ...row,
        }));
        return {
          data,
        };
      },
    }
  );
  useEffect(() => {
    if (data && JSON.stringify(data) !== JSON.stringify(dataFromQuery)) {
      setDataFromQuery((prevDataFromQuery) => {
        const newData = recursionFunctionForAddIsOpen(data);
        if (JSON.stringify(newData) !== JSON.stringify(prevDataFromQuery)) {
          return newData;
        }
        return prevDataFromQuery;
      });
    }
  }, [data, dataFromQuery]);

  // FOR TABLE INFO
  const {
    data: {fields, visibleColumns, visibleRelationColumns} = {data: []},
    isLoading: tableInfoLoading,
  } = useQuery(
    ["GET_TABLE_INFO", {tableSlug, filters, dateFilters}],
    () => {
      return constructorTableService.getTableInfo(tableSlug, {
        data: {},
      });
    },
    {
      cacheTime: 10,
      select: (res) => {
        const fields = res.data?.fields ?? [];
        const relationFields =
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [];
        const fieldsMap = listToMap([...fields, ...relationFields]);
        const data = res.data?.response?.map((row) => ({
          ...row,
        }));

        return {
          fieldsMap,
          data,
          fields,
          visibleColumns: res?.data?.fields ?? [],
          visibleRelationColumns:
            res?.data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
      onSuccess: (res) => {
        if (Object.keys(fieldsMap)?.length) return;
        setFieldsMap(res.fieldsMap);
      },
    }
  );

  const tabResponses = useQueries(queryGenerator(groupFields, filters));
  const tabs = tabResponses?.map((response) => response?.data);
  const [zoomPosition, setZoomPosition] = useState(2);

  const zoom = (e) => {
    if (e === "zoomin" && zoomPosition === 3) {
      return;
    } else if (e === "zoomout" && zoomPosition === 1) {
      return;
    } else if (e === "zoomin") {
      setZoomPosition(zoomPosition + 1);
    } else if (e === "zoomout") {
      setZoomPosition(zoomPosition - 1);
    }
  };

  const [anchorElType, setAnchorElType] = useState(null);
  const openType = Boolean(anchorElType);
  const handleClickType = (event) => {
    setAnchorElType(event.currentTarget);
  };
  const handleCloseType = () => {
    setAnchorElType(null);
  };

  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const openSettings = Boolean(anchorElSettings);
  const handleClickSettings = (event) => {
    setAnchorElSettings(event.currentTarget);
  };
  const handleCloseSettings = () => {
    setAnchorElSettings(null);
  };

  const [anchorElGroup, setAnchorElGroup] = useState(null);
  const openGroup = Boolean(anchorElGroup);
  const handleClickGroup = (event) => {
    setAnchorElGroup(event.currentTarget);
  };
  const handleCloseGroup = () => {
    setAnchorElGroup(null);
  };

  const types = [
    {
      title: "Day",
      value: "day",
    },
    {
      title: "Week",
      value: "week",
    },
    {
      title: "Month",
      value: "month",
    },
  ];

  const [selectedType, setSelectedType] = useState("day");

  const handleScrollClick = () => {
    const scrollToDiv = document.getElementById("todayDate");
    if (scrollToDiv) {
      scrollToDiv.scrollIntoView({behavior: "smooth"});
    }
  };

  const form = useForm({
    defaultValues: {
      calendar_from_slug: "",
      calendar_to_slug: "",
    },
  });

  const computedColumns = useMemo(() => {
    const filteredFields = fields?.filter(
      (el) => el?.type === "DATE" || el?.type === "DATE_TIME"
    );
    return listToOptions(filteredFields, "label", "slug");
  }, [fields]);

  const queryClient = useQueryClient();

  useEffect(() => {
    form.setValue("calendar_from_slug", view?.attributes?.calendar_from_slug);
    form.setValue("calendar_to_slug", view?.attributes?.calendar_to_slug);
    form.setValue("visible_field", view?.attributes?.visible_field);
  }, [view]);

  const saveSettings = () => {
    const computedData = {
      ...view,
      attributes: {
        ...view.attributes,
        calendar_from_slug: form.getValues("calendar_from_slug"),
        calendar_to_slug: form.getValues("calendar_to_slug"),
        visible_field: form.getValues("visible_field"),
      },
    };

    constructorViewService
      .update(tableSlug, {
        ...computedData,
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      });
  };

  useEffect(() => {
    if (selectedType === "month") {
      setZoomPosition(1);
    }
  }, [selectedType]);

  const computedColumnsFor = useMemo(() => {
    if (view.type !== "CALENDAR" && view.type !== "GANTT") {
      return visibleColumns;
    } else {
      return [...visibleColumns, ...visibleRelationColumns];
    }
  }, [visibleColumns, visibleRelationColumns, view.type]);

  const computedFelds = useMemo(() => {
    return fields?.map((el) => ({
      label: el?.attributes[`label_${i18n?.language}`],
      value: el["id"],
    }));
  }, [fields]);

  const [updateLoading, setUpdateLoading] = useState(false);

  const updateView = () => {
    setUpdateLoading(true);
    constructorViewService
      .update(tableSlug, {
        ...views?.[selectedTabIndex],
        attributes: {
          ...views?.[selectedTabIndex]?.attributes,
          group_by_columns: form
            .watch("group_fields")
            ?.filter((el) => el !== "" && el !== null && el !== undefined),
        },
        group_fields: form
          .watch("group_fields")
          ?.filter((el) => el !== "" && el !== null && el !== undefined),
      })
      .then(() => {})
      .finally(() => {
        setUpdateLoading(false);
        queryClient.refetchQueries(["GET_TABLE_INFO"]);
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries(["GET_OBJECTS_LIST_WITH_RELATIONS"]);
      });
  };
  useEffect(() => {
    form.setValue("group_fields", view?.group_fields);
  }, [view, form]);

  useEffect(() => {
    if (selectedType === "day") {
      setZoomPosition(2);
    }
  }, [selectedType]);

  return (
    <div>
      <FiltersBlock>
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
          setViews={setViews}
          selectedTable={selectedTable}
          settingsModalVisible={settingsModalVisible}
          setSettingsModalVisible={setSettingsModalVisible}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
      </FiltersBlock>

      <div
        className={style.search}
        style={{
          padding: "3px 10px",
          background: "#fff",
          borderBottom: "1px solid #E5E9EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}>
          <CRangePicker
            interval={"months"}
            value={dateFilters}
            onChange={setDateFilters}
          />
          <Button
            variant="text"
            sx={{
              margin: "0 5px",
              color: "#888",
            }}
            onClick={handleScrollClick}>
            Today
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}>
          <Divider orientation="vertical" flexItem />

          <Button
            onClick={handleClickType}
            style={{
              margin: "0 5px",
              color: "#888",
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}>
            <span>
              {types.find((item) => item.value === selectedType).title}
            </span>
            {openType ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Button>

          <Divider orientation="vertical" flexItem />

          <Menu
            open={openType}
            onClose={handleCloseType}
            anchorEl={anchorElType}
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
                  left: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                padding: "5px 0",
              }}>
              {types.map((el) => (
                <Button
                  onClick={() => setSelectedType(el.value)}
                  variant="text"
                  sx={{
                    margin: "0 5px",
                    color: "#888",
                    minWidth: "100px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  {el.title}
                  {el.value === selectedType && <CheckIcon />}
                </Button>
              ))}
            </div>
          </Menu>

          <Button
            onClick={handleClickSettings}
            style={{
              margin: "0 5px",
              color: "#888",
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}>
              <SettingsIcon />
              <span>Settings</span>
            </div>
            {openSettings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Button>

          <Divider orientation="vertical" flexItem />

          <Menu
            open={openSettings}
            onClose={handleCloseSettings}
            anchorEl={anchorElSettings}
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
                  left: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                minWidth: "200px",
                padding: "10px",
              }}>
              <div>
                <FRow label="Time from">
                  <HFSelect
                    options={computedColumns}
                    control={form.control}
                    name="calendar_from_slug"
                  />
                </FRow>
                <FRow label="Time to">
                  <HFSelect
                    options={computedColumns}
                    control={form.control}
                    name="calendar_to_slug"
                  />
                </FRow>
                <FRow label="Visible field">
                  <HFSelect
                    options={listToLanOptions(
                      fields,
                      "label",
                      "slug",
                      i18n?.language
                    )}
                    control={form.control}
                    name="visible_field"
                  />
                </FRow>
              </div>
              <Button variant="contained" onClick={saveSettings}>
                Save
              </Button>
            </div>
          </Menu>

          <Button
            onClick={handleClickGroup}
            style={{
              margin: "0 5px",
              color: "#888",
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}>
              <WorkspacesIcon />
              <span>Group</span>
            </div>
            {openGroup ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Button>

          <Divider orientation="vertical" flexItem />

          <Menu
            open={openGroup}
            onClose={handleCloseGroup}
            anchorEl={anchorElGroup}
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
                  left: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: "200px",
              }}>
              <TimeLineGroupBy
                columns={computedColumnsFor}
                isLoading={isLoading}
                updateLoading={updateLoading}
                updateView={updateView}
                selectedView={views?.[selectedTabIndex]}
                form={form}
              />
            </div>
          </Menu>

          <Button
            className={style.moreButton}
            onClick={() => zoom("zoomin")}
            style={{
              margin: "0 5px",
              color: "#888",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              width: "32px",
              height: "32px",
              padding: "0",
              minWidth: "32px",
            }}>
            <ZoomInIcon
              style={{
                color: "#888",
              }}
            />
          </Button>
          <Divider orientation="vertical" flexItem />
          <Button
            className={style.moreButton}
            onClick={() => zoom("zoomout")}
            style={{
              margin: "0 5px",
              color: "#888",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              width: "32px",
              height: "32px",
              padding: "0",
              minWidth: "32px",
            }}>
            <ZoomOutIcon
              style={{
                color: "#888",
              }}
            />
          </Button>
          <Divider orientation="vertical" flexItem />
        </div>
      </div>

      <div
        className={styles.wrapper}
        style={{
          height: "calc(100vh - 92px)",
        }}>
        {isLoading || tableInfoLoading || isViewLoading ? (
          <PageFallback />
        ) : (
          <TimeLineBlock
            setDataFromQuery={setDataFromQuery}
            dataFromQuery={dataFromQuery}
            handleScrollClick={handleScrollClick}
            isLoading={isLoading}
            computedColumnsFor={computedColumnsFor}
            view={view}
            dateFilters={dateFilters}
            setDateFilters={setDateFilters}
            zoomPosition={zoomPosition}
            data={data}
            selectedType={selectedType}
            fieldsMap={fieldsMap}
            datesList={datesList}
            tabs={tabs}
            calendar_from_slug={view?.attributes?.calendar_from_slug}
            calendar_to_slug={view?.attributes?.calendar_to_slug}
            visible_field={view?.attributes?.visible_field}
          />
        )}
      </div>
      {/* )} */}
    </div>
  );
}

const queryGenerator = (groupFields, filters = {}) => {
  return groupFields?.map((field) => promiseGenerator(field, filters));
};

const promiseGenerator = (groupField, filters = {}) => {
  const filterValue = filters[groupField.slug];
  const defaultFilters = filterValue ? {[groupField.slug]: filterValue} : {};

  const relationFilters = {};

  Object.entries(filters)?.forEach(([key, value]) => {
    if (!key?.includes(".")) return;

    if (key.split(".")?.pop() === groupField.slug) {
      relationFilters[key.split(".")?.pop()] = value;
      return;
    }

    const filterTableSlug = selectElementFromEndOfString({
      string: key,
      separator: ".",
      index: 2,
    });

    if (filterTableSlug === groupField.table_slug) {
      const slug = key.split(".")?.pop();

      relationFilters[slug] = value;
    }
  });
  const computedFilters = {...defaultFilters, ...relationFilters};

  if (groupField?.type === "PICK_LIST") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () => ({
        id: groupField.id,
        list: groupField.attributes?.options?.map((el) => ({
          ...el,
          label: el,
          value: el,
          slug: groupField?.slug,
        })),
      }),
    };
  }

  if (groupField?.type === "LOOKUP" || groupField?.type === "LOOKUPS") {
    const queryFn = () =>
      constructorObjectService.getListV2(
        groupField?.type === "LOOKUP"
          ? groupField.slug?.slice(0, -3)
          : groupField.slug?.slice(0, -4),
        {
          data: computedFilters ?? {},
        }
      );

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        {
          tableSlug:
            groupField?.type === "LOOKUP"
              ? groupField.slug?.slice(0, -3)
              : groupField.slug?.slice(0, -4),
          filters: computedFilters,
        },
      ],
      queryFn,
      select: (res) => {
        return {
          id: groupField.id,
          list: res.data?.response?.map((el) => ({
            ...el,
            label: getRelationFieldTabsLabel(groupField, el),
            value: el.guid,
            slug: groupField?.slug,
          })),
        };
      },
    };
  }
};
