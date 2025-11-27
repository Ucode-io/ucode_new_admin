import React, { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";

import { Checkbox, Collapse } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { Add } from "@mui/icons-material";

import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import styles from "./styles.module.scss";

export default function ValuesItem(props) {
  const { form, rowName, title } = props;

  const data = useWatch({ control: form.control, name: "values" });

  const onAllCheckboxChange = (val, idx) => {
    form.watch(`${rowName}.${idx}`).objects.forEach((_, objIdx) => {
      form
        .watch(`${rowName}.${idx}.objects.${objIdx}.table_field_settings`)
        .forEach((_, fieldIdx) => {
          form.setValue(
            `${rowName}.${idx}.objects.${objIdx}.table_field_settings.${fieldIdx}.checked`,
            val
          );
        });
    });
  };

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
                <div className={styles.valuesLabel}>
                  <Checkbox
                    sx={{ padding: 0 }}
                    checked={form
                      .watch(`${rowName}.${idx}.objects`)
                      ?.reduce(
                        (acc, cur) => [...acc, ...cur.table_field_settings],
                        []
                      )
                      ?.every((i) => i.checked)}
                    onChange={(_, val) => onAllCheckboxChange(val, idx)}
                  />
                  <span>{row.label}</span>
                </div>
                <ObjectItem idx={idx} form={form} rowName={rowName} row={row} />
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

function ObjectItem(props) {
  const { row, form, idx, rowName } = props;

  const { fields: objects, move } = useFieldArray({
    control: form.control,
    name: `${rowName}.${idx}.objects`,
  });

  const onDropHandle = ({ removedIndex, addedIndex }) => {
    move(removedIndex, addedIndex);
  };

  return (
    <Container onDrop={(params) => onDropHandle(params)}>
      {objects?.map((object, objIdx) => (
        <Draggable key={row.id}>
          <Item
            key={object.id}
            row={object}
            idx={idx}
            objIdx={objIdx}
            form={form}
            rowName={rowName}
          />
        </Draggable>
      ))}
    </Container>
  );
}

function Item(props) {
  const { row, form, rowName, idx, objIdx } = props;
  const [isOpen, setIsOpen] = useState(true);
  const { fields } = useFieldArray({
    control: form.control,
    name: `${rowName}.${idx}.objects.${objIdx}.table_field_settings`,
  });

  const checkboxHandler = (val, index) => {
    form.setValue(
      `${rowName}.${idx}.objects.${objIdx}.table_field_settings.${index}.checked`,
      val
    );
  };

  const onAllCheckboxChange = (val) => {
    form
      .watch(`${rowName}.${idx}.objects.${objIdx}.table_field_settings`)
      .forEach((_, fieldIdx) => {
        form.setValue(
          `${rowName}.${idx}.objects.${objIdx}.table_field_settings.${fieldIdx}.checked`,
          val
        );
      });
  };

  return (
    <div className={styles.item}>
      {rowName !== "values" && (
        <>
          <RectangleIconButton
            className={styles.expandBtn}
            onClick={() => setIsOpen((p) => !p)}
          >
            {isOpen ? <RemoveIcon /> : <Add />}
          </RectangleIconButton>
          <Checkbox
            sx={{ padding: 0, marginTop: "7px" }}
            checked={form
              .watch(`${rowName}.${idx}.objects.${objIdx}.table_field_settings`)
              .every((i) => i.checked)}
            onChange={(_, val) => onAllCheckboxChange(val)}
          />
        </>
      )}
      <div className={styles.row}>
        {rowName !== "values" && <p className={styles.label}>{row.label}</p>}
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <div className={styles.fields}>
            {fields?.map((field, fieldIdx) => (
              <div key={field.id} className={styles.element}>
                <div className={styles.head}>
                  <div
                    className={`${styles.field} ${
                      rowName === "values" ? styles.vertical : ""
                    }`}
                  >
                    <div>
                      <Checkbox
                        checked={
                          !!form.watch(
                            `${rowName}.${idx}.objects.${objIdx}.table_field_settings.${fieldIdx}.checked`
                          )
                        }
                        onChange={(_, val) => checkboxHandler(val, fieldIdx)}
                      />
                      <span>
                        {field.field_type?.includes("LOOKUP")
                          ? field.table_to?.label
                          : field.label?.split(" -> ")[0]}
                      </span>
                    </div>
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
