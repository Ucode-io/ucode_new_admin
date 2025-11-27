import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useFieldArray, useWatch } from "react-hook-form";
import { CircularProgress, Collapse } from "@mui/material";
import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import HFTextField from "../../../../components/FormElements/HFTextField";
import HFSelect from "../../../../components/FormElements/HFSelect";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../components/FormElements/FRow";
import constructorFieldService from "../../../../services/constructorFieldService";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import styles from "./styles.module.scss";
import MultiSelectWithInputs from "../../components/MultiSelectWithInputs";
import HFAutocomplete from "../../../../components/FormElements/HFAutocomplete";

export default function ValuesBlock({ form, tables, getTables }) {
  const { fields: objectFields, append, remove } = useFieldArray({ control: form.control, name: "values" });

  const computedOptions = useMemo(() => {
    return (
      tables
        // .filter((table) => !form.watch(`rows`).some((row) => row.slug === table.slug))
        .map((i) => ({ label: i.label, value: i.slug, id: i.id }))
    );
  }, [tables]);

  return (
    <div className={styles.repeatedBlock}>
      <div className={styles.items}>
        {objectFields.map((row, idx) => (
          <RowItem key={row.label} remove={remove} idx={idx} form={form} options={computedOptions} getTables={getTables}/>
        ))}
        <div className={styles.addButton}>
          <PrimaryButton style={{ width: "100%" }} onClick={() => append({ slug: "", objects: [{ label: "" }] })}>
            <AddIcon />
            <span>Add new item</span>
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function RowItem({ form, options, idx, remove, getTables }) {
  const { fields: objects, append: appendObj, remove: removeObj } = useFieldArray({ control: form.control, name: `values.${idx}.objects` });

  const [expandedRowsIds, setExpandedRowsIds] = useState([idx]);

  const handleRowsExpand = (key) => {
    setExpandedRowsIds((p) => (key === "open" ? [...p, idx] : p.filter((id) => id !== idx)));
  };

  return (
    <div className={styles.item}>
      <div className={styles.expand}>
        <RectangleIconButton onClick={() => handleRowsExpand(expandedRowsIds.includes(idx) ? "close" : "open")}>
          {expandedRowsIds.includes(idx) ? <RemoveIcon /> : <AddIcon />}
        </RectangleIconButton>
        <FRow label="Label">
          <HFTextField fullWidth required control={form.control} name={`values.${idx}.label`} />
        </FRow>
      </div>
      <Collapse in={expandedRowsIds.includes(idx)} timeout="auto" unmountOnExit>
        <div>
          <div className={styles.objects}>
            {objects.map((obj, objIdx) => (
              <ObjectItem form={form} idx={idx} objIdx={objIdx} options={options} key={obj.id} removeObj={removeObj} getTables={getTables}/>
            ))}
          </div>

          <div className={styles.footerBtns}>
            <PrimaryButton onClick={() => appendObj({ label: "" })}>
              <AddIcon />
              <span>Add new object</span>
            </PrimaryButton>
            <PrimaryButton color="error" onClick={() => remove(idx)}>
              <Delete />
              <span>Delete item</span>
            </PrimaryButton>
          </div>
        </div>
      </Collapse>
    </div>
  );
}

function ObjectItem({ form, idx, objIdx, options, removeObj, getTables }) {
  const formValuesObj = useWatch({ control: form.control, name: `values.${idx}.objects.${objIdx}` });
  const formValues = useWatch({ control: form.control, name: "values" });

  const { data: fields, isLoading } = useQuery(
    ["GET_TABLE_FIELDS", formValuesObj.slug],
    () =>
      constructorFieldService.getList({
        table_slug: formValuesObj.slug,
        sort: "created_at",
      }),
    {
      enabled: !!formValuesObj.slug,
      select: ({ fields }) => fields.filter((i) => i.type === "NUMBER" || i.type.includes("FORMULA")).map((i) => ({ label: i.label, value: i.slug, type: i.type })),
      onSuccess: (data) => {
        form.setValue(`values.${idx}.objects.${objIdx}.fields_length`, data.length);
      },
    }
  );

  const onObjectSelect = (slug) => {
    const selected = options.find((obj) => obj.value === slug);
    if (selected) {
      form.setValue(`values.${idx}.objects.${objIdx}.label`, selected.label);
      form.setValue(`values.${idx}.objects.${objIdx}.id`, selected.id);
    }
  };

  const onFilterFieldSelect = (val) => {
    formValues.forEach((value, idx) => {
      value.objects.forEach((obj, objIdx) => {
        if (obj.id === formValuesObj.id) {
          form.setValue(`values.${idx}.objects.${objIdx}.date_field_slug`, val);
        }
      });
    });
  };


  const onFieldChange = (values) => {
    const getField = (slug) => fields.find((v) => v.value === slug);
    const getExistedField = (slug) => formValuesObj?.table_field_settings?.find((v) => v.field_slug === slug);

    const key = `values.${idx}.objects.${objIdx}.table_field_settings`;
    form.setValue(
      key,
      values.map((v) => {
        const isExist = getExistedField(v.field_slug);
        return {
          field_slug: (isExist ? getExistedField : getField)(v.field_slug)[isExist ? "field_slug" : "value"],
          field_type: (isExist ? getExistedField : getField)(v.field_slug)[isExist ? "field_type" : "type"],
          label: (isExist ? getExistedField : getField)(v.field_slug).label,
          table_slug: formValuesObj.slug,
        };
      })
    );
  };

  return (
    <div className={`${styles.form} ${styles.values}`}>
      <div className={styles.objectBox}>
        <div className={styles.select}>
          <FRow label="Object">
            <HFAutocomplete
              name={`values.${idx}.objects.${objIdx}.slug`}
              control={form.control}
              fullWidth
              required
              options={options}
              onChange={(val) => {onObjectSelect(val)}}
              onFieldChange={(e) => {
                getTables(e.target.value);
              }}
            />
          </FRow>
          <FRow label="Date filter field">
            <HFSelect
              clearable
              options={fields?.filter((i) => i.type.includes("DATE"))}
              control={form.control}
              onChange={(val) => onFilterFieldSelect(val)}
              name={`values.${idx}.objects.${objIdx}.date_field_slug`}
            />
          </FRow>
        </div>
        <FRow label="Fields">
          <div className={styles.fields}>
            {isLoading ? (
              <div className={styles.loader}>
                <CircularProgress />
              </div>
            ) : (
              <MultiSelectWithInputs values={formValuesObj.table_field_settings ?? []} options={fields} onFieldChange={onFieldChange} form={form} idx={idx} objIdx={objIdx} />
            )}
          </div>
        </FRow>
      </div>

      <PrimaryButton style={{ width: "100%" }} color="error" onClick={() => removeObj(objIdx)}>
        <Delete />
        <span>Delete object</span>
      </PrimaryButton>
    </div>
  );
}
