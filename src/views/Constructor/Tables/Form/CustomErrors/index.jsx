import { Drawer } from "@mui/material";
import { useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import DataTable from "../../../../../components/DataTable";
import TableCard from "../../../../../components/TableCard";
import TableRowButton from "../../../../../components/TableRowButton";
import {
  useCustomErrorDeleteMutation,
  useCustomErrorListQuery,
} from "../../../../../services/customErrorMessageService";
import { store } from "../../../../../store";
import CustomErrorsSettings from "./CustomErrorsSettings";

const CustomErrors = ({ mainForm, getRelationFields }) => {
  const [drawerState, setDrawerState] = useState(null);
  const [loader, setLoader] = useState(false);
  const { id, tableSlug } = useParams();
  const queryClient = useQueryClient();
  const authStore = store.getState().auth;

  const { fields: relations } = useFieldArray({
    control: mainForm.control,
    name: "relations",
    keyName: "key",
  });

  const { data: customErrors } = useCustomErrorListQuery({
    params: {
      table_id: id,
    },
    tableSlug: tableSlug
  });

  const openEditForm = (field, index) => {
    setDrawerState(field);
  };

  const updateRelations = async () => {
    setLoader(true);

    await getRelationFields();

    setDrawerState(null);
    setLoader(false);
  };

  const { mutate: deleteCustomError, isLoading: deleteLoading } =
    useCustomErrorDeleteMutation({
      projectId: authStore.projectId,
      tableSlug: tableSlug,
      onSuccess: () => {
        queryClient.refetchQueries(["CUSTOM_ERROR_MESSAGE"]);
      },
    });

  const deleteField = (field, index) => {
    if (!id) updateRelations();
    else {
      deleteCustomError(field.id);
      // constructorRelationService
      //   .delete(field.id)
      //   .then((res) => updateRelations());
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 1,
        label: "Code",
        slug: "code",
      },
      {
        id: 2,
        label: "Action type",
        slug: "action_type",
      },
      {
        id: 3,
        label: "Message",
        slug: "message",
      },
    ],
    []
  );

  return (
    <TableCard>
      <DataTable
        data={customErrors?.custom_error_messages}
        removableHeight={false}
        tableSlug={"app"}
        columns={columns}
        disablePagination
        loader={loader || deleteLoading}
        onDeleteClick={deleteField}
        onEditClick={openEditForm}
        dataLength={1}
        checkPermission={false}
        additionalRow={
          <TableRowButton
            colSpan={columns.length + 2}
            onClick={() => setDrawerState("CREATE")}
          />
        }
      />

      <Drawer
        open={!!drawerState}
        anchor="right"
        onClose={() => setDrawerState(null)}
        orientation="horizontal"
      >
        <CustomErrorsSettings
          customError={drawerState}
          closeSettingsBlock={() => setDrawerState(null)}
          getRelationFields={getRelationFields}
          formType={drawerState}
          height={`calc(100vh - 48px)`}
          mainForm={mainForm}
        />
      </Drawer>
    </TableCard>
  );
};

export default CustomErrors;
