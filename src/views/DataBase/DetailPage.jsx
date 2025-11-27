import { useForm } from "react-hook-form";
import DrawerCard from "../../components/DrawerCard";
import FRow from "../../components/FormElements/FRow";
import HFTextField from "../../components/FormElements/HFTextField";
import { useParams } from "react-router-dom";
import {
  useObjectCreateMutation,
  useObjectGetByIdQuery,
  useObjectUpdateMutation,
} from "../../services/constructorObjectService";
import { useQueryClient } from "react-query";
import { store } from "../../store";
import { showAlert } from "../../store/alert/alert.thunk";

const DataBaseDetailPage = ({ fields, closeDrawer, open, objectId }) => {
  const { control, handleSubmit, reset } = useForm();
  const { resourceId, tableSlug } = useParams();
  const queryClient = useQueryClient();

  const { isLoading } = useObjectGetByIdQuery({
    id: objectId,
    resourceId,
    tableSlug,
    queryParams: {
      enabled: Boolean(objectId),
      cacheTime: 10,
      onSuccess: (res) => {
        reset(res.data?.response ?? {});
      },
    },
  });

  const { mutate: createObject, isLoading: createLoading } =
    useObjectCreateMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Success", "success"));
        closeDrawer();
        queryClient.removeQueries(["OBJECTS", { tableSlug }]);
      },
    });

  const { mutate: updateObject, isLoading: updateLoading } =
    useObjectUpdateMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Success", "success"));
        closeDrawer();
        queryClient.removeQueries(["OBJECTS", { tableSlug }]);
      },
    });

  const onSubmit = (values) => {
    if (objectId) {
      updateObject({
        ...values,
        tableSlug,
        resourceId,
      });
    } else
      createObject({
        ...values,
        tableSlug,
        resourceId,
      });
  };

  return (
    <DrawerCard
      title={!objectId ? "Create object" : "Edit object"}
      onClose={closeDrawer}
      open={open}
      onSaveButtonClick={handleSubmit(onSubmit)}
      loader={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields?.map((field) => (
          <FRow label={field.slug}>
            <HFTextField
              control={control}
              name={field.slug}
              autoFocus
              fullWidth
              label="Slug"
            />
          </FRow>
        ))}
      </form>
    </DrawerCard>
  );
};

export default DataBaseDetailPage;
