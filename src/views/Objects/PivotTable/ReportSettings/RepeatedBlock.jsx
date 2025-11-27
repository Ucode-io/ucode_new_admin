import React, { useEffect, useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import { useQuery } from "react-query";
import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { CircularProgress } from "@mui/material";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../components/FormElements/FRow";
import HFAutocomplete from "../../../../components/FormElements/HFAutocomplete";
import HFMultipleAutocomplete from "../../../../components/FormElements/HFMultipleAutocomplete";
import constructorFieldService from "../../../../services/constructorFieldService";
import constructorRelationService from "../../../../services/constructorRelationService";
import styles from "./filters.module.scss";
import { useParams } from "react-router-dom";

export default function RepeatedBlock({ form, tables, keyName, getTables }) {
  const { fields: objectFields, append, remove } = useFieldArray({ control: form.control, name: keyName });
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
          <RowItem key={row.id} remove={remove} keyName={keyName} idx={idx} form={form} options={computedOptions} getTables={getTables} />
        ))}
      </div>
      <PrimaryButton style={{ width: "32.8%" }} onClick={() => append({ slug: "" })}>
        <AddIcon />
        <span>Add new item</span>
      </PrimaryButton>
    </div>
  );
}

function RowItem({ form, options, idx, keyName, remove, getTables }) {
  const {tableSlug} = useParams();
  const { data: fields, isLoading } = useQuery(
    ["GET_TABLE_FIELDS", form.watch(`${keyName}.${idx}.slug`)],
    () => {
      return constructorFieldService.getList({ table_slug: form.watch(`${keyName}.${idx}.slug`), sort: "created_at" });
    },
    {
      enabled: !!form.watch(`${keyName}.${idx}.slug`),
      select: ({ fields }) =>
        fields.map((i) => ({
          label: i.label + " -> " + i.slug,
          value: i.slug,
          type: i.type,
          attributes: i.attributes ?? null,
        })),
      onSuccess: (data) => {
        form.setValue(`${keyName}.${idx}.fields_length`, data.length);
      },
    }
  );

  const { data: relationTables } = useQuery(
    ["GET_RELATIONS_LIST", form.watch(`${keyName}.${idx}.slug`)],
    () => constructorRelationService.getList({ table_slug: form.watch(`${keyName}.${idx}.slug`) }, tableSlug),
    {
      enabled: !!form.watch(`${keyName}.${idx}.slug`),
      select: (res) =>
        res.relations?.map((r) => ({
          value: r.table_from.slug,
          label: r.table_from.label,
          isRelationTable: r.table_to.slug === form.watch(`${keyName}.${idx}.slug`),
          viewFields: r.view_fields,
          field_from: r.field_from,
          table_to: r.table_to,
        })),
    }
  );

  const onObjectSelect = (slug) => {
    const selected = options.find((obj) => obj.value === slug);
    if (selected) {
      form.setValue(`${keyName}.${idx}.label`, selected.label);
      form.setValue(`${keyName}.${idx}.id`, selected.id);
      form.setValue(`${keyName}.${idx}.table_field_settings`, []);
    }
  };

  const onFieldChange = (values) => {

    const getField = (slug) => fields.find((r) => r.value === slug);

    const key = `${keyName}.${idx}.table_field_settings`;

    form.setValue(
      key,
      values.map((v) => ({
        field_slug: getField(v).value,
        field_type: getField(v).type,
        label: getField(v).label,
        table_slug: form.watch(`${keyName}.${idx}.slug`),
        attributes: getField(v).attributes,
        table_to: getField(v).type === "LOOKUP" || getField(v).type === "LOOKUPS" ? relationTables.find((i) => i.field_from === v)?.table_to : undefined,
        view_fields: getField(v).type === "LOOKUP" || getField(v).type === "LOOKUPS" ? relationTables.find((i) => i.field_from === v)?.viewFields : undefined,
      }))
    );
  };

  useEffect(() => {
    if (fields?.length) {
      form.setValue(
        `${keyName}.${idx}.table_field_settings`,
        fields
          .filter((f) => form.watch(`${keyName}.${idx}.table_field_settings_ids`).some((slug) => slug === f.value))
          .map((v) => ({
            field_slug: v.value,
            field_type: v.type,
            label: v.label,
            table_slug: form.watch(`${keyName}.${idx}.slug`),
            attributes: v.attributes,
            table_to: v.type === "LOOKUP" || v.type === "LOOKUPS" ? relationTables?.find((i) => i.field_from === v.value)?.table_to : undefined,
            view_fields: v.type === "LOOKUP" || v.type === "LOOKUPS" ? relationTables?.find((i) => i.field_from === v.value)?.viewFields : undefined,
          }))
      );
    }
  }, [fields, form, idx, keyName, relationTables]);

  return (
    <div className={styles.item}>
      <div className={styles.form}>
        <div className={styles.select}>
          <FRow label="Object">
            {/* <HFSelect
              required
              options={options}
              control={form.control}
              onChange={(val) => onObjectSelect(val)}
              name={`${keyName}.${idx}.slug`}
            /> */}

            <HFAutocomplete
              name={`${keyName}.${idx}.slug`}
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
        </div>
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
                name={`${keyName}.${idx}.table_field_settings_ids`}
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
      <PrimaryButton color="error" onClick={() => remove(idx)}>
        <Delete />
        <span>Delete item</span>
      </PrimaryButton>
    </div>
  );
}
