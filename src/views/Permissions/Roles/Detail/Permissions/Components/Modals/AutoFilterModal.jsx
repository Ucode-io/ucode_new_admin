import ClearIcon from "@mui/icons-material/Clear";
import {Box, Button, Card, Modal, Typography} from "@mui/material";
import AutoFilterRow from "../AutoFilterRow";
import {useFieldArray, useWatch} from "react-hook-form";
import {store} from "../../../../../../../store";
import {useRelationsListQuery} from "../../../../../../../services/relationService";
import {useObjectsListQuery} from "../../../../../../../services/constructorObjectService";

const AutoFilterModal = ({
  control,
  closeModal,
  tableIndex,
  type,
  setValue,
  watch,
}) => {
  const basePath = `data.tables.${tableIndex}.automatic_filters.${type}`;
  const projectId = store.getState().company.projectId;
  const envId = store.getState().company.environmentId;

  const tableSlug = useWatch({
    control,
    name: `data.tables.${tableIndex}.slug`,
  });

  const clientTypeId = useWatch({
    control,
    name: `data.client_type_id`,
  });

  const {
    fields: filters,
    append,
    remove,
  } = useFieldArray({
    control,
    name: basePath,
    keyName: "key",
  });

  const addFilter = () =>
    append({
      custom_field: "",
      guid: "",
      object_field: "",
    });

  const {data: relations} = useRelationsListQuery({
    params: {
      table_slug: tableSlug,
      "project-id": projectId,
    },
    queryParams: {
      select: (res) =>
        res.relations
          ?.filter(
            (relation) =>
              relation?.type === "Many2Many" ||
              (relation?.type === "Many2One" &&
                relation?.table_from?.slug === tableSlug)
          )
          .map((relation) => {
            const relatedTable =
              relation?.table_from.slug === tableSlug
                ? relation?.table_to
                : relation?.table_from;
            return {
              label: relation?.title ?? relatedTable?.label,
              value: `${relatedTable?.slug}#${relation?.id}`,
            };
          }),
    },
  });

  const {data: connections} = useObjectsListQuery({
    params: {
      envId: envId,
      "project-id": projectId,
      tableSlug: "connections",
    },
    data: {
      client_type_id: clientTypeId,
    },
    queryParams: {
      select: (res) => {
        return [
          {value: "user_id", label: "user"},
          ...(res.data?.response?.map((connection) => ({
            value: `${connection.table_slug}_id`,
            label: connection.table_slug,
          })) ?? []),
        ];
      },
    },
  });
  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Relation permissions</Typography>
            <ClearIcon
              color="primary"
              onClick={closeModal}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <Box>
            {filters?.map((filter, index) => (
              <AutoFilterRow
                key={filter.key}
                control={control}
                basePath={basePath}
                index={index}
                relations={relations}
                connections={connections}
                remove={remove}
                setValue={setValue}
                watch={watch}
              />
            ))}
            <Box p={1}>
              <Button onClick={addFilter} variant="contained" fullWidth>
                Add filter
              </Button>
            </Box>
            <div className="modal-header silver-bottom-border">
              <div></div>
              <Button variant="contained" onClick={closeModal}>
                Save
              </Button>
            </div>
          </Box>
        </Card>
      </Modal>
    </div>
  );
};

export default AutoFilterModal;
