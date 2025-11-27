import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useFieldArray } from "react-hook-form";

import { CircularProgress, Collapse } from "@mui/material";
import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import HFTextField from "../../../../components/FormElements/HFTextField";
import HFSelect from "../../../../components/FormElements/HFSelect";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../components/FormElements/FRow";
import constructorFieldService from "../../../../services/constructorFieldService";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import HFMultipleAutocomplete from "../../../../components/FormElements/HFMultipleAutocomplete";
import constructorRelationService from "../../../../services/constructorRelationService";
import styles from "./relation.module.scss";
import HFAutocomplete from "../../../../components/FormElements/HFAutocomplete";
import { use } from "i18next";
import { useParams } from "react-router-dom";

export default function RowsRelation({ form, tables, getTables }) {
  const { fields: objectFields, append, remove } = useFieldArray({ control: form.control, name: "rows_relation" });

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
          <RowItem key={row.title} remove={remove} idx={idx} form={form} options={computedOptions} getTables={getTables} />
        ))}
      </div>
      <PrimaryButton style={{ width: "100%" }} onClick={() => append({ title: "", tables: [{ label: "" }] })}>
        <AddIcon />
        <span>Add new item</span>
      </PrimaryButton>
    </div>
  );
}

function RowItem({ form, options, idx, remove, getTables }) {
  const { fields: tables, append: appendObj, remove: rmoveObj } = useFieldArray({ control: form.control, name: `rows_relation.${idx}.objects` });

  const [expandedRowsIds, setExpandedRowsIds] = useState([idx]);

  const handleRowsExpand = (key) => {
    setExpandedRowsIds((p) => (key === "open" ? [...p, idx] : p.filter((id) => id !== idx)));
  };

  return (
    <div className={styles.item}>
      <div className={styles.expand}>
        <RectangleIconButton style={{ marginBottom: "10px" }} onClick={() => handleRowsExpand(expandedRowsIds.includes(idx) ? "close" : "open")}>
          {expandedRowsIds.includes(idx) ? <RemoveIcon /> : <AddIcon />}
        </RectangleIconButton>
        <FRow label="Label">
          <HFTextField fullWidth required control={form.control} name={`rows_relation.${idx}.label`} />
        </FRow>
      </div>
      <Collapse in={expandedRowsIds.includes(idx)} timeout="auto" unmountOnExit>
        <div>
          <div className={styles.objects}>
            {tables.map((table, objIdx) => (
              <ObjectItem form={form} idx={idx} objIdx={objIdx} options={options} key={table.id} rmoveObj={rmoveObj} getTables={getTables} />
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

function ObjectItem({ form, idx, objIdx, options, rmoveObj, getTables }) {
  const { data: fields, isLoading } = useQuery(
    ["GET_TABLE_FIELDS", form.watch(`rows_relation.${idx}.objects.${objIdx}.slug`)],
    () => {
      return constructorFieldService.getList({
        table_slug: form.watch(`rows_relation.${idx}.objects.${objIdx}.slug`),
        sort: "created_at",
      });
    },
    {
      enabled: !!form.watch(`rows_relation.${idx}.objects.${objIdx}.slug`),
      select: ({ fields }) =>
        fields.map((i) => ({
          label: i.label + " -> " + i.slug,
          value: i.slug,
          type: i.type,
          attributes: i.attributes ?? null,
        })),
      onSuccess: (data) => {
        form.setValue(`rows_relation.${idx}.objects.${objIdx}.fields_length`, data.length);
      },
    }
  );

  const relationTableSlug = form.watch(`rows_relation.${idx}.objects.${objIdx}.slug`);
const {tableSlug} = useParams();
  const { data: relationTables } = useQuery(["GET_RELATIONS_LIST", relationTableSlug], () => constructorRelationService.getList({ table_slug: relationTableSlug }, tableSlug), {
    enabled: !!relationTableSlug,
    select: (res) =>
      res.relations?.map((r) => ({
        value: r.table_from.slug,
        label: r.table_from.label,
        isRelationTable: r.table_to.slug === relationTableSlug,
        viewFields: r.view_fields,
        field_from: r.field_from,
        table_to: r.table_to,
      })),
  });

  const onObjectSelect = (slug) => {
    const selected = options.find((obj) => obj.value === slug);
    if (selected) {
      form.setValue(`rows_relation.${idx}.objects.${objIdx}.label`, selected.label);
      form.setValue(`rows_relation.${idx}.objects.${objIdx}.id`, selected.id);
    }
  };

  const onFieldChange = (values) => {
    const getField = (slug) => fields.find((r) => r.value === slug);
    const key = `rows_relation.${idx}.objects.${objIdx}.table_field_settings`;

    form.setValue(
      key,
      values.map((v) => ({
        field_slug: getField(v).value,
        field_type: getField(v).type,
        label: getField(v).label,
        table_slug: relationTableSlug,
        attributes: getField(v).attributes,
        table_to: getField(v).type === "LOOKUP" || getField(v).type === "LOOKUPS" ? relationTables.find((i) => i.field_from === v)?.table_to : undefined,
        view_fields: getField(v).type === "LOOKUP" || getField(v).type === "LOOKUPS" ? relationTables.find((i) => i.field_from === v)?.viewFields : undefined,
      }))
    );
  };

  const onFilterFieldSelect = (val) => {
    const curObj = form.watch(`rows_relation.${idx}.objects.${objIdx}`);
    form.watch(`values`).forEach((value, idx) => {
      value.objects.forEach((obj, objIdx) => {
        if (obj.id === curObj.id) {
          form.setValue(`rows_relation.${idx}.objects.${objIdx}.date_field_slug`, val);
        }
      });
    });
  };

  useEffect(() => {
    if (fields?.length) {
      form.setValue(
        `rows_relation.${idx}.objects.${objIdx}.table_field_settings`,
        fields
          .filter((f) => form.watch(`rows_relation.${idx}.objects.${objIdx}.table_field_settings_ids`).some((slug) => slug === f.value))
          .map((v) => ({
            field_slug: v.value,
            field_type: v.type,
            label: v.label,
            attributes: v.attributes,
            table_slug: relationTableSlug,
            table_to: v.type === "LOOKUP" || v.type === "LOOKUPS" ? relationTables?.find((i) => i.field_from === v.value)?.table_to : undefined,
            view_fields: v.type === "LOOKUP" || v.type === "LOOKUPS" ? relationTables?.find((i) => i.field_from === v.value)?.viewFields : undefined,
          }))
          .sort(
            (a, b) =>
              form.watch(`rows_relation.${idx}.objects.${objIdx}.table_field_settings_ids`).indexOf(a.field_slug) -
              form.watch(`rows_relation.${idx}.objects.${objIdx}.table_field_settings_ids`).indexOf(b.field_slug)
          )
      );
    }
  }, [fields, relationTables]);

  return (
    <div className={`${styles.form} ${styles.values}`}>
      <div className={styles.objectBox}>
        <FRow label="Object">
          {/* <HFSelect
            clearable
            style={{ width: "100%" }}
            options={options}
            control={form.control}
            onChange={(val) => onObjectSelect(val)}
            name={`rows_relation.${idx}.objects.${objIdx}.slug`}
          /> */}

          <HFAutocomplete
            name={`rows_relation.${idx}.objects.${objIdx}.slug`}
            control={form.control}
            fullWidth
            required
            options={options}
            onChange={(val) => onObjectSelect(val)}
            onFieldChange={(e) => {
              getTables(e.target.value);
            }}
          />
        </FRow>
        <FRow label="Relation table">
          <HFSelect
            style={{ width: "100%" }}
            clearable
            options={relationTables?.filter((r) => r.isRelationTable)}
            control={form.control}
            onChange={(val) => onFilterFieldSelect(val)}
            name={`rows_relation.${idx}.objects.${objIdx}.inside_relation_table_slug`}
          />
        </FRow>
        <FRow label="Fields">
          <div className={`${styles.fields} ${!fields?.length ? styles.border : ""}`}>
            {isLoading ? (
              <div className={styles.loader}>
                <CircularProgress />
              </div>
            ) : fields?.length ? (
              <HFMultipleAutocomplete
                onChange={onFieldChange}
                defaultValue={[]}
                control={form.control}
                field={{ attributes: { options: fields, is_multiselect: true } }}
                width="100%"
                name={`rows_relation.${idx}.objects.${objIdx}.table_field_settings_ids`}
              />
            ) : (
              <div className={styles.emptyBlock}>
                <ArrowUpwardIcon />
                <p>Choose an object</p>
              </div>
            )}
          </div>
        </FRow>
      </div>

      <PrimaryButton style={{ width: "100%" }} color="error" onClick={() => rmoveObj(objIdx)}>
        <Delete />
        <span>Delete object</span>
      </PrimaryButton>
    </div>
  );
}
