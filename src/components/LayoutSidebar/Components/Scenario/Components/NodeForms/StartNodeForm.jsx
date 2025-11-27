import { useForm, useFormContext } from "react-hook-form";
import HFTextField from "../../../../../FormElements/HFTextField";
import DrawerCard from "../../../../../DrawerCard";
import FRow from "../../../../../FormElements/FRow";

const StartNodeForm = ({ open, closeDrawer, data }) => {
  const { setValue: setParentFormValue, getValues: getParentValues } =
    useFormContext();
  const nodes = getParentValues()?.steps;
  const index = nodes?.findIndex((node) => node?.ui_component?.id === data?.id);

  const { handleSubmit, control, watch } = useForm({
    defaultValues: nodes && getParentValues()?.steps[index]?.config,
  });

  const onSubmit = (values) => {
    setParentFormValue(`steps.${index}.config`, {
      ...values,
      type: "START",
      callback_type: "success",
    });
    closeDrawer();
  };

  return (
    <DrawerCard
      title={"Start Node"}
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
      </form>
    </DrawerCard>
  );
};

export default StartNodeForm;
