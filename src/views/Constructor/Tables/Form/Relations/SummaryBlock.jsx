import { Delete } from "@mui/icons-material";
import { useFieldArray } from "react-hook-form";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import styles from "./style.module.scss";
import FRow from "../../../../../components/FormElements/FRow";
import { Box } from "@mui/material";

const formulaTypes = [
  {
    value: "sum",
    label: "Sum ()",
  },
  {
    value: "average",
    label: "Avg ()",
  },
];

const SummaryBlock = ({
  control,
  computedFieldsListOptions,
  isViewSettings = false,
}) => {
  const {
    fields: summaries,
    insert,
    remove,
  } = useFieldArray({
    control,
    name: isViewSettings ? "attributes.summaries" : "summaries",
    keyName: "key",
  });

  const addNewSummary = () => {
    insert({
      field_name: "",
      formula_name: "",
    });
  };

  const deleteSummary = (index) => {
    remove(index);
  };

  return (
    <Box>
      {isViewSettings && <FRow label="Summary"></FRow>}

      <div className="">
        {summaries?.map((summary, index) => (
          <div key={summary.key} className="flex align-center gap-2 mb-2">
            <HFSelect
              options={computedFieldsListOptions}
              placeholder="Field"
              control={control}
              fullWidth
              name={
                isViewSettings
                  ? `attributes.summaries[${index}].field_name`
                  : `summaries[${index}].field_name`
              }
            />
            <HFSelect
              control={control}
              fullWidth
              placeholder="Formula"
              name={
                isViewSettings
                  ? `attributes.summaries[${index}].formula_name`
                  : `summaries[${index}].formula_name`
              }
              options={formulaTypes}
            />
            <RectangleIconButton
              color="error"
              onClick={() => deleteSummary(index)}
            >
              <Delete color="error" />
            </RectangleIconButton>
          </div>
        ))}

        <div className={styles.summaryButton} onClick={addNewSummary}>
          <button type="button">+ Create new</button>
        </div>
      </div>
    </Box>
  );
};

export default SummaryBlock;
