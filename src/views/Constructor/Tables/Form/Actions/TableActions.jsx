import React from "react";
import { useFieldArray } from "react-hook-form";
import styles from "./style.module.scss";
import TableRow from "./TableRow";

function TableActions({ control, typeList, slug, setValue }) {
  const {
    fields: relation,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "attributes.additional_parameters",
    keyName: "key",
  });

  const addNewSummary = () => {
    append({
      key: "row_click_action",
      value: "",
    });
  };
  return (
    <div>
      <div className="">
        {relation?.length > 0 && (
          <div className={styles.actionSettingBlock}>
            {relation?.map((summary, index) => (
              <TableRow summary={summary} control={control} index={index} update={update} remove={remove} slug={slug} relation={relation} typeList={typeList} setValue={setValue} />
            ))}
          </div>
        )}

        <div className={styles.summaryButton} onClick={addNewSummary}>
          <button type="button">+ Create new</button>
        </div>
      </div>
    </div>
  );
}

export default TableActions;
