import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import HFTextField from "../../../../../FormElements/HFTextField";
import DrawerCard from "../../../../../DrawerCard";
import FRow from "../../../../../FormElements/FRow";
import { Button, Divider, Typography } from "@mui/material";
import NodeBlock from "../NodeBlock/ConditionNodeBlock";
import { generateGUID } from "../../../../../../utils/generateID";

const ConditionNodeForm = ({ open, closeDrawer, data }) => {
  const { setValue: setParentFormValue, getValues: getParentValues } =
    useFormContext();
  const nodes = getParentValues().steps;
  const index = nodes?.findIndex((node) => node?.ui_component?.id === data?.id);
  const { handleSubmit, control, watch, setValue } = useForm({
    defaultValues: getParentValues()?.steps[index]?.config,
  });

  const {
    fields: blockFields,
    append: blockAppend,
    remove: blockRemove,
  } = useFieldArray({
    control,
    name: "request_info.blocks",
  });

  const onSubmit = (values) => {
    // queryStore.startConditionLoader();
    setParentFormValue(`steps.${index}.config`, {
      ...values,
      type: "CONDITION",
      callback_type: "failure",
      node_id: data.id,
    });
    closeDrawer();
  };

  return (
    <DrawerCard
      title={"Condition Node"}
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
          Condition Block
        </Typography>
        {blockFields.map((item, blockIndex) => (
          <>
            <NodeBlock
              control={control}
              blockIndex={blockIndex}
              watch={watch}
              setValue={setValue}
            />
          </>
        ))}
        <Divider />
        <Button
          variant="contained"
          style={{
            margin: "10px",
            marginLeft: "0",
          }}
          onClick={() =>
            blockAppend({
              source_handle_id: generateGUID(),
              parent_id: data?.id,
            })
          }
        >
          Add block
        </Button>
        <Button
          variant="contained"
          onClick={() => blockRemove(blockFields.length - 1)}
        >
          Remove block
        </Button>
      </form>
    </DrawerCard>
  );
};

export default ConditionNodeForm;
