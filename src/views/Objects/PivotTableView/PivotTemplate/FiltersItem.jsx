import React, { useState } from "react";
import { useQuery } from "react-query";

import constructorObjectService from "../../../../services/constructorObjectService";
import HFMultipleAutocomplete from "../../../../components/FormElements/HFMultipleAutocomplete";
import FRow from "../../../../components/FormElements/FRow";
import useDebounce from "../../../../hooks/useDebounce";
import styles from "./styles.module.scss";
import { useWatch } from "react-hook-form";

export default function FiltersItem(props) {
  const { form, rowName, title, dataList } = props;

  return (
    <div className={`${styles.wrapper} ${styles.filters}`}>
      <div className={styles.itemHead}>
        <p className={styles.title}>{title}</p>
      </div>
      <div className={styles.items}>
        <div className="p-1">
          {dataList?.filters?.map((row, idx) => (
            <Item key={row.id} row={row} idx={idx} form={form} rowName={rowName} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Item(props) {
  const { row, form, idx } = props;
  const [debouncedValue, setDebouncedValue] = useState("");
  const tableGuids = useWatch({ control: form.control, name: `filters.${idx}.table_guids` });
  const mainTableSlug = useWatch({ control: form.control, name: "main_table_slug" });

  // console.log("table guid => ", row.field_id, tableGuids);

  const { data } = useQuery(
    ["GET_OBJECT_LIST", row.slug, debouncedValue, tableGuids],
    () =>
      constructorObjectService.groupByList(
        mainTableSlug,
        row.slug,
        { data: { additional_values: tableGuids } },
        {
          limit: 10,
          project: row.field_id,
          search: debouncedValue,
        }
      ),
    {
      enabled: !!mainTableSlug,
      select: (data) => {
        return (
          data.data?.response.map((i) => ({
            label: i[row.field.field_slug],
            value: i.guid,
          })) ?? []
        );
      },
    }
  );

  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);

  return (
    <div className={styles.filterItem}>
      <FRow label={row.label}>
        <HFMultipleAutocomplete
          onInputChange={inputChangeHandler}
          defaultValue={[]}
          control={form.control}
          field={{ attributes: { options: data, is_multiselect: true } }}
          width="100%"
          name={`filters.${idx}.table_guids`}
        />
      </FRow>
    </div>
  );
}
