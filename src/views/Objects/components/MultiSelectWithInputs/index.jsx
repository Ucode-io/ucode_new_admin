import React, { useMemo, useRef, useState } from "react";
import useOnClickOutside from "use-onclickoutside";
import { useQuery } from "react-query";

import { Tooltip } from "@mui/material";
import { Close } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import styles from "./styles.module.scss";
import pivotService from "../../../../services/pivotService";
import useBooleanState from "../../../../hooks/useBooleanState";
import HFTextField from "../../../../components/FormElements/HFTextField";
import HFSelect from "../../../../components/FormElements/HFSelect";

export default function MultiSelectWithInputs({ values, options, onFieldChange, form, idx, objIdx }) {
  const ref = useRef();

  const { data: formulas } = useQuery("GET_VALUE_FORMULAS", () => pivotService.dynamicReportFormula(), {
    select: (res) => {
      return res.data?.values?.map((i) => ({ label: i, value: i })) ?? [];
    },
  });

  const [visible, showPopover, hidePopover] = useBooleanState(false);
  const [search, setSearch] = useState("");

  const computedOptions = useMemo(
    () => options?.filter((item) => !item.type.includes("LOOKUP") && item.value.includes(search)),
    [options, search]
  );

  useOnClickOutside(ref, hidePopover);

  const handleChange = (value) => {
    onFieldChange(
      values?.some((i) => i.field_slug === value.value)
        ? values.filter((i) => i.field_slug !== value.value)
        : [
            ...values,
            {
              field_slug: value.value,
              field_type: value.type,
              label: value.label,
              table_slug: form.watch(`values.${idx}.objects.${objIdx}.slug`),
            },
          ]
    );
    setSearch("");
  };

  const handleRemove = (value) => {
    onFieldChange(values.filter((i) => i.field_slug !== value));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.values}>
        {values?.map((value, fieldIdx) => (
          <div className={styles.value}>
            <Tooltip title={options.find((i) => i.value === value.field_slug).label}>
              <HFTextField
                sx={{ minWidth: "200px" }}
                control={form.control}
                placeholder={options.find((i) => i.value === value.field_slug).label}
                name={`values.${idx}.objects.${objIdx}.table_field_settings.${fieldIdx}.label`}
              />
            </Tooltip>
            <HFSelect
              clearable
              placeholder="Формула"
              control={form.control}
              options={formulas}
              name={`values.${idx}.objects.${objIdx}.table_field_settings.${fieldIdx}.aggregate_formula`}
            />
            <Close onClick={() => handleRemove(value.field_slug)} style={{ cursor: "pointer" }} />
          </div>
        ))}
      </div>
      <input
        onClick={() => {
          showPopover();
        }}
        placeholder="Values"
        className={styles.searchInput}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ArrowDropDownIcon className={styles.downIcon} />
      {visible && (
        <div className={styles.popover} ref={ref}>
          <div className={styles.items}>
            {computedOptions?.length ? (
              computedOptions.map((item) => (
                <div
                  style={{
                    backgroundColor: values?.some((value) => value.field_slug === item.value) ? "#e4f2ff" : "",
                  }}
                  key={item.value + "#" + item.label}
                  className={styles.item}
                  onClick={() => handleChange(item)}
                >
                  {`${item.label} - ${item.value}`}
                </div>
              ))
            ) : (
              <div className={styles.items}>
                <div className={styles.item}>No options</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
