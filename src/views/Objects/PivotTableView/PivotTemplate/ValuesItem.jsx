import React, { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";

import { Checkbox, Collapse } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { Add } from "@mui/icons-material";

import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import styles from "./styles.module.scss";

export default function ValuesItem(props) {
  const { form, title } = props;

  const data = useWatch({ control: form.control, name: "valuesFields" });

  return (
    <div className={styles.wrapper}>
      <div className={styles.itemHead}>
        <p className={styles.title}>{title}</p>
      </div>
      <div className={styles.items}>
        <div className="p-1">
          {data?.length ? (
            data?.map((row, idx) => (
              <div className={styles.valuesWrapper} key={row.label}>
                <Items idx={idx} row={row} form={form} />
              </div>
            ))
          ) : (
            <div>No data</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Items(props) {
  const { idx, form, row } = props;

  const { fields, move } = useFieldArray({
    control: form.control,
    name: `valuesFields.${idx}.table_field_settings`,
  });

  const [isOpen, setIsOpen] = useState(true);

  const onAllCheckboxChange = (val, idx) => {
    form.watch(`valuesFields.${idx}`).table_field_settings.forEach((_, itemIdx) => {
      form.setValue(`valuesFields.${idx}.table_field_settings.${itemIdx}.checked`, val);
    });

    form.watch(`values.${idx}.objects`).forEach((obj, objIdx) => {
      obj.table_field_settings.forEach((_, fieldIdx) => {
        form.setValue(`values.${idx}.objects.${objIdx}.table_field_settings.${fieldIdx}.checked`, val);
      });
    });
  };

  const checkboxHandler = (val, index) => {
    form.setValue(`valuesFields.${idx}.table_field_settings.${index}.checked`, val);

    const target = fields[index];
    form.watch(`values.${idx}.objects`).forEach((obj, objIdx) => {
      obj.table_field_settings.forEach((field, fieldIdx) => {
        if (field.field_slug + field.table_slug === target.field_slug + target.table_slug) {
          form.setValue(`values.${idx}.objects.${objIdx}.table_field_settings.${fieldIdx}.checked`, val);
        }
      });
    });
  };

  const onDropHandle = ({ removedIndex, addedIndex }) => {
    move(removedIndex, addedIndex);

    row.table_field_settings.forEach((rowField, rowFieldIdx) => {
      form.watch(`values.${idx}.objects`).forEach((obj, objIdx) => {
        obj.table_field_settings.forEach((field, fieldIdx) => {
          if (field.field_slug + field.table_slug === rowField.field_slug + rowField.table_slug) {
            form.setValue(`values.${idx}.objects.${objIdx}.table_field_settings.${fieldIdx}.order_number`, rowFieldIdx);
          }
        });
      });
    });
  };

  return (
    <div>
      <div className={styles.valuesLabel}>
        <RectangleIconButton className={styles.expandBtn} onClick={() => setIsOpen((p) => !p)}>
          {isOpen ? <RemoveIcon /> : <Add />}
        </RectangleIconButton>
        <Checkbox
          sx={{ padding: 0 }}
          checked={form.watch(`valuesFields.${idx}.table_field_settings`)?.every((i) => i.checked)}
          onChange={(_, val) => onAllCheckboxChange(val, idx)}
        />
        <span>{row.label}</span>
      </div>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Container onDrop={(params) => onDropHandle(params)}>
          {fields.map((field, fieldIdx) => (
            <Draggable key={field.field_slug + field.table_slug}>
              <div className="flex align-center pl-4">
                <Checkbox
                  onChange={(_, val) => checkboxHandler(val, fieldIdx)}
                  checked={!!form.watch(`valuesFields.${idx}.table_field_settings.${fieldIdx}.checked`)}
                  sx={{ padding: "4px", marginLeft: "20px" }}
                />
                <p>{field.label}</p>
              </div>
            </Draggable>
          ))}
        </Container>
      </Collapse>
    </div>
  );
}
