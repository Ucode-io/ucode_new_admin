import { useForm } from "react-hook-form";
import {
  useTableCreateMutation,
  useTableGetByIdQuery,
  useTableUpdateMutation,
} from "../../../../../services/tableService";
import { generateGUID } from "../../../../../utils/generateID";
import { store } from "../../../../../store";
import DrawerCard from "../../../../DrawerCard";
import FRow from "../../../../FormElements/FRow";
import HFTextField from "../../../../FormElements/HFTextField";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import HFTextArea from "../../../../FormElements/HFTextArea";
import { useQueryClient } from "react-query";

const DataBaseTableForm = ({
  open,
  closeDrawer,
  selectedTable,
  selectedResource,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const company = store.getState().company;
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      sections: [],
      id: generateGUID(),
      type: "",
      project_id: company.projectId,
      resourceId: selectedResource,
      envId: company.environmentId,
    },
  });

  const { isLoading } = useTableGetByIdQuery({
    resourceId: selectedResource,
    tableId: selectedTable,
    envId: company.environmentId,
    queryParams: {
      enabled: Boolean(selectedTable),
      cacheTime: 10,
      onSuccess: (res) => {
        reset({
          ...res,
          resourceId: selectedResource,
          envId: company.environmentId,
        });
      },
    },
  });

  const { mutate: createTable, isLoading: createLoading } =
    useTableCreateMutation({
      onSuccess: () => {
        dispatch(showAlert("Успешно!", "success"));
        closeDrawer();
        queryClient.refetchQueries("TABLES");
      },
    });

  const { mutate: updateTable, isLoading: updateLoading } =
    useTableUpdateMutation({
      onSuccess: () => {
        dispatch(showAlert("Успешно!", "success"));
        closeDrawer();
        queryClient.refetchQueries("TABLES");
      },
      onError: (err) => {
        console.log("ERRRR");
      },
    });

  const onSubmit = (values) => {
    if (selectedTable) {
      updateTable(values);
    } else createTable(values);
  };

  return (
    <DrawerCard
      title={"Table Drawer"}
      onClose={closeDrawer}
      open={open}
      onSaveButtonClick={handleSubmit(onSubmit)}
      loader={createLoading || updateLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FRow label="Title">
          <HFTextField control={control} name="label" autoFocus fullWidth />
        </FRow>
        <FRow label="Description">
          <HFTextArea
            control={control}
            name="description"
            autoFocus
            fullWidth
          />
        </FRow>
        <FRow label="Slug">
          <HFTextField control={control} name="slug" autoFocus fullWidth />
        </FRow>
      </form>
    </DrawerCard>
  );
};

export default DataBaseTableForm;
