import { Box, Card, Modal, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import ClearIcon from "@mui/icons-material/Clear";
import HFTextField from "../../../components/FormElements/HFTextField";
import CreateButton from "../../../components/Buttons/CreateButton";
import SaveButton from "../../../components/Buttons/SaveButton";
import { store } from "../../../store";
import { showAlert } from "../../../store/alert/alert.thunk";
import { useTablesListQuery } from "../../../services/constructorTableService";
import { useMemo, useState } from "react";
import HFSelect from "../../../components/FormElements/HFSelect";
import { useFieldsListQuery } from "../../../services/constructorFieldService";
import FRow from "../../../components/FormElements/FRow";
import { useRelationsListQuery } from "../../../services/constructorRelationService";
import {
  useConnectionCreateMutation,
  useConnectionGetByIdQuery,
  useConnectionUpdateMutation,
} from "../../../services/auth/connectionService";

const ConnectionCreateModal = ({ closeModal, modalType, connectionId }) => {
  const queryClient = useQueryClient();
  const { clientId } = useParams();
  const envId = store.getState().company.environmentId;
  const projectId = store.getState().company.projectId;
  const [relations, setRelations] = useState([]);

  const { control, handleSubmit, reset, watch, getValues } = useForm({
    defaultValues: {
      name: "",
      table_slug: "",
      view_slug: "",
      client_type_id: clientId,
      "project-id": projectId,
      guid: "",
    },
  });

  const tableSlug = watch("table_slug");
  const mainTableSlug = watch("main_table_slug");

  const { isLoading } = useConnectionGetByIdQuery({
    id: connectionId,
    queryParams: {
      enabled: Boolean(modalType === "UPDATE"),
      onSuccess: (res) => {
        reset(res.data.response);
      },
    },
  });

  const { mutateAsync: createConnection, isLoading: createLoading } =
    useConnectionCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["GET_CONNECTION_LIST"]);
        store.dispatch(showAlert("Успешно", "success"));
        closeModal();
      },
    });
  const { mutateAsync: updateConnection, isLoading: updateLoading } =
    useConnectionUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["GET_CONNECTION_LIST"]);
        store.dispatch(showAlert("Успешно", "success"));
        closeModal();
      },
    });

  const onSubmit = (data) => {
    const relation = relations?.find((i) => i.slug === getValues().table_slug);
    if (modalType === "NEW") {
      createConnection({ ...data, field_slug: relation?.field_slug });
    } else {
      updateConnection({ ...data, guid: connectionId });
    }
  };

  const { data: projectTables } = useTablesListQuery({
    params: {
      envId: envId,
    },
    queryParams: {
      select: (res) => res.tables,
    },
  });

  const { data: fieldsData } = useFieldsListQuery({
    queryParams: {
      enabled: Boolean(tableSlug),
    },
    params: {
      table_slug: tableSlug,
      "project-id": projectId,
    },
  });

  const { data: relationsData } = useRelationsListQuery({
    queryParams: {
      enabled: Boolean(mainTableSlug),
    },
    params: {
      table_slug: mainTableSlug,
      relation_slug: mainTableSlug,
      "project-id": projectId,
    },
  });

  const computedFilteredRelations = useMemo(() => {
    if (!relationsData?.relations) return;
    const array = [];
    let from = "";
    relationsData?.relations.forEach((element) => {
      if (element?.table_from?.slug === mainTableSlug) from = "to";
      else if (element?.table_to?.slug === mainTableSlug) from = "from";
      if (element?.[`table_${from}`]) {
        element[`table_${from}`].field_slug = element?.[`field_${from}`];
        element[`table_${from}`].type = element?.type;
        array.push(element[`table_${from}`]);
      }
    });
    setRelations(array ?? []);
    return array ?? [];
  }, [relationsData]);

  const computedOptions = useMemo(() => {
    return projectTables?.map((item) => ({
      label: item?.label,
      value: item?.slug,
    }));
  }, [projectTables]);

  const computedViewOptions = useMemo(() => {
    return fieldsData?.fields?.map((item) => ({
      label: item?.label,
      value: item?.slug,
    }));
  }, [fieldsData]);

  const computedTableSlug = useMemo(() => {
    if (!computedFilteredRelations) return [];
    return computedFilteredRelations?.map((item) => ({
      label: item?.label,
      value: item?.slug,
    }));
  }, [computedFilteredRelations]);

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {modalType === "NEW" ? "Create connection" : "Edit connection"}
            </Typography>
            <ClearIcon
              color="primary"
              onClick={closeModal}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>

          <form action="" className="form">
            <FRow label="Table slug">
              <HFTextField
                fullWidth
                label="Value"
                control={control}
                name="name"
                required
              />
            </FRow>
            <FRow label="Main table slug">
              <HFSelect
                fullWidth
                label="Table"
                control={control}
                name="main_table_slug"
                options={computedOptions}
                required
              />
            </FRow>
            <FRow label="Table slug">
              <HFSelect
                fullWidth
                label="Table"
                control={control}
                name="table_slug"
                options={computedTableSlug}
                required
              />
            </FRow>
            <FRow label="Field slug">
              <HFSelect
                fullWidth
                label="Table"
                control={control}
                name="view_slug"
                options={computedViewOptions}
                required
              />
            </FRow>

            <div className="btns-row">
              {modalType === "NEW" ? (
                <CreateButton
                  onClick={handleSubmit(onSubmit)}
                  loading={createLoading || updateLoading}
                />
              ) : (
                <SaveButton
                  onClick={handleSubmit(onSubmit)}
                  loading={createLoading || updateLoading}
                />
              )}
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default ConnectionCreateModal;
