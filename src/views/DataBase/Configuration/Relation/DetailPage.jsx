import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { store } from "../../../../store";
import { generateGUID } from "../../../../utils/generateID";
import HFSelect from "../../../../components/FormElements/HFSelect";
import DrawerCard from "../../../../components/DrawerCard";
import FRow from "../../../../components/FormElements/FRow";
import { useTablesListQuery } from "../../../../services/tableService";
import listToOptions from "../../../../utils/listToOptions";
import { relationTypes } from "./RelationTypes";
import { useEffect } from "react";

const RelationDrawer = ({
  open,
  closeDrawer,
  selectedRelation,
  createRelation,
  updateRelation,
}) => {
  const { tableId, resourceId, projectId, tableSlug } = useParams();
  const envId = store.getState().company.environmentId;

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      table_id: tableId,
      project_id: projectId,
      id: generateGUID(),
      type: "",
      ...(selectedRelation ?? {}),
      table_from: selectedRelation?.table_from ?? tableSlug,
      resourceId,
      envId: envId,
    },
  });

  useEffect(() => {
    if (selectedRelation) {
      reset(selectedRelation);
    }
  }, [selectedRelation]);

  const { data: tables } = useTablesListQuery({
    params: { resourceId: resourceId, envId: envId },
    queryParams: {
      select: (res) => {
        return listToOptions(res.tables, "label", "slug");
      },
    },
  });

  const onSubmit = (values) => {
    if (selectedRelation) {
      updateRelation(values);
    } else createRelation(values);
    closeDrawer();
  };
  return (
    <DrawerCard
      title={!selectedRelation ? "Create field" : "Edit field"}
      onClose={closeDrawer}
      open={open}
      onSaveButtonClick={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FRow label="Table from">
          <HFSelect
            control={control}
            options={tables}
            name="table_from"
            autoFocus
            fullWidth
          />
        </FRow>
        <FRow label="Table to">
          <HFSelect
            control={control}
            options={tables}
            name="table_to"
            autoFocus
            fullWidth
          />
        </FRow>
        <FRow label="Relation type">
          <HFSelect
            options={relationTypes}
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

export default RelationDrawer;
