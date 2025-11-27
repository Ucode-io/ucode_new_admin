import { Delete } from "@mui/icons-material";
import { useFieldArray } from "react-hook-form";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import styles from "./style.module.scss";

const types = [
  {
    value: "click",
    label: "Click",
  },
  {
    value: "go_to_page",
    label: "Detail Page",
  },
];
const rowActions = [
  {
    value: "click",
    label: "Click",
  },
];

const RowBlock = ({ control }) => {
  const {
    fields: rows,
    insert,
    remove,
  } = useFieldArray({
    control,
    name: "action_relations",
    keyName: "key",
  });

  const addNewSummary = () => {
    insert({
      key: "",
      value: "",
    });
  };

  const deleteSummary = (index) => {
    remove(index);
  };

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Row Click</h2>
      </div>

      <div className="p-2">
        {rows?.map((summary, index) => (
          <div key={summary.key} className="flex align-center gap-2 mb-2">
            <HFSelect
              options={rowActions}
              placeholder="Field"
              control={control}
              fullWidth
              name={`action_relations[${index}].key`}
            />
            <HFSelect
              control={control}
              fullWidth
              placeholder="Formula"
              name={`action_relations[${index}].value`}
              options={types}
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
    </>
  );
};

export default RowBlock;
