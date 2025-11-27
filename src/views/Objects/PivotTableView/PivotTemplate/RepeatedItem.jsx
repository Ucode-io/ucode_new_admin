import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";

import { Checkbox, Collapse } from "@mui/material";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { Add } from "@mui/icons-material";
import RemoveIcon from "@mui/icons-material/Remove";

import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import styles from "./styles.module.scss";

export default function RepeatedItem(props) {
  const { form, rowName, title } = props;

  const { fields: data, move } = useFieldArray({ control: form.control, name: rowName });

  const onDropHandle = ({ removedIndex, addedIndex }) => {
    move(removedIndex, addedIndex);
    const droppedRowsRelationIdx = form
      .watch(`rows_relation`)
      ?.findIndex((i) => i.label === form.watch(`rows.${addedIndex}.label`));
    form.setValue(`rows_relation.${droppedRowsRelationIdx}.order_number`, addedIndex);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.items}>
        <div className={styles.itemHead}>
          <p className={styles.title}>{title}</p>
        </div>
        <div className="p-1">
          {data?.length ? (
            <Container onDrop={(params) => onDropHandle(params)}>
              {data?.map((row, idx) => (
                <Draggable key={row.id}>
                  <Item key={row.id} row={row} idx={idx} form={form} rowName={rowName} />
                </Draggable>
              ))}
            </Container>
          ) : (
            <div>No data</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Item(props) {
  const { row, form, rowName, idx } = props;
  const [isOpen, setIsOpen] = useState(true);
  const { fields } = useFieldArray({
    control: form.control,
    name: `${rowName}.${idx}.table_field_settings`,
  });

  const joinCheckboxHandler = (val) => {
    form.setValue(`${rowName}.${idx}.join`, val);
  };

  const checkboxHandler = (val, index) => {
    form.setValue(`${rowName}.${idx}.table_field_settings.${index}.checked`, val);
  };

  const onAllCheckboxChange = (val) => {
    form.setValue(`${rowName}.${idx}.join`, val);
    form.watch(`${rowName}.${idx}.table_field_settings`).forEach((_, fieldIdx) => {
      form.setValue(`${rowName}.${idx}.table_field_settings.${fieldIdx}.checked`, val);
    });
  };

  return (
    <div className={styles.item}>
      <RectangleIconButton className={styles.expandBtn} onClick={() => setIsOpen((p) => !p)}>
        {isOpen ? <RemoveIcon /> : <Add />}
      </RectangleIconButton>
      {!row.rowsRelationRow && (
        <Checkbox
          sx={{ padding: 0, marginTop: "7px" }}
          checked={form.watch(`${rowName}.${idx}.table_field_settings`)?.every((i) => i.checked)}
          onChange={(_, val) => onAllCheckboxChange(val)}
        />
      )}
      <div className={styles.row}>
        <div className="flex gap-1">
          <span className={styles.label}>{row.label}</span>
          {rowName === "rows" && !row.rowsRelationRow && (
            <Checkbox
              sx={{ padding: 0 }}
              onChange={(_, val) => joinCheckboxHandler(val)}
              checked={!!form.watch(`${rowName}.${idx}.join`)}
              icon={<FactCheckOutlinedIcon />}
              checkedIcon={<FactCheckIcon />}
            />
          )}
        </div>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <div className={styles.fields}>
            {fields?.map((field, fieldIdx) => (
              <div key={field.id} className={styles.element}>
                <div className={styles.head}>
                  <div className={styles.field}>
                    {!field.hideCheckbox && !row.rowsRelationRow && (
                      <Checkbox
                        sx={{ padding: 0 }}
                        checked={!!form.watch(`${rowName}.${idx}.table_field_settings.${fieldIdx}.checked`)}
                        onChange={(_, val) => checkboxHandler(val, fieldIdx)}
                      />
                    )}
                    <span>
                      {field.field_type?.includes("LOOKUP") ? field?.table_to?.label : field.label?.split(" -> ")[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Collapse>
      </div>
    </div>
  );
}
