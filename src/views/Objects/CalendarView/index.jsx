import {
  add,
  differenceInDays,
  endOfWeek,
  format,
  getDate,
  startOfWeek,
} from "date-fns";
import {useEffect, useMemo, useState} from "react";
import {useQueries, useQuery, useQueryClient} from "react-query";
import {useNavigate, useParams} from "react-router-dom";
import FiltersBlock from "../../../components/FiltersBlock";
import PageFallback from "../../../components/PageFallback";
import useFilters from "../../../hooks/useFilters";
import constructorObjectService from "../../../services/constructorObjectService";
import {getRelationFieldTabsLabel} from "../../../utils/getRelationFieldLabel";
import {listToMap, listToMapForCalendar} from "../../../utils/listToMap";
import {selectElementFromEndOfString} from "../../../utils/selectElementFromEnd";
import ViewTabSelector from "../components/ViewTypeSelector";
import style from "./style.module.scss";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import {useTranslation} from "react-i18next";
import SettingsIcon from "@mui/icons-material/Settings";
import CSelect from "../../../components/CSelect";
import CalendarDay from "./CalendarDay";
import {Box, Button} from "@mui/material";
import CalendarDayRange from "./DateDayRange";
import CalendarWeekRange from "./CalendarWeek/CalendarWeekRange";
import CalendarWeek from "./CalendarWeek";
import Calendar from "./Calendar";
import CalendarMonth from "./CalendarMonth";
import CalendarMonthRange from "./CalendarMonth/CalendarMonthRange";
import ColumnVisible from "../ColumnVisible";
import {useForm} from "react-hook-form";
import CalendarSettingsVisible from "./CalendarSettings";
import {dateFormat} from "../../../utils/dateFormat";
import {FromDateType, ToDateType} from "../../../utils/getDateType";
import CalendarSceduleVisible from "./CalendarSceduleVisible";
import CalendarGroupByButton from "./CalendarGroupColumns";
import ShareModal from "../ShareModal/ShareModal";
import constructorViewService from "../../../services/constructorViewService";

const formatDate = [
  {
    value: "DAY",
    label: "Day",
  },
  {
    value: "WEEK",
    label: "Week",
  },
  {
    value: "MONTH",
    label: "Month",
  },
];

const CalendarView = ({
  view,
  selectedTabIndex,
  setSelectedTabIndex,
  views,
  selectedTable,
  menuItem,
}) => {
  const queryClient = useQueryClient();
  const visibleForm = useForm();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {tableSlug, appId} = useParams();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const [dateFilters, setDateFilters] = useState([
    startOfWeek(new Date(), {weekStartsOn: 1}),
    endOfWeek(new Date(), {weekStartsOn: 1}),
  ]);
  const [fieldsMap, setFieldsMap] = useState({});
  const [date, setDate] = useState(
    views?.[selectedTabIndex]?.attributes?.period ?? "MONTH"
  );

  const [tab, setTab] = useState();
  const [currentDay, setCurrentDay] = useState(new Date());
  const [weekDates, setWeekDates] = useState(new Date());
  const [currentMonthDates, setCurrentMonthDates] = useState([]);
  const [firstDate, setFirstDate] = useState();
  const [lastDate, setLastDate] = useState();
  const currentUpdatedDate = dateFormat(currentDay, 0);
  const tomorrow = dateFormat(currentDay, 1);
  const lastUpdatedDate = dateFormat(lastDate, 1);
  const firstUpdatedDate = dateFormat(firstDate, 0);

  const navigateToSettingsPage = () => {
    const url = `/settings/constructor/apps/${appId}/objects/${menuItem?.table_id}/${menuItem?.data?.table.slug}`;
    navigate(url);
  };

  const startWeek = (date) => {
    const currentDayOfWeek = date.getDay();
    const start = new Date(date);
    start.setDate(date.getDate() - currentDayOfWeek + 1);
    return start;
  };
  const startOfMonth = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    if (start.getDay() !== 0) {
      start.setDate(1 - start.getDay());
    }
    return start;
  };

  useEffect(() => {
    const newWeekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startWeek(currentDay));
      day.setDate(startWeek(currentDay).getDate() + i);
      newWeekDates && newWeekDates.push(day);
    }
    setWeekDates(newWeekDates);
  }, [currentDay]);

  useEffect(() => {
    const newMonthDates = [];
    for (let i = 0; i < 35; i++) {
      const day = new Date(startOfMonth(currentDay));
      day.setDate(startOfMonth(currentDay).getDate() + i);
      newMonthDates.push(day);
    }

    setCurrentMonthDates(newMonthDates);
  }, [currentDay]);

  const datesList = useMemo(() => {
    if (!dateFilters?.[0] || !dateFilters?.[1]) return;

    const differenceDays = differenceInDays(dateFilters[1], dateFilters[0]);

    const result = [];
    for (let i = 0; i <= differenceDays; i++) {
      result.push(add(dateFilters[0], {days: i}));
    }
    return result;
  }, [dateFilters]);

  const {filters, dataFilters} = useFilters(tableSlug, view.id);
  const groupFieldIds = view.group_fields;
  const groupFields = groupFieldIds
    .map((id) => fieldsMap[id])
    .filter((el) => el);

  const {data: {data} = {data: []}, isLoading} = useQuery(
    [
      "GET_OBJECTS_LIST_WITH_RELATIONS",
      {tableSlug, dataFilters, currentUpdatedDate, firstUpdatedDate, date},
    ],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: {
          with_relations: true,
          [view.calendar_from_slug]: {
            $gte:
              FromDateType(date, currentUpdatedDate, firstUpdatedDate) ?? "",
            $lt: ToDateType(date, tomorrow, lastUpdatedDate) ?? "",
          },
          view_type: "CALENDAR",
          ...dataFilters,
        },
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
        const fieldsMap = listToMapForCalendar([...fields, ...relationFields]);
        const data = res.data?.response?.map((row) => ({
          ...row,
          calendar: {
            date: row[view.calendar_from_slug]
              ? format(new Date(row[view.calendar_from_slug]), "dd.MM.yyyy")
              : null,
            elementFromTime: row[view.calendar_from_slug]
              ? new Date(row[view.calendar_from_slug])
              : null,
            elementToTime: row[view.calendar_to_slug]
              ? new Date(row[view.calendar_to_slug])
              : null,
          },
        }));
        return {
          fieldsMap,
          data,
        };
      },
      onSuccess: (res) => {
        if (Object.keys(fieldsMap)?.length) return;
        setFieldsMap(res.fieldsMap);
      },
    }
  );
  console.log("currentUpdatedDate", currentUpdatedDate);
  const {data: workingDays} = useQuery(
    [
      "GET_OBJECTS_LIST",
      view?.disable_dates?.table_slug,
      currentDay,
      firstDate,
    ],
    () => {
      if (!view?.disable_dates?.table_slug) return {};

      return constructorObjectService.getList(view?.disable_dates?.table_slug, {
        data: {
          [view.disable_dates.day_slug]: {
            $gte:
              FromDateType(date, currentUpdatedDate, firstUpdatedDate) ?? "",
            $lt: ToDateType(date, tomorrow, lastUpdatedDate) ?? "",
          },
        },
      });
    },
    {
      select: (res) => {
        const result = {};
        res?.data?.response?.forEach((el) => {
          const date = el[view?.disable_dates?.day_slug];
          const calendarFromTime = el[view?.disable_dates?.time_from_slug];
          const calendarToTime = el[view?.disable_dates?.time_to_slug];

          if (date) {
            const formattedDate = format(new Date(date), "dd.MM.yyyy");

            if (!result[formattedDate]?.[0]) {
              result[formattedDate] = [
                {
                  ...el,
                  calendarFromTime,
                  calendarToTime,
                },
              ];
            } else {
              result[formattedDate].push({
                ...el,
                calendarFromTime,
                calendarToTime,
              });
            }
          }
        });

        return result;
      },
    }
  );

  const {
    data: {visibleViews, visibleColumns, visibleRelationColumns} = {
      visibleViews: [],
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    isVisibleLoading,
    refetch: refetchViews,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS_AT_VIEW_SETTINGS", {tableSlug}],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: {limit: 10, offset: 0},
      });
    },
    {
      select: ({data}) => {
        return {
          visibleViews: data?.views ?? [],
          visibleColumns: data?.fields ?? [],
          visibleRelationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  const updateView = (period) => {
    constructorViewService
      .update(tableSlug, {
        ...views?.[selectedTabIndex],
        attributes: {
          ...views?.[selectedTabIndex]?.attributes,
          period: period,
        },
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      });
  };

  const tabResponses = useQueries(queryGenerator(groupFields, filters));
  const tabs = tabResponses?.map((response) => response?.data);
  const tabLoading = tabResponses?.some((response) => response?.isLoading);

  return (
    <div>
      <FiltersBlock
        extra={
          <>
            <PermissionWrapperV2 tableSlug={tableSlug} type="share_modal">
              <ShareModal />
            </PermissionWrapperV2>

            {/* <PermissionWrapperV2 tableSlug={tableSlug} type="language_btn">
              <LanguagesNavbar />
            </PermissionWrapperV2>

            <PermissionWrapperV2 tableSlug={tableSlug} type="automation">
              <Button variant="outlined">
                <HexagonIcon />
              </Button>
            </PermissionWrapperV2> */}

            <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
              <Button
                variant="outlined"
                onClick={navigateToSettingsPage}
                style={{
                  borderColor: "#A8A8A8",
                  width: "35px",
                  height: "35px",
                  padding: "0px",
                  minWidth: "35px",
                }}>
                <SettingsIcon
                  style={{
                    color: "#A8A8A8",
                  }}
                />
              </Button>
            </PermissionWrapperV2>
          </>
        }>
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
          selectedTable={selectedTable}
          settingsModalVisible={settingsModalVisible}
          setSettingsModalVisible={setSettingsModalVisible}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          setTab={setTab}
        />
      </FiltersBlock>
      <Box className={style.navbar}>
        {date === "DAY" && (
          <CalendarDayRange
            datesList={datesList}
            formatDate={formatDate}
            date={date}
            currentDay={currentDay}
            setCurrentDay={setCurrentDay}
          />
        )}
        {date === "WEEK" && (
          <CalendarWeekRange
            formatDate={formatDate}
            date={date}
            setCurrentDay={setCurrentDay}
            currentDay={currentDay}
            weekDates={weekDates}
            setFirstDate={setFirstDate}
            firstDate={firstDate}
            setLastDate={setLastDate}
            lastDate={lastDate}
            setWeekDates={setWeekDates}
          />
        )}
        {date === "MONTH" && (
          <CalendarMonthRange
            formatDate={formatDate}
            date={date}
            setCurrentDay={setCurrentDay}
            currentDay={currentDay}
          />
        )}
        <Box className={style.extra}>
          <CSelect
            value={date}
            options={formatDate}
            disabledHelperText
            onChange={(e) => {
              setDate(e.target.value);
              updateView(e.target?.value);
            }}
          />
          <CalendarGroupByButton
            selectedTabIndex={selectedTabIndex}
            text="Group"
            width="105px"
            views={visibleViews}
            columns={visibleColumns}
            relationColumns={visibleRelationColumns}
            isLoading={isVisibleLoading}
          />
          <CalendarSceduleVisible
            selectedTabIndex={selectedTabIndex}
            views={visibleViews}
            columns={visibleColumns}
            isLoading={isVisibleLoading}
            text={"Schedule"}
            initialValues={view}
          />
          <ColumnVisible
            selectedTabIndex={selectedTabIndex}
            views={visibleViews}
            columns={visibleColumns}
            relationColumns={visibleRelationColumns}
            isLoading={isVisibleLoading}
            form={visibleForm}
            text={"Columns"}
          />
          <CalendarSettingsVisible
            selectedTabIndex={selectedTabIndex}
            views={visibleViews}
            columns={visibleColumns}
            isLoading={isVisibleLoading}
            text={"Settings"}
            initialValues={view}
          />
        </Box>
      </Box>
      {isLoading || tabLoading ? (
        <PageFallback />
      ) : (
        <>
          {date === "DAY" && (
            <CalendarDay
              data={data}
              fieldsMap={fieldsMap}
              datesList={[currentDay]}
              view={view}
              tabs={tabs}
              workingDays={workingDays}
            />
          )}
          {date === "WEEK" && (
            <CalendarWeek
              data={data}
              fieldsMap={fieldsMap}
              datesList={weekDates?.length && weekDates}
              view={view}
              tabs={tabs}
              workingDays={workingDays}
            />
          )}
          {date === "MONTH" && (
            <CalendarMonth
              data={data}
              fieldsMap={fieldsMap}
              datesList={currentMonthDates?.length && currentMonthDates}
              view={view}
              tabs={tabs}
              workingDays={workingDays}
            />
          )}
          {date !== "WEEK" && date !== "DAY" && date !== "MONTH" ? (
            <Calendar
              data={data}
              fieldsMap={fieldsMap}
              datesList={datesList}
              view={view}
              tabs={tabs}
              workingDays={workingDays}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

// ========== UTILS==========

const queryGenerator = (groupFields, filters = {}) => {
  return groupFields?.map((field) => promiseGenerator(field, filters));
};

const promiseGenerator = (groupField, filters = {}) => {
  const filterValue = filters[groupField.slug] ?? filters;
  const defaultFilters = filterValue ? {[groupField.slug]: filterValue} : {};
  const relationFilters = {};

  Object.entries(filters)?.forEach(([key, value]) => {
    if (!key?.includes(".")) return;

    const filterTableSlug = selectElementFromEndOfString({
      string: key,
      separator: ".",
      index: 2,
    });

    const slug = key.split(".")?.pop();

    if (filterTableSlug === groupField.table_slug) {
      const slug = key.split(".")?.pop();
      relationFilters[slug] = value;
    } else {
      if (groupField.slug === slug) {
        const slug = key.split(".")?.pop();
        relationFilters[slug] = value;
      }
    }
  });

  const objectSlug = Object.keys(filters)?.[0]?.split(".").pop();
  const slugValue = Object.values(filters)?.[0];
  const computedFilters = {...defaultFilters, ...relationFilters};
  const computedFilterValue = {[objectSlug]: slugValue};
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
          data: computedFilterValue,
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
      select: (res) => ({
        id: groupField.id,
        list: res.data?.response?.map((el) => ({
          ...el,
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        })),
      }),
    };
  }
};

export default CalendarView;
