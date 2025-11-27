import {Card, Modal, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import {useQueryClient} from "react-query";
import ClearIcon from "@mui/icons-material/Clear";
import {store} from "../../../../../store";
import CreateButton from "../../../../Buttons/CreateButton";
import SaveButton from "../../../../Buttons/SaveButton";
import HFTextField from "../../../../FormElements/HFTextField";
import {
  useClientTypeCreateMutation,
  useClientTypeUpdateMutation,
} from "../../../../../services/clientTypeService";
import {useTablesListQuery} from "../../../../../services/tableService";
import FRow from "../../../../FormElements/FRow";
import HFCheckbox from "../../../../FormElements/HFCheckbox";
import {useMemo} from "react";
import HFAutocomplete from "../../../../FormElements/HFAutocomplete";

const FolderCreateModal = ({closeModal, clientType = {}, modalType}) => {
  const company = store.getState().company;
  const queryClient = useQueryClient();
  const createType = modalType === "CREATE";

  const {control, handleSubmit} = useForm({
    defaultValues: {
      project_id: company.projectId,
      id: clientType.id,
      guid: clientType.guid,
      name: clientType.name ?? "",
      default_page: clientType.default_page ?? "",
      self_recover: clientType.self_recover ?? false,
      self_register: clientType.self_register ?? false,
      table_slug: clientType.table_slug ?? "",
    },
  });

  const {mutate: createClientType, isLoading: createLoading} =
    useClientTypeCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["GET_CLIENT_TYPE_PERMISSION"]);
        closeModal();
      },
    });

  const {mutate: updateClientType, isLoading: updateLoading} =
    useClientTypeUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["GET_CLIENT_TYPE_PERMISSION"]);
        closeModal();
      },
    });

  const {data: projectTables} = useTablesListQuery({
    params: {
      is_login_table: true,
    },
    queryParams: {
      select: (res) =>
        res.tables?.map((el) => ({
          label: el?.label,
          value: el?.slug,
        })),
    },
  });

  const onSubmit = (values) => {
    const data = {
      ...values,
      "project-id": company.projectId,
    };
    const params = {
      "project-id": company.projectId,
    };
    if (clientType.id) updateClientType({data, params});
    else createClientType({params, data});
  };

  const tableOptions = useMemo(() => {
    return projectTables?.map((item) => ({
      value: item.id ?? item?.value,
      label: item.label,
    }));
  }, [projectTables]);

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {createType ? "Create folder" : "Edit folder"}
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

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <FRow label="Title">
              <HFTextField
                autoFocus
                fullWidth
                label="Title"
                control={control}
                name="name"
                required
              />
            </FRow>
            <FRow label="Default page link">
              <HFTextField
                autoFocus
                fullWidth
                label="Default page link"
                control={control}
                name="default_page"
              />
            </FRow>
            <HFCheckbox
              label="Self recover"
              control={control}
              name="self_recover"
            />
            <HFCheckbox
              label="Self register"
              control={control}
              name="self_register"
            />
            <FRow label="Table" required>
              <HFAutocomplete
                name="table_slug"
                control={control}
                placeholder="Table"
                fullWidth
                options={tableOptions}
              />
            </FRow>
            <div className="btns-row">
              {createType ? (
                <CreateButton
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  loading={createLoading || updateLoading}
                />
              ) : (
                <SaveButton
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
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

export default FolderCreateModal;
