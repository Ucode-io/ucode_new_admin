import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { store } from "../../../../store";
import { generateGUID } from "../../../../utils/generateID";
import HFSelect from "../../../../components/FormElements/HFSelect";
import { fieldTypes } from "./FieldTypes";
import DrawerCard from "../../../../components/DrawerCard";
import FRow from "../../../../components/FormElements/FRow";
import HFTextField from "../../../../components/FormElements/HFTextField";
import { useEffect } from "react";

const FieldDrawer = ({
  open,
  closeDrawer,
  selectedField,
  createField,
  updateField,
}) => {
  const { tableId, resourceId } = useParams();
  const envId = store.getState().company.environmentId;

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      ...(selectedField ?? {}),
      attributes: {},
      label: "test2",
      slug: "",
      table_id: tableId,
      id: generateGUID(),
      type: "",
      resourceId,
      envId: envId,
    },
  });

  useEffect(() => {
    if (selectedField) {
      reset(selectedField);
    }
  }, [selectedField]);

  const onSubmit = (values) => {
    if (selectedField) {
      updateField(values);
    } else createField(values);
    closeDrawer();
  };
  return (
    <DrawerCard
      title={!selectedField ? "Create field" : "Edit field"}
      onClose={closeDrawer}
      open={open}
      onSaveButtonClick={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FRow label="Field slug">
          <HFTextField control={control} name="slug" autoFocus fullWidth />
        </FRow>
        <FRow label="Field slug">
          <HFSelect
            options={fieldTypes}
            control={control}
            name="type"
            autoFocus
            fullWidth
          />
        </FRow>
      </form>
    </DrawerCard>
  );
};

export default FieldDrawer;
