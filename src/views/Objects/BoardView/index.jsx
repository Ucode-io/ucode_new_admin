import {useEffect, useId} from "react";
import {useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {useSelector} from "react-redux";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Container, Draggable} from "react-smooth-dnd";
import FiltersBlock from "../../../components/FiltersBlock";
import PageFallback from "../../../components/PageFallback";
import useFilters from "../../../hooks/useFilters";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorObjectService from "../../../services/constructorObjectService";
import {applyDrag} from "../../../utils/applyDrag";
import {getRelationFieldTabsLabel} from "../../../utils/getRelationFieldLabel";
import FastFilter from "../components/FastFilter";
import ViewTabSelector from "../components/ViewTypeSelector";
import BoardColumn from "./BoardColumn";
import styles from "./style.module.scss";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import {useTranslation} from "react-i18next";
import constructorViewService from "../../../services/constructorViewService";
import ColumnVisible from "../ColumnVisible";
import {useForm} from "react-hook-form";
import BoardGroupButton from "./BoardGroupBy";
import ShareModal from "../ShareModal/ShareModal";
import {Badge, Box, Button} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import {store} from "../../../store";
import style from "../style.module.scss";
import constructorTableService from "../../../services/constructorTableService";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import menuService from "../../../services/menuService";

const BoardView = ({
  view,
  setViews,
  selectedTabIndex,
  setSelectedTabIndex,
  views,
  fieldsMap,
  selectedTable,
  menuItem,
}) => {
  const visibleForm = useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {tableSlug, appId} = useParams();
  const {new_list} = useSelector((state) => state.filter);
  const id = useId();
  const {t} = useTranslation();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterCount, setFilterCount] = useState();

  const [selectedView, setSelectedView] = useState(null);
  const [tab, setTab] = useState();
  const {navigateToForm} = useTabRouter();
  const {filters} = useFilters(tableSlug, view.id);

  const [searchParams, setSearchParams] = useSearchParams();

  const navigateToSettingsPage = () => {
    const url = `/settings/constructor/apps/${appId}/objects/${menuItem?.table_id}/${menuItem?.data?.table.slug}`;
    navigate(url);
  };

  useEffect(() => {
    setSelectedView(views?.[selectedTabIndex] ?? {});
  }, [views, selectedTabIndex]);

  const {
    data = [],
    isLoading: dataLoader,
    refetch,
  } = useQuery(
    ["GET_OBJECT_LIST_ALL", {tableSlug, id, filters}],
    () => {
      return constructorObjectService.getListV2(tableSlug, {
        data: filters ?? {},
      });
    },
    {
      select: ({data}) => data.response ?? [],
    }
  );
  const updateView = (tabs) => {
    console.log("tabstabstabs", tabs);
    const computedData = {
      ...selectedView,
      attributes: {
        ...selectedView?.attributes,
        tabs,
      },
    };
    constructorViewService.update(tableSlug, computedData).then((res) => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMap[groupFieldId];

  const {data: tabs, isLoading: tabsLoader} = useQuery(
    queryGenerator(groupField, filters)
  );

  const loader = dataLoader || tabsLoader;

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug);
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(view?.attributes?.tabs, dropResult);
    if (result) {
      updateView(result);
    }
  };

  const {
    data: {visibleViews, visibleColumns, visibleRelationColumns} = {
      visibleViews: [],
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    isVisibleLoading,
  } = useQuery({
    queryKey: [
      "GET_TABLE_INFO",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return constructorTableService.getTableInfo(tableSlug, {
        data: {},
      });
    },
    select: (res) => {
      return {
        visibleViews: res?.data?.views ?? [],
        visibleColumns: res?.data?.fields ?? [],
        visibleRelationColumns:
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [],
      };
    },
  });

  // useEffect(() => {
  //   if (tabs) {
  //     updateView(tabs);
  //   }
  // }, []);

  return (
    <div>
      <FiltersBlock
        extra={
          <>
            <PermissionWrapperV2 tableSlug={tableSlug} type="share_modal">
              <ShareModal />
            </PermissionWrapperV2>

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
          setViews={setViews}
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

      <div className={style.extraNavbar}>
        <div className={style.extraWrapper}>
          <div className={style.search}>
            <Badge
              sx={{
                width: "35px",
                paddingLeft: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                setFilterVisible((prev) => !prev);
              }}
              badgeContent={view?.quick_filters?.length}
              color="primary">
              <FilterAltOutlinedIcon color={"#A8A8A8"} />
            </Badge>
          </div>
        </div>
        <ColumnVisible
          selectedTabIndex={selectedTabIndex}
          views={views}
          columns={visibleColumns}
          relationColumns={visibleRelationColumns}
          isLoading={isVisibleLoading}
          form={visibleForm}
          text={"Columns"}
          refetch={refetch}
        />
        <BoardGroupButton
          selectedTabIndex={selectedTabIndex}
          tabs={tabs}
          text="Group"
          queryGenerator={queryGenerator}
          groupField={groupField}
          filters={filters}
        />
      </div>

      {/* <FastFilter fieldsMap={fieldsMap} view={view} /> */}
      {loader ? (
        <PageFallback />
      ) : (
        <div className={styles.wrapper}>
          {(view?.quick_filters?.length > 0 ||
            (new_list[tableSlug] &&
              new_list[tableSlug].some((i) => i.checked))) && (
            <div
              className={
                filterVisible ? styles.filters : styles.filtersVisiblitiy
              }>
              <Box className={styles.block}>
                <p>{t("filters")}</p>
                <FastFilter view={view} fieldsMap={fieldsMap} isVertical />
              </Box>
            </div>
          )}

          <div className={styles.board}>
            <Container
              lockAxis="x"
              onDrop={onDrop}
              orientation="horizontal"
              dragHandleSelector=".column-header"
              dragClass="drag-card-ghost"
              dropClass="drag-card-ghost-drop"
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: "drag-cards-drop-preview",
              }}
              style={{display: "flex", gap: 24}}>
              {view?.attributes?.tabs?.map((tab) => (
                <Draggable key={tab.value}>
                  <BoardColumn
                    key={tab.value}
                    tab={tab}
                    data={data}
                    fieldsMap={fieldsMap}
                    view={view}
                    navigateToCreatePage={navigateToCreatePage}
                  />
                </Draggable>
              ))}
            </Container>
          </div>
        </div>
      )}
    </div>
  );
};

const queryGenerator = (groupField, filters = {}, updateView) => {
  if (!groupField)
    return {
      queryFn: () => {},
    };

  const filterValue = filters[groupField.slug];
  const computedFilters = filterValue ? {[groupField.slug]: filterValue} : {};

  if (groupField?.type === "PICK_LIST" || groupField?.type === "MULTISELECT") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () =>
        groupField?.attributes?.options?.map((el) => ({
          label: el.label,
          value: el.value,
          slug: groupField?.slug,
        })),
    };
  }

  if (groupField?.type === "LOOKUP") {
    const queryFn = () =>
      constructorObjectService.getListV2(groupField.table_slug, {
        data: computedFilters ?? {},
      });

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        {tableSlug: groupField.table_slug, filters: computedFilters},
      ],
      queryFn,
      select: (res) => {
        return res?.data?.response?.map((el) => ({
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        }));
      },
    };
  }
};

export default BoardView;
