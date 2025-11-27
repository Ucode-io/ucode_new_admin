import {Button, Pagination} from "@mui/material";
import {useTranslation} from "react-i18next";
import CSelect from "../CSelect";
import styles from "./style.module.scss";
import AddIcon from "@mui/icons-material/Add";
import useTabRouter from "../../hooks/useTabRouter";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {paginationActions} from "../../store/pagination/pagination.slice";
import {useMemo, useState} from "react";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";

const CPagination = ({
  setCurrentPage = () => {},
  view,
  paginationExtraButton,
  isTableView,
  multipleDelete,
  isGroupByTable,
  selectedObjectsForDelete,
  limit,
  setLimit = () => {},
  disablePagination,
  filterVisible,
  navigateToEditPage = () => {},
  selectedTab,
  isRelationTable,
  ...props
}) => {
  const {t} = useTranslation();
  const {navigateToForm} = useTabRouter();
  const navigate = useNavigate();
  const {tableSlug, id} = useParams();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const dispatch = useDispatch();
  const paginationInfo = useSelector(
    (state) => state?.pagination?.paginationInfo
  );

  const paginiation = useMemo(() => {
    const getObject = paginationInfo.find((el) => el?.tableSlug === tableSlug);

    return getObject?.pageLimit ?? null;
  }, [paginationInfo]);

  const options = [
    {value: "all", label: "All"},
    {value: 10, label: 10},
    {value: 15, label: 15},
    {value: 20, label: 20},
    {value: 25, label: 25},
    {value: 30, label: 30},
    {value: 35, label: 35},
    {value: 40, label: 40},
  ];

  const getLimitValue = (item) => {
    setLimit(item);
    dispatch(
      paginationActions.setTablePages({
        tableSlug: tableSlug,
        pageLimit: item,
      })
    );
  };

  const objectNavigate = () => {
    navigate(view?.attributes?.url_object);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: isGroupByTable ? "flex-end" : "space-between",
        alignItems: "center",
        marginTop: "15px",
        paddingRight: "15px",
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}>
        {!disablePagination && !isGroupByTable && (
          <div>
            {limit && (
              <div className={styles.limitSide}>
                {t("showing")}
                <CSelect
                  options={options}
                  disabledHelperText
                  size="small"
                  value={paginiation ?? limit}
                  onChange={(e) => getLimitValue(e.target.value)}
                  inputProps={{style: {borderRadius: 50}}}
                  endAdornment={null}
                  sx={null}
                />
              </div>
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            color: "#6E7C87",
            alignItems: "center",
          }}>
          Count:
          <strong style={{fontSize: "16px"}}> {props?.dataCount ?? 0}</strong>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginLeft: "10px",
        }}>
        {selectedObjectsForDelete?.length > 0 && !disablePagination ? (
          <RectangleIconButton color="error" onClick={multipleDelete}>
            <Button variant="outlined" color="error">
              Delete all selected
            </Button>
          </RectangleIconButton>
        ) : null}

        <PermissionWrapperV2 tableSlug={tableSlug} type="write">
          {isTableView && (
            <Button
              variant="outlined"
              onClick={() => {
                if (view?.attributes?.url_object) {
                  objectNavigate();
                } else {
                  isRelationTable
                    ? navigateToForm(
                        selectedTab?.relation?.relation_table_slug,
                        "CREATE",
                        {},
                        {id: id},
                        menuId
                      )
                    : navigateToEditPage(tableSlug);
                }
              }}>
              <AddIcon style={{color: "#007AFF"}} />
              Add object
            </Button>
          )}
        </PermissionWrapperV2>

        {!disablePagination && !isGroupByTable && (
          <>
            <Pagination
              color="primary"
              onChange={(e, val) => {
                setCurrentPage(val);
                dispatch(
                  paginationActions.setTablePageCount({
                    tableSlug: tableSlug,
                    pageCount: val,
                  })
                );
              }}
              {...props}
            />
            {paginationExtraButton}
          </>
        )}
      </div>
    </div>
  );
};

export default CPagination;
