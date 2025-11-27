import styles from "./style.module.scss";
import HFTextField from "../../../../../../components/FormElements/HFTextField";
import FRow from "../../../../../../components/FormElements/FRow";
import HFSelect from "../../../../../../components/FormElements/HFSelect";
import HFSwitch from "../../../../../../components/FormElements/HFSwitch";
import { useQuery } from "react-query";
import constructorFunctionService from "../../../../../../services/constructorFunctionService";

const InventoryBarcodeAttributes = ({ control }) => {
  const { data: { functions: list } = [] } = useQuery("GET_FUNCTIONS", () =>
    constructorFunctionService.getList({})
  );

  const options = list?.map((v) => ({ value: v.id, label: v.name }));

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Settings</h2>
      </div>
      <div className="p-2">
        <FRow label={"Function"}>
          <HFSelect
            name="attributes.function"
            control={control}
            fullWidth
            options={options}
          />
        </FRow>
        <FRow label={"Automatic"}>
          <HFSwitch control={control} name={"attributes.automatic"} />
        </FRow>
        <FRow label={"Press enter (If this ON you should click enter to send query)"}>
          <HFSwitch control={control} name={"attributes.pressEnter"} />
        </FRow>
        <FRow label="Length">
          <HFTextField
            type="number"
            name="attributes.length"
            control={control}
            fullWidth
          />
        </FRow>
      </div>
    </>
  );
};

export default InventoryBarcodeAttributes;
