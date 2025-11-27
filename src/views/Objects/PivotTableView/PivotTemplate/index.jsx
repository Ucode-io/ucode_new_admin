import cloneDeep from "lodash.clonedeep";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import pivotService from "../../../../services/pivotService";
import FiltersItem from "./FiltersItem";
import RepeatedItem from "./RepeatedItem";
import RowsRelationItem from "./RowsRelationItem";
import ValuesItem from "./ValuesItem";
import styles from "./styles.module.scss";

export default function PivotTemplate(props) {
  const { id, form, modalKey, activeClickActionTabId } = props;

  const { data: dataList, isLoading } = useQuery(
    ["GET_REPORT_SETTING_BY_ID"],
    () => pivotService.getByIdReportSetting(id),
    {
      enabled: modalKey === "edit",
      onSuccess: (res) => {
        if (Object.keys(res).length) {
          form.reset({
            ...res,
            filters: res.filters?.map((i) => ({ ...i, table_guids: [] })),
            report_setting_id: id,
          });
          if (activeClickActionTabId)
            pivotService
              .getByIdPivotTemplateSetting(activeClickActionTabId)
              .then((resInner) => {
                form.setValue("instance_id", resInner?.instance_id);

                const resetValues = (key) => {
                  resInner?.[key]?.forEach((row) => {
                    const rowIdx = form
                      .watch(`${key}`)
                      .findIndex((i) => i.id === row.id);
                    form.setValue(
                      `${key}.${rowIdx}.order_number`,
                      row.order_number
                    );
                    if (row.join) {
                      form.setValue(`${key}.${rowIdx}.join`, true);
                    }
                    row.table_field_settings?.forEach((field) => {
                      if (field.checked) {
                        const fieldIdx = form
                          .watch(`${key}.${rowIdx}.table_field_settings`)
                          ?.findIndex((i) => i.field_slug === field.field_slug);
                        form.setValue(
                          `${key}.${rowIdx}.table_field_settings.${fieldIdx}.checked`,
                          true
                        );
                      }
                    });
                  });
                  if (key === "rows") {
                    const test = cloneDeep(form.watch(key));

                    test.sort((a, b) => {
                      if (!a.order_number) return 1;
                      if (!b.order_number) return -1;
                      return a.order_number - b.order_number;
                    });
                    form.setValue(key, test);
                  }
                };

                form.setValue(
                  `rows.${res.rows?.length}`,
                  res["rows_relation"]?.map((item, idx) => ({
                    join: true,
                    rowsRelationRow: true,
                    label: item.label,
                    order_number: resInner.rows_relation
                      ? resInner.rows_relation[idx].order_number
                      : "",
                    table_field_settings: [],
                  }))[0]
                );

                form.setValue(
                  "rows",
                  form
                    .watch("rows")
                    .sort((a, b) => a.order_number - b.order_number)
                );

                resetValues("rows");
                resetValues("columns");

                resInner?.rows_relation?.forEach((row, idx) => {
                  const rowIdx = form
                    .watch(`rows_relation`)
                    .findIndex((i) => i.label === row.label);
                  form.setValue(
                    `rows_relation.${rowIdx}.order_number`,
                    resInner.rows?.length + idx + 1
                  );
                  row.objects.forEach((object, obIdx) => {
                    const objIdx = form
                      .watch(`rows_relation.${rowIdx}.objects`)
                      .findIndex((i) => i.id === object.id);
                    form.setValue(
                      `rows_relation.${rowIdx}.objects.${objIdx}.order_number`,
                      resInner.rows?.length + obIdx + 1
                    );
                    form.setValue(
                      `rows_relation.${rowIdx}.objects.${objIdx}.relation_order_number`,
                      obIdx + 1
                    );
                    object.table_field_settings.forEach((field) => {
                      const fieldIdx = form
                        .watch(
                          `rows_relation.${rowIdx}.objects.${objIdx}.table_field_settings`
                        )
                        ?.findIndex((i) => i.field_slug === field.field_slug);
                      if (field.checked) {
                        form.setValue(
                          `rows_relation.${rowIdx}.objects.${objIdx}.table_field_settings.${fieldIdx}.checked`,
                          true
                        );
                      }
                    });
                  });
                });

                // merging res.values and resInner.values
                resInner?.values?.forEach((row) => {
                  const rowIdx = form
                    .watch("values")
                    .findIndex((i) => i.label === row.label);
                  row.objects.forEach((object) => {
                    const objIdx = form
                      .watch(`values.${rowIdx}.objects`)
                      ?.findIndex((i) => i.id === object.id);
                    object.table_field_settings.forEach((field) => {
                      const fieldIdx = form
                        .watch(
                          `values.${rowIdx}.objects.${objIdx}.table_field_settings`
                        )
                        ?.findIndex((i) => i.field_slug === field.field_slug);
                      if (field.checked) {
                        form.setValue(
                          `values.${rowIdx}.objects.${objIdx}.table_field_settings.${fieldIdx}.checked`,
                          true
                        );
                      }
                      // order of values' fields
                      form.setValue(
                        `values.${rowIdx}.objects.${objIdx}.table_field_settings.${fieldIdx}.order_number`,
                        field.order_number
                      );
                    });
                  });
                });

                // settings helper valuesFields object
                form.setValue(
                  "valuesFields",
                  form.watch("values")?.map((out) => ({
                    label: out.label,
                    table_field_settings: out.objects
                      .reduce(
                        (acc, cur) => [...acc, ...cur?.table_field_settings],
                        []
                      )
                      .sort((a, b) =>
                        a.order_number > b.order_number ? 1 : -1
                      ),
                  }))
                );

                // merging res.fileters and resInner.filters
                resInner?.filters?.forEach((filter) => {
                  const rowIdx = form
                    .watch("filters")
                    .findIndex((i) => i.slug === filter.slug);
                  if (filter.table_guids?.length) {
                    form.setValue(
                      `filters.${rowIdx}.table_guids`,
                      filter.table_guids
                    );
                  }
                });
              });
        }
      },
    }
  );

  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className={styles.templates}>
          <RepeatedItem form={form} rowName="rows" title="Rows" />
          <RowsRelationItem
            form={form}
            rowName="rows_relation"
            title="Row relations"
          />
          <RepeatedItem form={form} rowName="columns" title="Columns" />
          <ValuesItem form={form} rowName="values" title="Values" />
          <FiltersItem
            form={form}
            rowName="filters"
            title="Filters"
            dataList={dataList}
          />
        </div>
      )}
    </div>
  );
}
