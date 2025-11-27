import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import layoutService from "../../../services/layoutService";
import ValueGenerator from "../SummarySection/ValueGenerator";
import styles from "./style.module.scss";

export default function SummarySectionValuesForModal({ control, computedSummary, editAcces, fieldsMap, setSummary, layout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { i18n } = useTranslation();
  const { tableSlug } = useParams();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateLayout = (newData) => {
    layoutService.update(newData, tableSlug);
  };

  const allFields = useMemo(() => {
    return Object.values(fieldsMap).map((field) => {
      return {
        label: field?.attributes?.[`label_to_${i18n.language}`] ?? field?.label,
        value: field?.id,
      };
    });
  }, [fieldsMap]);

  const addFieldsToSummary = (fieldId) => {
    const newData = {
      ...layout,
      summary_fields: [...computedSummary, fieldsMap[fieldId]],
    };

    setSummary(newData?.summary_fields);
    updateLayout(newData);
  };

  const removeFieldsFromSummary = (fieldId) => {
    const newData = {
      ...layout,
      summary_fields: computedSummary?.filter((field) => field?.id !== fieldId),
    };

    setSummary(newData?.summary_fields);
    updateLayout(newData);
  };

  return (
    <div className={styles.summarySection}>
      {computedSummary?.map((field) => (
        <>
          <div className={styles.field_summary}>
            <div className={styles.field_summary_item}>
              <span>{field?.slug !== "photo" && field?.slug !== "passport_photo" ? field?.label : ""}</span>
              <p>
                <ValueGenerator field={field} control={control} />
              </p>
            </div>
          </div>

          {editAcces && (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                sx={{
                  width: "32px",
                  height: "32px",
                  maxWidth: "32px",
                  minWidth: "32px",
                }}
                onClick={() => removeFieldsFromSummary(field?.id)}
              >
                <DeleteForeverIcon
                  style={{
                    color: "red",
                  }}
                />
              </Button>
            </Box>
          )}
        </>
      ))}

      {editAcces && (
        <>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{
                width: "32px",
                height: "32px",
                maxWidth: "32px",
                minWidth: "32px",
              }}
            >
              <AddRoundedIcon />
            </Button>
          </Box>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {allFields?.length > 0 ? (
              allFields?.map((field) => (
                <MenuItem
                  onClick={() => {
                    addFieldsToSummary(field?.value);
                    handleClose();
                  }}
                >
                  {field?.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem onClick={handleClose}>No fields!</MenuItem>
            )}
          </Menu>
        </>
      )}
    </div>
  );
}
