import React, { useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { useFieldArray } from "react-hook-form";

import AddIcon from "@mui/icons-material/Add";
import { CircularProgress } from "@mui/material";
import { Delete } from "@mui/icons-material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import HFSelect from "../../../../components/FormElements/HFSelect";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../components/FormElements/FRow";
import constructorFieldService from "../../../../services/constructorFieldService";
import styles from "./filters.module.scss";
import HFAutocomplete from "../../../../components/FormElements/HFAutocomplete";

export default function FiltersBlock({ form, tables, getTables }) {
  const { fields: objectFields, append, remove } = useFieldArray({ control: form.control, name: "filters" });
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
          <RowItem key={row.slug} remove={remove} idx={idx} form={form} options={computedOptions} getTables={getTables} />
        ))}
      </div>
      <PrimaryButton style={{ width: "32.8%" }} onClick={() => append({ slug: "" })}>
        <AddIcon />
        <span>Add new item</span>
      </PrimaryButton>
    </div>
  );
}

function RowItem({ form, options, idx, remove, getTables }) {
  const { data: fields, isLoading } = useQuery(
    ["GET_TABLE_FIELDS", form.watch(`filters.${idx}.slug`)],
    () => {
      return constructorFieldService.getList({ table_slug: form.watch(`filters.${idx}.slug`), sort: "created_at" });
    },
    {
      enabled: !!form.watch(`filters.${idx}.slug`),
      select: ({ fields }) => fields.map((i) => ({ label: i.label, value: i.slug, type: i.type })),
    }
  );

  const onObjectSelect = (slug) => {
    const selected = options.find((obj) => obj.value === slug);
    if (selected) {
      form.setValue(`filters.${idx}.label`, selected.label);
      form.setValue(`filters.${idx}.id`, selected.id);
    }
  };

  const onFieldsChange = (field) => {
    const getField = (slug) => fields.find((r) => r.value === slug);

    form.setValue(`filters.${idx}.field`, {
      field_slug: getField(field).value,
      field_type: getField(field).type,
      label: getField(field).label,
      table_slug: form.watch(`filters.${idx}.slug`),
    });
  };

  useEffect(() => {
    if (fields?.length) {
      const foundField = fields.find((f) => form.watch(`filters.${idx}.field_id`) === f.value);
      if (foundField)
        form.setValue(`filters.${idx}.field`, {
          field_slug: foundField.value,
          field_type: foundField.type,
          label: foundField.label,
          table_slug: form.watch(`filters.${idx}.slug`),
        });
    }
  }, [fields]);

  return (
    <div className={styles.item}>
      <div className={styles.form}>
        <div className={styles.select}>
          <FRow label="Object">
            {/* <HFSelect options={options} control={form.control} onChange={onObjectSelect} name={`filters.${idx}.slug`} /> */}

            <HFAutocomplete
              control={form.control}
              fullWidth
              required
              options={options}
              onChange={onObjectSelect}
              name={`filters.${idx}.slug`}
              onFieldChange={(e) => {
                getTables(e.target.value);
              }}
            />
          </FRow>
        </div>
        <FRow label="Fields">
          <div className={styles.fields}>
            {isLoading ? (
              <div className={styles.loader}>
                <CircularProgress />
              </div>
            ) : fields?.length ? (
              <HFSelect options={fields} control={form.control} onChange={onFieldsChange} name={`filters.${idx}.field_id`} />
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
