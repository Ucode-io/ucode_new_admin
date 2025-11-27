import {useWatch} from "react-hook-form";
import FRow from "../../../../../../components/FormElements/FRow";
import HFMultipleAutocomplete from "../../../../../../components/FormElements/HFMultipleAutocomplete";
import HFTextField from "../../../../../../components/FormElements/HFTextField";
import styles from "../style.module.scss";

const DefaultValueBlock = ({control}) => {
  const field = useWatch({
    control,
  });

  return (
    <>
      {field?.type !== "RANDOM_UUID" && (
        <FRow label="Default value" classname={styles.custom_label}>
          {field?.type === "MULTISELECT" ? (
            <HFMultipleAutocomplete
              control={control}
              name={"attributes.defaultValue"}
              width="100%"
              field={field}
              placeholder={"Default value"}
              className={styles.input}
            />
          ) : (
            <HFTextField
              fullWidth
              name="attributes.defaultValue"
              control={control}
              className={styles.input}
            />
          )}
        </FRow>
      )}
    </>
  );
};

export default DefaultValueBlock;
