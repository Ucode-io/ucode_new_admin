import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import SortByAlphaOutlinedIcon from "@mui/icons-material/SortByAlphaOutlined";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {Button, Menu} from "@mui/material";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "react-query";
import constructorFieldService from "../../services/constructorFieldService";
import constructorViewService from "../../services/constructorViewService";
import {CTableHeadCell} from "../CTable";

export default function GroupTableHeadForTableView({
  column,
  index,
  pageName,
  tableSize,
  tableSettings,
  sortedDatas,
  selectedView,
  setDrawerState,
  setSortedDatas,
  view,
  calculateWidthFixedColumn,
  setColumnId,
  setCurrentColumnWidth,
  tableSlug,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const queryClient = useQueryClient();
  const open = Boolean(anchorEl);
  const {i18n} = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fixColumnChangeHandler = (column, e) => {
    const computedData = {
      ...selectedView,
      attributes: {
        ...selectedView?.attributes,
        fixedColumns: {
          ...selectedView?.attributes?.fixedColumns,
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
        ...selectedView,
        columns: selectedView?.attributes?.group_by_columns.filter(
          (item) => item !== column
        ),
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      });
  };

  const deleteField = (column) => {
    constructorFieldService.delete(column).then((res) => {
      constructorViewService
        .update(tableSlug, {
          ...selectedView,
          columns: selectedView?.attributes?.group_by_columns?.filter(
            (item) => item !== column
          ),
        })
        .then(() => {
          queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
          queryClient.refetchQueries("GET_OBJECTS_LIST", {tableSlug});
        });
    });
  };

  const menu = [
    {
      id: 1,
      children: [
        {
          id: 2,
          title: "Edit field",
          icon: <CreateOutlinedIcon />,
          onClickAction: () => {
            setDrawerState(column);
          },
        },
      ],
    },

    // {
    //   id: 3,
    //   children: [
    //     {
    //       id: 4,
    //       title: "Dublicate field",
    //       icon: <QueueOutlinedIcon />,
    //       onClickAction: () => {
    //         console.log("Dublicate field");
    //       },
    //     },
    //     {
    //       id: 5,
    //       title: "Insert Left",
    //       icon: <ArrowBackOutlinedIcon />,
    //       onClickAction: () => {
    //         console.log("Insert Left");
    //       },
    //     },
    //     {
    //       id: 6,
    //       title: "Insert Right",
    //       icon: <ArrowForwardOutlinedIcon />,
    //       onClickAction: () => {
    //         console.log("Insert Right");
    //       },
    //     },
    //   ],
    // },
    {
      id: 7,
      children: [
        {
          id: 8,
          title: `Sort ${sortedDatas?.find((item) => item.field === column.id)?.order === "ASC" ? "Z -> A" : "A -> Z"}`,
          icon: <SortByAlphaOutlinedIcon />,
          onClickAction: () => {
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
          id: 10,
          title: `${view?.attributes?.fixedColumns?.[column?.id] ? "Unfix" : "Fix"} column`,
          icon: <ViewWeekOutlinedIcon />,
          onClickAction: () => {
            fixColumnChangeHandler(
              column,
              !view?.attributes?.fixedColumns?.[column?.id] ? true : false
            );
          },
        },
        // {
        //   id: 11,
        //   title: "Text Wrap",
        //   icon: <WrapTextOutlinedIcon />,
        //   onClickAction: () => {
        //     console.log("Text Wrap");
        //   },
        // },
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
  return (
    <>
      <CTableHeadCell
        id={column.id}
        key={index}
        style={{
          padding: "10px 4px",
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
          position: `${tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "sticky" : "relative"}`,
          left: view?.attributes?.fixedColumns?.[column?.id]
            ? `${calculateWidthFixedColumn(column.id)}px`
            : "0",
          backgroundColor: `${tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "#F6F6F6" : "#fff"}`,
          zIndex: `${tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "1" : "0"}`,
          // color: formVisible && column?.required === true ? "red" : "",
        }}>
        <div
          className="table-filter-cell cell-data"
          onMouseEnter={(e) => {
            setCurrentColumnWidth(e.relatedTarget.offsetWidth);
          }}>
          <span
            style={{
              whiteSpace: "nowrap",
              padding: "0 5px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setColumnId((prev) => (prev === column.id ? "" : column.id));
            }}>
            {column?.attributes?.[`label_${i18n?.language}`] ||
              column?.attributes?.[`title_${i18n?.language}`] ||
              column.label}
          </span>

          <Button
            onClick={handleClick}
            variant="text"
            style={{
              minWidth: "auto",
              padding: "0 5px",
            }}>
            <ExpandCircleDownIcon />
          </Button>
          {/* {(disableFilters && isTableView) && <FilterGenerator field={column} name={column.slug} onChange={filterChangeHandler} filters={filters} tableSlug={tableSlug} />}
          {(columnId === column?.id && isTableView) && (
            <div className="cell-popup" ref={popupRef}>
              <div className="cell-popup-item" onClick={() => handlePin(column?.id, index)}>
                <PinIcon pinned={tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky} />
                <span>Pin column</span>
              </div>
              <div className="cell-popup-item" onClick={() => handleAutoSize(column?.id, index)}>
                <ResizeIcon />
                <span>Autosize</span>
              </div>
            </div>
          )} */}
        </div>
      </CTableHeadCell>

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
              {item.children.map((child) => (
                <div
                  onClick={() => {
                    child.onClickAction();
                    handleClose();
                  }}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    cursor: "pointer",
                    color: child.id === 14 ? "red" : "",
                  }}>
                  <div>{child.icon}</div>

                  <span>{child.title}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Menu>
    </>
  );
}
