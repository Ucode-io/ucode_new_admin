import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import FunctionsIcon from "@mui/icons-material/Functions";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import SortByAlphaOutlinedIcon from "@mui/icons-material/SortByAlphaOutlined";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import WrapTextOutlinedIcon from "@mui/icons-material/WrapTextOutlined";
import {Button, Menu} from "@mui/material";
import React, {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import constructorFieldService from "../../services/constructorFieldService";
import constructorViewService from "../../services/constructorViewService";
import relationService from "../../services/relationService";
import {paginationActions} from "../../store/pagination/pagination.slice";
import {CTableHeadCell} from "../CTable";
import "./style.scss";

export default function TableHeadForTableView({
  column,
  index,
  pageName,
  tableSize,
  tableSettings,
  sortedDatas,
  selectedView,
  setDrawerState,
  isRelationTable,
  setDrawerStateField,
  setSortedDatas,
  view,
  calculateWidthFixedColumn,
  handlePin,
  handleAutoSize,
  popupRef,
  columnId,
  setColumnId,
  setCurrentColumnWidth,
  isTableView,
  FilterGenerator,
  filterChangeHandler,
  filters,
  tableSlug,
  disableFilters,
  currentView,
  setFieldCreateAnchor,
  setFieldData,
  refetch,
  relatedTable,
  fieldsMap,
  getAllData = () => {},
  relationAction,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(null);
  const queryClient = useQueryClient();
  const open = Boolean(anchorEl);
  const summaryIsOpen = Boolean(summaryOpen);
  const {i18n} = useTranslation();
  const dispatch = useDispatch();
  const permissions = useSelector(
    (state) => state.auth.permissions?.[tableSlug]
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSummaryOpen = (event) => {
    setSummaryOpen(event.currentTarget);
  };
  const handleSummaryClose = () => {
    setSummaryOpen(null);
    handleClose();
  };

  const fixColumnChangeHandler = (column, e) => {
    const computedData = {
      ...currentView,
      attributes: {
        ...currentView?.attributes,
        fixedColumns: {
          ...currentView?.attributes?.fixedColumns,
          [column.id]: e,
        },
      },
    };

    constructorViewService.update(tableSlug, computedData).then((res) => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  const textWrapChangeHandler = (column, e) => {
    const computedData = {
      ...currentView,
      attributes: {
        ...currentView?.attributes,
        textWrap: {
          ...currentView?.attributes?.textWrap,
          [column.id]: e,
        },
      },
    };

    constructorViewService.update(tableSlug, computedData).then((res) => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  const updateView = (column) => {
    constructorViewService
      .update(tableSlug, {
        ...currentView,
        columns: currentView?.columns?.filter((item) => item !== column),
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries("GET_VIEWS_AND_FIELDS", {tableSlug});
      });
  };

  const updateRelationView = (data) => {
    relationService.update(data, view?.relatedTable).then((res) => {
      getAllData();
      handleSummaryClose();
    });
  };

  const deleteField = (column) => {
    constructorFieldService.delete(column, tableSlug).then((res) => {
      constructorViewService
        .update(tableSlug, {
          ...currentView,
          columns: currentView?.columns?.filter((item) => item !== column),
        })
        .then(() => {
          queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
          queryClient.refetchQueries("GET_OBJECTS_LIST", {tableSlug});
        });
    });
  };

  const computedViewSummaries = useMemo(() => {
    if (
      view?.attributes?.summaries?.find(
        (item) => item?.field_name === column?.id
      )
    )
      return true;
    else return false;
  }, [view?.attributes?.summaries, column]);

  const menu = [
    {
      id: 1,
      children: [
        {
          id: 2,
          title: "Edit field",
          icon: <CreateOutlinedIcon />,
          onClickAction: (e) => {
            setFieldCreateAnchor(e.currentTarget);
            setFieldData(column);
            if (column?.attributes?.relation_data?.id) {
              queryClient.refetchQueries([
                "RELATION_GET_BY_ID",
                {tableSlug, id: column?.attributes?.relation_data?.id},
              ]);
            }
          },
        },
      ],
    },
    {
      id: 7,
      children: [
        {
          id: 8,
          title: `Sort ${
            sortedDatas?.find((item) => item.field === column.id)?.order ===
            "ASC"
              ? "Z -> A"
              : "A -> Z"
          }`,
          icon: <SortByAlphaOutlinedIcon />,
          onClickAction: () => {
            const field = column.id;
            const order =
              sortedDatas?.find((item) => item.field === column.id)?.order ===
              "ASC"
                ? "DESC"
                : "ASC";
            dispatch(
              paginationActions.setSortValues({tableSlug, field, order})
            );
            setSortedDatas((prev) => {
              const newSortedDatas = [...prev];
              const index = newSortedDatas.findIndex(
                (item) => item.field === column.id
              );
              if (index !== -1) {
                newSortedDatas[index].order =
                  newSortedDatas[index].order === "ASC" ? "DESC" : "ASC";
              } else {
                newSortedDatas.push({
                  field: column.id,
                  order: "ASC",
                });
              }
              return newSortedDatas;
            });
          },
        },
        {
          id: 18,
          title: computedViewSummaries ? `Unset Summary` : "Add Summary",
          icon: <PlaylistAddCircleIcon />,
          arrowIcon: <KeyboardArrowRightIcon />,
          onClickAction: (e) => {
            if (computedViewSummaries) {
              handleAddSummary(column, "unset");
            } else {
              handleSummaryOpen(e);
            }
          },
        },
        {
          id: 19,
          title: `${
            view?.attributes?.textWrap?.[column?.id] ? "Unwrap" : "Wrap"
          } text`,
          icon: view?.attributes?.textWrap?.[column?.id] ? (
            <WrapTextOutlinedIcon />
          ) : (
            <AlignHorizontalLeftIcon />
          ),
          onClickAction: () => {
            textWrapChangeHandler(
              column,
              !view?.attributes?.textWrap?.[column?.id] ? true : false
            );
          },
        },
        {
          id: 10,
          title: `${
            view?.attributes?.fixedColumns?.[column?.id] ? "Unfix" : "Fix"
          } column`,
          icon: <ViewWeekOutlinedIcon />,
          onClickAction: () => {
            fixColumnChangeHandler(
              column,
              !view?.attributes?.fixedColumns?.[column?.id] ? true : false
            );
          },
        },
      ],
    },
    {
      id: 12,
      children: [
        {
          id: 13,
          title: "Hide field",
          icon: <VisibilityOffOutlinedIcon />,
          onClickAction: () => {
            updateView(column.id);
          },
        },

        {
          id: 14,
          title: "Delete field",
          icon: <DeleteOutlinedIcon />,
          onClickAction: () => {
            deleteField(column.id);
          },
        },
      ],
    },
  ];

  const formulaTypes = [
    {
      icon: <FunctionsIcon />,
      id: 1,
      label: "Sum ()",
      value: "sum",
    },
    {
      icon: <FunctionsIcon />,
      id: 1,
      label: "Avg ()",
      value: "avg",
    },
  ];

  const handleAddSummary = (item, type) => {
    let result = [];

    if (type === "add") {
      const newSummary = {
        field_name: column?.id,
        formula_name: item?.value,
      };
      result = Array.from(
        new Map(
          [newSummary, ...(view?.attributes?.summaries ?? [])]?.map((item) => [
            item.field_name,
            item,
          ])
        ).values()
      );
    } else if (type === "unset") {
      result = view?.attributes?.summaries?.filter(
        (element) => element?.field_name !== item?.id
      );
    }

    const computedValues = {
      ...view,
      attributes: {
        ...view?.attributes,
        summaries: result ?? [],
      },
    };

    const relationData = {
      ...relationAction?.relation,
      table_from: relationAction?.relation?.table_from?.slug,
      table_to: relationAction?.relation?.table_to?.slug,
    };

    const computedValuesForRelationView = {
      ...relatedTable,
      ...relationData,
      table_from: view?.table_from?.slug,
      table_to: view?.table_to?.slug,
      view_fields: view?.view_fields?.map((el) => el.id),
      attributes: {
        ...relatedTable?.attributes,
        summaries: result ?? [],
      },
      relation_table_slug:
        relationAction?.relation_table_slug || column?.table_slug,
      id: relationAction?.relation_id,
    };

    if (isRelationTable) {
      updateRelationView(computedValuesForRelationView);
    } else {
      constructorViewService.update(tableSlug, computedValues).then(() => {
        queryClient.refetchQueries("GET_VIEWS_AND_FIELDS", {tableSlug});
        handleSummaryClose();
      });
    }
  };

  return (
    <>
      <CTableHeadCell
        id={column.id}
        key={index}
        style={{
          padding: "8px 4px",
          color: "#747474",
          fontSize: "13px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "normal",
          minWidth: tableSize?.[pageName]?.[column.id]
            ? tableSize?.[pageName]?.[column.id]
            : "auto",
          width: tableSize?.[pageName]?.[column.id]
            ? tableSize?.[pageName]?.[column.id]
            : "auto",
          position: `${
            tableSettings?.[pageName]?.find((item) => item?.id === column?.id)
              ?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
              ? "sticky"
              : "relative"
          }`,
          left: view?.attributes?.fixedColumns?.[column?.id]
            ? `${calculateWidthFixedColumn(column.id) + 80}px`
            : "0",
          backgroundColor: `${
            tableSettings?.[pageName]?.find((item) => item?.id === column?.id)
              ?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
              ? "#F6F6F6"
              : "#fff"
          }`,
          zIndex: `${
            tableSettings?.[pageName]?.find((item) => item?.id === column?.id)
              ?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
              ? "1"
              : "0"
          }`,
        }}>
        <div
          className="table-filter-cell cell-data"
          onMouseEnter={(e) => {
            setCurrentColumnWidth(e.relatedTarget.offsetWidth);
          }}>
          <span
            style={{
              whiteSpace: "nowrap",
              padding: "0 14px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setColumnId((prev) => (prev === column.id ? "" : column.id));
            }}>
            {column?.attributes?.[`label_${i18n?.language}`] ||
              column?.attributes?.[`title_${i18n?.language}`] ||
              column?.attributes?.[`name_${i18n?.language}`] ||
              column.label}
          </span>

          {permissions?.field_filter && (
            <Button
              onClick={handleClick}
              variant="text"
              style={{
                minWidth: "auto",
                padding: "0 5px",
              }}>
              <ExpandCircleDownIcon />
            </Button>
          )}
        </div>
      </CTableHeadCell>

      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
          }}>
          {menu.map((item) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                borderBottom: "1px solid #E0E0E0",
              }}>
              {item.children.map((child) =>
                child.id === 19 && column?.type !== "MULTI_LINE" ? (
                  ""
                ) : (
                  <div
                    onClick={(e) => {
                      child.onClickAction(e);
                    }}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      cursor: "pointer",
                      color: child.id === 14 ? "red" : "",
                      padding: "2px 0",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      {child.icon}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}>
                      {child.title}
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </Menu>

      <Menu
        anchorEl={summaryOpen}
        open={summaryIsOpen}
        onClose={handleSummaryClose}
        anchorOrigin={{horizontal: "right"}}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            marginLeft: "10px",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
          {formulaTypes?.map((item) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                handleAddSummary(item, "add");
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
                className="subMenuItem">
                <span
                  style={{
                    marginRight: "5px",
                    width: "20px",
                    height: "20px",
                  }}>
                  {item.icon}
                </span>
                {item?.label}
              </div>
            </div>
          ))}
        </div>
      </Menu>
    </>
  );
}
