import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import HFTextField from "../../../../../FormElements/HFTextField";
import DrawerCard from "../../../../../DrawerCard";
import FRow from "../../../../../FormElements/FRow";
import runList from "../../../../../../utils/generateRunValues";
import FunctionSidebar from "../../../Functions/FunctionSIdebar";
import { useMenuSettingGetByIdQuery } from "../../../../../../services/menuSettingService";
import { store } from "../../../../../../store";
import "./style.scss";
import {
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useState } from "react";
import FunctionNodeBlock from "../NodeBlock/FunctionNodeBlock";

const FunctionNodeForm = ({ open, closeDrawer, data }) => {
  const [type, setType] = useState("success");
  const { setValue: setParentFormValue, getValues: getParentValues } =
    useFormContext();
  const nodes = getParentValues()?.steps;
  const index = nodes?.findIndex((node) => node?.ui_component?.id === data?.id);
  const selectedMenuTemplate = store.getState().menu.menuTemplate;

  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: nodes && getParentValues()?.steps[index]?.config,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });
  const { data: menuTemplate } = useMenuSettingGetByIdQuery({
    params: {
      template_id:
        selectedMenuTemplate?.id || "f922bb4c-3c4e-40d4-95d5-c30b7d8280e3",
    },
    menuId: "adea69cd-9968-4ad0-8e43-327f6600abfd",
  });
  const menuStyle = menuTemplate?.menu_template;

  const onSubmit = (values) => {
    setParentFormValue(`steps.${index}.config`, {
      ...values,
      type: "FUNCTION",
      callback_type: "success",
      request_info: {
        body: runList(values.fields),
        title: values.request_info.title,
        url: values.request_info.url,
      },
    });
    closeDrawer();
  };

  return (
    <DrawerCard
      title={"Function Node"}
      onClose={closeDrawer}
      open={open}
      onSaveButtonClick={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography fontSize={"16px"} fontWeight={600}>
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
        <FRow label="Title">
          <HFTextField
            control={control}
            name="title"
            fullWidth
            placeholder="Title"
          />
        </FRow>
        <FRow label="Description">
          <HFTextField
            control={control}
            name="description"
            fullWidth
            placeholder="Description"
          />
        </FRow>
        <FRow label="Function">
          <HFTextField
            control={control}
            placeholder="Function"
            name="request_info.title"
            fullWidth
          />
        </FRow>
        <FunctionSidebar
          menuStyle={menuStyle}
          setValue={setValue}
          integrated={true}
        />
        <FunctionNodeBlock
          control={control}
          fields={fields}
          append={append}
          remove={remove}
          setValue={setValue}
        />
      </form>
    </DrawerCard>
  );
};

export default FunctionNodeForm;
