import React, {useState} from "react";
import styles from "./style.module.scss";
import {Box, CircularProgress, Menu, MenuItem, Typography} from "@mui/material";
import {IOSSwitch} from "../../../../theme/overrides/IosSwitch";
import constructorViewService from "../../../../services/constructorViewService";
import {useQueryClient} from "react-query";

function DetailPageHead({column, view, relatedTableSlug}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const open = Boolean(anchorEl);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleClick = (e, column) => {
    setAnchorEl(e.currentTarget);
    setSelectedColumn(column);
  };
  const handleClose = () => setAnchorEl(null);

  const updateView = (data, fieldId) => {
    setIsLoading(true);
    constructorViewService
      .update(relatedTableSlug, {
        ...view,
        columns: data,
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS_LIST"]);
      })
      .finally(() => {
        handleClose();
        setIsLoading(false);
      });
  };
  return (
    <>
      <th>
        {column?.label}
        <button
          onClick={(e) => {
            handleClick(e, column);
          }}
          className={styles.detailRelationhead}>
          <img src="/img/dots_horizontal.svg" alt="" />
        </button>
      </th>

      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <Box sx={{width: "244px"}}>
          <MenuItem
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "11px 14px",
            }}>
            <Typography
              sx={{
                color: "#101828",
                fontWeight: 500,
                fontSize: "14px",
              }}>
              Fix
            </Typography>
            <IOSSwitch disabled={true} color="primary" />
          </MenuItem>
          <MenuItem
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "11px 14px",
            }}>
            <Typography
              sx={{
                color: "#101828",
                fontWeight: 500,
                fontSize: "14px",
              }}>
              Hide
            </Typography>

            {column?.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
              isLoading ? (
                <CircularProgress sx={{color: "#449424"}} size={24} />
              ) : (
                <IOSSwitch
                  size="small"
                  checked={!view?.columns?.includes(column?.relation_id)}
                  onChange={(e) => {
                    updateView(
                      !e.target.checked
                        ? [...view?.columns, selectedColumn?.relation_id]
                        : view?.columns?.filter(
                            (el) => el !== selectedColumn?.relation_id
                          ),
                      selectedColumn?.relation_id
                    );
                  }}
                />
              )
            ) : isLoading ? (
              <CircularProgress sx={{color: "#449424"}} size={24} />
            ) : (
              <IOSSwitch
                size="small"
                checked={!view?.columns?.includes(column?.id)}
                onChange={(e) => {
                  updateView(
                    !e.target.checked
                      ? [...view?.columns, selectedColumn?.id]
                      : view?.columns?.filter(
                          (el) => el !== selectedColumn?.id
                        ),
                    selectedColumn?.id
                  );
                }}
              />
            )}
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
}

export default DetailPageHead;
