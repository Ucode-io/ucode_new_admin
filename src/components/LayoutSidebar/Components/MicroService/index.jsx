import { useLocation, useNavigate } from "react-router-dom";

import { useQueryClient } from "react-query";
import { useFieldArray, useForm } from "react-hook-form";
import {
  useDefaultResourceMutation,
  useDefaultResourcesListQuery,
} from "../../../../services/resourceDefaultService";
import { useEffect } from "react";
import Resource from "./Resource";
import { CTable, CTableBody, CTableCell, CTableHead } from "../../../CTable";
import FiltersBlock from "../../../FiltersBlock";
import HeaderSettings from "../../../HeaderSettings";
import TableCard from "../../../TableCard";
import { store } from "../../../../store";
import { Button, Typography } from "@mui/material";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { useDispatch } from "react-redux";

const getResourceTypes = (resources) => {
  const resourceTypes = [];
  for (const [key, value] of Object.entries(resources?.resource_types || {})) {
    const resource_type_title = value;
    const resource_type = parseInt(key);
    resourceTypes.push({ resource_type, resource_type_title });
  }
  return resourceTypes;
};
const getServiceResources = (resources) => {
  const serviceResources = [];
  for (const key in resources?.service_resources) {
    const service_type = resources?.service_resources[key].service_type;
    const title = key;
    const resource_id = resources?.service_resources[key].resource_id;
    const resource_type = resources?.service_resources[key].resource_type;
    const id = resources?.service_resources[key].id;
    serviceResources.push({
      title,
      service_type,
      resource_id,
      resource_type,
      id,
    });
  }
  return serviceResources;
};

const MicroservicePage = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const location = useLocation();
  const company = store.getState().company;

  const { data: resources, isLoading } = useDefaultResourcesListQuery({
    params: {
      "project-id": company.projectId,
    },
  });
  const serviceResources = getServiceResources(resources);
  const resourceTypes = getResourceTypes(resources);
  const { control, setValue, handleSubmit, watch } = useForm({
    defaultValues: {
      service_resources: serviceResources,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "service_resources",
  });

  const { mutate: updateResource, isLoading: updateLoading } =
    useDefaultResourceMutation({
      onSuccess: () => {
        dispatch(showAlert("Success", "success"));
        queryClient.refetchQueries(["RESOURCES"]);
      },
    });

  const onSubmit = async (values) => {
    updateResource({
      environment_id: company.environmentId,
      project_id: company.projectId,
      ...values,
    });
  };

  useEffect(() => {
    setValue("service_resources", serviceResources);
  }, [isLoading]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        background: "#fff",
        height: "100%",
      }}
    >
      <HeaderSettings
        title={"Microservice"}
        extraButtons={
          <Button variant="contained" type="submit">
            Save
          </Button>
        }
        line={false}
      />

      <TableCard type={"withoutPadding"}>
        <CTable
          tableStyle={{
            borderRadius: "0px",
            border: "none",
          }}
          disablePagination
          removableHeight={false}
        >
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Service</CTableCell>
            <CTableCell>Resource type</CTableCell>
            <CTableCell>Resource</CTableCell>
          </CTableHead>
          <CTableBody
            loader={isLoading}
            columnsCount={4}
            dataLength={fields?.length}
          >
            {fields?.map((item, itemIndex) => (
              <Resource
                services={resources.service_resources}
                resource={item}
                index={itemIndex}
                response={resources}
                resources={resources.resources}
                resourceTypes={resourceTypes}
                control={control}
              />
            ))}
          </CTableBody>
        </CTable>
      </TableCard>
    </form>
  );
};

export default MicroservicePage;
