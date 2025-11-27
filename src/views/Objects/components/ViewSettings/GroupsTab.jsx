import LinkIcon from "@mui/icons-material/Link";
import { Box, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CTable, CTableBody, CTableCell, CTableRow } from "../../../../components/CTable";
import { columnIcons } from "../../../../utils/constants/columnIcons";

const GroupsTab = ({ columns, form, selectedView, updateView, isLoading, updateLoading }) => {
  const selectedColumns = useWatch({
    control: form.control,
    name: "group_fields",
  });
  const { i18n } = useTranslation();

  const [selectedColumn, setSelectedColumn] = useState();
  const [updatedColumns, setUpdatedColumns] = useState();
  useEffect(() => {
    setUpdatedColumns(columns?.filter((column) => column.type === "LOOKUP" || column.type === "PICK_LIST" || column.type === "LOOKUPS" || column.type === "MULTISELECT"));
  }, [columns]);

  useEffect(() => {
    if (selectedColumn) {
      const updatedArr = [selectedColumn, ...updatedColumns.filter((item) => item !== selectedColumn)];
      setUpdatedColumns(updatedArr);
    }
  }, [selectedColumn]);

  const onCheckboxChange = async (val, id, column) => {
    setSelectedColumn(column);
    const type = form.getValues("type");

    if (type !== "CALENDAR" && type !== "GANTT") {
      return form.setValue("group_fields", val ? [id] : []);
    }

    if (!val) {
      return form.setValue(
        "group_fields",
        selectedColumns.filter((el) => el !== id)
      );
    }

    if (selectedColumns?.length >= 2) return;

    return form.setValue("group_fields", [...selectedColumns, id]);
  };

  const changeHandler = async (val, id, column) => {
    await onCheckboxChange(val, id, column);
    updateView();
  };

  return (
    <div
      style={{
        minWidth: 200,
        maxHeight: 300,
        overflowY: "auto",
        padding: "10px 14px",
      }}
    >
      <CTable removableHeight={false} disablePagination tableStyle={{ border: "none" }}>
        <CTableBody dataLength={1}>
          {updatedColumns?.length ? (
            updatedColumns?.map((column) => (
              <CTableRow
                key={column.id}
                onClick={(val) => {
                  changeHandler(val, column.id);
                }}
              >
                <CTableCell
                  style={{
                    padding: 0,
                    border: 0,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div>{columnIcons(column.type) ?? <LinkIcon />}</div>
                    <div>{column?.attributes?.[`label_${i18n.language}`] ?? column.label}</div>
                  </div>
                </CTableCell>
                <CTableCell
                  style={{
                    width: 20,
                    borderBottom: "1px solid #eee",
                    borderRight: 0,
                  }}
                >
                  <Switch
                    size="small"
                    disabled={isLoading || updateLoading}
                    checked={selectedColumns?.includes(column?.id) || selectedView?.group_fields?.includes(column?.id)}
                    onChange={(e, val) => changeHandler(val, column.id, column)}
                  />
                </CTableCell>
              </CTableRow>
            ))
          ) : (
            <Box style={{ padding: "10px" }}>
              <Typography>No columns to set group!</Typography>
            </Box>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default GroupsTab;
