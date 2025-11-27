import styles from "../style.module.scss";
import { MdEmergency } from "react-icons/md";
import { useFieldArray } from "react-hook-form";
import HFTextField from "../../../../FormElements/HFTextField";
import HFSelect from "../../../../FormElements/HFSelect";
import HFTextArea from "../../../../FormElements/HFTextArea";
import { Button, Checkbox } from "@mui/material";
import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

const ApiQueryBox = ({ control, options, fieldName, title, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });
  return (
    <div className={styles.element}>
      <p>{title}</p>
      <div>
        {fields.map((field, index) => (
          <div className={styles.forms} key={field.id}>
            <div className={styles.form}>
              <div className={styles.top}>
                <HFTextField
                  control={control}
                  placeholder="Name"
                  name={`${fieldName}.${index}.slug`}
                  inputRightElement={
                    <Checkbox
                      icon={<MdEmergency />}
                      {...register(`${fieldName}.${index}.required`, {})}
                      defaultChecked={fieldName.includes("path") ? true : false}
                      style={{
                        pointerEvents: fieldName.includes("path")
                          ? "none"
                          : "all",
                      }}
                    />
                  }
                />

                <HFSelect
                  options={options}
                  control={control}
                  required
                  placeholder="Select..."
                  name={`${fieldName}.${index}.type`}
                />

                <HFTextArea
                  control={control}
                  placeholder="Default"
                  name={`${fieldName}.${index}.title`}
                  minHeight="50px"
                />
              </div>
              <div className={styles.bottom}>
                <HFTextField
                  control={control}
                  name={`${fieldName}.${index}.desc`}
                  placeholder="Description"
                  fullWidth
                />
              </div>
            </div>

            <div className={styles.actions}>
              <Delete onClick={() => remove(fields.length - 1)} />
            </div>
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          color="#6B6B6B"
          onClick={() => {
            append({
              slug: "",
              desc: "",
              title: "",
              type: "",
              required: false,
            });
          }}
        >
          <AddIcon boxSize={3} mr={2} />
          add a path param
        </Button>
      </div>
    </div>
  );
};

export default ApiQueryBox;
