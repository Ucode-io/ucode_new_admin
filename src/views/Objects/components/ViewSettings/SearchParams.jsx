import { Backdrop, CircularProgress, Switch } from "@mui/material";
import React, { useState } from "react";
import { columnIcons } from "../../../../utils/constants/columnIcons";
import { useParams } from "react-router-dom";

export default function SearchParams({
  checkedColumns,
  setCheckedColumns,
  columns,
  updateField,
}) {
  const [fields, setFields] = useState(columns);
  const { tableSlug } = useParams();

  const changeHandler = (slug, e, index, isSearch) => {
    const updatedColumns = [...fields];
    updatedColumns[index] = {
      ...updatedColumns[index],
      is_search: e.target.checked,
    };
    setFields(updatedColumns);
    updateField({
      data: {
        fields: updatedColumns,
      },
      tableSlug,
    });
    setCheckedColumns(
      fields.filter((item) => item.is_search === true).map((item) => item.slug)
    );
  };

  const toggleAllSearch = (isChecked) => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      is_search: isChecked,
    }));
    setFields(updatedColumns);
    updateField({
      data: {
        fields: updatedColumns,
      },
      tableSlug,
    });
    setCheckedColumns(
      fields.filter((item) => item.is_search === true).map((item) => item.slug)
    );
  };

  const allEditTrue = fields?.every((column) => column.is_search === true);

  return (
    <>
      <div>
        <div
          style={{
            padding: "10px 14px",
            minWidth: "200px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #e0e0e0",
              padding: "6px 0",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div style={{ textAlign: "end" }}>All</div>
            </div>

            <div>
              <Switch
                size="small"
                onChange={(e) => toggleAllSearch(e.target.checked)}
                checked={allEditTrue}
              />
            </div>
          </div>

          {fields.map((column, index) => (
            <div
              key={column.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 0",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div>{columnIcons(column.type)}</div>

                <div style={{ textAlign: "end" }}>{column.label}</div>
              </div>

              <div>
                <Switch
                  size="small"
                  onChange={(e) => changeHandler(column.slug, e, index)}
                  checked={column.is_search}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
