import { useForm } from "react-hook-form";
import HFTextField from "../../../../../FormElements/HFTextField";
import DrawerCard from "../../../../../DrawerCard";
import FRow from "../../../../../FormElements/FRow";
import { useEffect } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

const FinishNodeForm = ({
  open,
  closeDrawer,
  getParentValues,
  index,
  setParentFormValue,
  type,
  setType,
  callback_type,
}) => {
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: getParentValues()?.steps[index]?.config,
  });

  const onSubmit = (values) => {
    setParentFormValue(`steps.${index}.config`, {
      ...values,
      type: "FINISH",
      callback_type: type,
    });
    closeDrawer();
    setTimeout(() => {
      // setLoader(false);
    }, 10);
  };
  useEffect(() => {
    if (callback_type) {
      setType(callback_type);
    }
  }, [callback_type]);

  return (
    <DrawerCard
      title={"Finish Node"}
      onClose={closeDrawer}
      open={open}
      onSaveButtonClick={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FRow label="Title">
          <HFTextField control={control} name="title" autoFocus fullWidth />
        </FRow>
        <FRow label="Description">
          <HFTextField
            control={control}
            name="description"
            autoFocus
            fullWidth
          />
        </FRow>
        <Typography fontSize={"16px"} fontWeight={600} mb={2}>
          Basic data
        </Typography>
        <FormControl>
          <RadioGroup
            defaultValue={
              getParentValues(`steps.${index}.config.callback_type`) || type
            }
            value={type}
            onChange={(e) => {
              setValue("callback_type", e.target.value);
              setType(e.target.value);
            }}
          >
            <Box spacing={5} direction="row">
              <FormControlLabel
                control={<Radio />}
                value="success"
                label={"Success"}
              />

              <FormControlLabel
                control={<Radio />}
                value="failure"
                label={"Error"}
              />
            </Box>
          </RadioGroup>
        </FormControl>
      </form>
    </DrawerCard>
  );
};

export default FinishNodeForm;
