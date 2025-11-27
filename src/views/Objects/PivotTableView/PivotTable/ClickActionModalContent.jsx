import React, { forwardRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import cloneDeep from "lodash.clonedeep";

import { Collapse } from "@mui/material";
import { Add } from "@mui/icons-material";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";

import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import styles from "./styles.module.scss";
import pivotService from "../../../../services/pivotService";

export default function ClickActionModalContent(props) {
  const {
    data,
    expandedRows,
    onTemplateChange,
    form,
    getValueRecursively,
    activeClickActionTabId,
    curClActRow,
  } = props;

  const { appId } = useParams();
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (form.watch("report_setting_id"))
      pivotService
        .getByIdReportSetting(form.watch("report_setting_id"), appId)
        .then((res) => {
          setFields(res);
        });
  }, [form.watch("report_setting_id")]);

  return (
    <div>
      <div className={styles.rowsRelation}>
        {fields.rows_relation?.map((row) => (
          <div key={row.label}>
            <p>{row.label}</p>
            {row.objects.map((obj) => (
              <RowItem
                key={obj.id}
                getValueRecursively={getValueRecursively}
                curClActRow={curClActRow}
                row={{ ...obj, parent_label: row.label }}
                data={data}
                expandedRows={expandedRows}
                keyName="rows_relation"
                onTemplateChange={onTemplateChange}
                activeClickActionTabId={activeClickActionTabId}
              />
            ))}
          </div>
        ))}
      </div>
      {fields.rows?.map((row) => (
        <RowItem
          key={row.id}
          getValueRecursively={getValueRecursively}
          curClActRow={curClActRow}
          row={row}
          data={data}
          expandedRows={expandedRows}
          keyName="rows"
          onTemplateChange={onTemplateChange}
          activeClickActionTabId={activeClickActionTabId}
        />
      ))}
    </div>
  );
}

const RowItem = forwardRef((props, _) => {
  const {
    row,
    getValueRecursively,
    curClActRow,
    data,
    expandedRows,
    keyName = null,
    onTemplateChange,
    activeClickActionTabId,
  } = props;
  const [isOpen, setIsOpen] = useState(true);

  const changeHandler = (field) => {
    const response = cloneDeep({ ...data }) ?? {};

    const addingFilterFields = () => {
      response[keyName].forEach((_, objIdx) => {
        if (response[keyName].find((obj) => obj.id === row.id)) {
          if (
            response[keyName][objIdx].table_field_settings.some(
              (i) => i.field_slug === field.field_slug
            )
          ) {
            response[keyName][objIdx].table_field_settings.forEach(
              (loopField, fieldIdx) => {
                if (field.field_slug === loopField.field_slug) {
                  response[keyName][objIdx].table_field_settings[
                    fieldIdx
                  ].checked = true;
                }
              }
            );
          } else {
            response[keyName][objIdx].table_field_settings.push({
              ...field,
              checked: true,
            });
          }
        } else {
          response[keyName].push({
            ...row,
            order_number: response[keyName].length + 1,
            table_field_settings: [{ ...field, checked: true }],
          });
        }
      });
    };

    if (response[keyName]) {
      if (keyName === "rows") {
        addingFilterFields();
      } else {
        response[keyName].forEach((item, itemIdx) => {
          response[keyName][itemIdx] = {
            label: row.parent_label,
            order_number: response.rows.length + 1,
            objects: [
              {
                ...row,
                table_field_settings: [{ ...field, checked: true }],
              },
            ],
          };
        });
      }
    } else {
      response[keyName] = [
        {
          label: row.parent_label,
          order_number: response.rows.length + 1,
          objects: [
            { ...row, table_field_settings: [{ ...field, checked: true }] },
          ],
        },
      ];
    }

    if (!expandedRows.length) {
      if (
        response.filters.some((f) => f.slug + "_id" === curClActRow.table_slug)
      ) {
        response.filters.forEach((f, fIdx) => {
          if (f.slug + "_id" === curClActRow.table_slug) {
            response.filters[fIdx] = { ...f, table_guids: [curClActRow.guid] };
          }
        });
      } else {
        response.filters.push({ table_guids: [curClActRow.guid] });
      }

      // response.filters = [...fields.filters, curClActRow];
    } else {
      function getArray(row) {
        if (!row.child) {
          return [row];
        }
        return [...getArray(row.child), row];
      }
      if (
        expandedRows.find(
          (i) =>
            getValueRecursively(
              i,
              i.is_relaiton_row ? i.relation_order_number : i.order_number
            ) === [...curClActRow.parent_ids, curClActRow.guid].join("#")
        )
      ) {
        // expandRows length > 0 bo'lsa va topilsa
        const foundExpandedRow = expandedRows.find(
          (i) =>
            getValueRecursively(
              i,
              i.is_relaiton_row ? i.relation_order_number : i.order_number
            ) === [...curClActRow.parent_ids, curClActRow.guid].join("#")
        );

        const existedFilters = [];

        response.filters.forEach((f) => {
          if (
            getArray(foundExpandedRow).some(
              (fRow) => f.slug + "_id" === fRow.slug
            )
          ) {
            existedFilters.push(f);
          }
        });

        existedFilters.forEach((f) => {
          const computedRow = getArray(foundExpandedRow).find(
            (fRow) => f.slug + "_id" === fRow.slug
          );
          response.filters = response.filters.map((resF) =>
            resF.slug === f.slug
              ? { ...resF, table_guids: [computedRow.real_value] }
              : resF
          );
        });
      } else {
        const foundExpandedRow = expandedRows.find(
          (i) =>
            getValueRecursively(
              i,
              i.is_relaiton_row ? i.relation_order_number : i.order_number
            ) === [...curClActRow.parent_ids].join("#")
        );

        const existedFilters = [];

        response.filters.forEach((f) => {
          if (
            getArray(foundExpandedRow).some(
              (fRow) => f.slug + "_id" === fRow.slug
            )
          ) {
            existedFilters.push(f);
          }
        });

        existedFilters.forEach((f) => {
          const computedRow = getArray(foundExpandedRow).find(
            (fRow) => f.slug + "_id" === fRow.slug
          );
          response.filters = response.filters.map((resF) =>
            resF.slug === f.slug
              ? { ...resF, table_guids: [computedRow.real_value] }
              : resF
          );
        });
        if (curClActRow.slug_type !== "RELATION") {
          response.filters.push({
            slug: curClActRow.table_slug.split("_id")[0],
            table_guids: [curClActRow.guid],
          });
        }
      }
    }

    onTemplateChange(activeClickActionTabId, response);
  };
  return (
    <div className={styles.clcActRow}>
      <div className={styles.clActRowItem}>
        <RectangleIconButton
          size="small"
          className={styles.expandBtn}
          onClick={() => setIsOpen((p) => !p)}
        >
          {isOpen ? <RemoveIcon /> : <Add />}
        </RectangleIconButton>
        <span className={styles.rowLabel}>{row.label}</span>
      </div>

      <Collapse key={row.id} in={isOpen} timeout="auto" unmountOnExit>
        {row.table_field_settings.map((field) => (
          <div
            className={styles.clcActfield}
            key={row.slug + "#" + field.field_slug}
            onDoubleClick={() => changeHandler(field, keyName)}
          >
            <SearchIcon />
            <span>
              {field.field_type.includes("LOOKUP")
                ? field?.table_to?.label
                : field.label}
            </span>
          </div>
        ))}
      </Collapse>
    </div>
  );
});
