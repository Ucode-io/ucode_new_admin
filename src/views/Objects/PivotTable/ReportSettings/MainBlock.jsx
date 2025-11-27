import React, { useEffect, useMemo, useState } from "react";
import HFAutocomplete from "../../../../components/FormElements/HFAutocomplete";
import constructorTableService from "../../../../services/constructorTableService";
import styles from "./styles.module.scss";

export default function MainBlock({ form, tables, getTables, allTables }) {
  const onObjectSelect = (val) => {
    const selected = allTables.find((i) => i.slug === val);
    
    if (selected) {
      form.setValue("main_table_label", selected.label);
      form.setValue("main_table_slug", selected.slug);
    }
  };

  return (
    <div className={styles.mainBlock}>
      <p className={styles.title}>Main Setting</p>
      <div className={styles.select}>
        <HFAutocomplete
          name={"main_table_slug"}
          control={form.control}
          placeholder="Tables"
          fullWidth
          required
          options={tables}
          onChange={(val) => {
            onObjectSelect(val);
          }}
          onFieldChange={(e) => {
            getTables(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
