import { Box, Card } from "@mui/material";
import Header from "../../../components/Header";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FieldsConfiguration from "./Field/FieldsConfiguration";
import { useForm } from "react-hook-form";
import { store } from "../../../store";
import { useFieldsListQuery } from "../../../services/fieldService";
import {
  useTableConfigureMutation,
  useTableGetByIdQuery,
} from "../../../services/tableService";
import { useRelationsListQuery } from "../../../services/relationService";
import RelationsConfiguration from "./Relation/RelationsConfigurations";

const DatabaseConfiguration = () => {
  const navigate = useNavigate();
  const { resourceId, tableSlug, databaseId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const projectId = store.getState().company.projectId;

  const { control, reset, handleSubmit } = useForm();

  const { data } = useTableGetByIdQuery({
    resourceId: resourceId,
    tableId: databaseId,
  });

  const {
    data: fieldsData,
    isLoading: fieldsLoading,
    isSuccess: isFieldQuerySuccess,
  } = useFieldsListQuery({
    params: {
      table_id: databaseId,
    },
    headers: {
      "resource-id": resourceId,
    },
  });

  const {
    data: relationsData,
    isLoading: relationsLoading,
    isSuccess: isRelationQuerySuccess,
  } = useRelationsListQuery({
    params: {
      table_id: databaseId,
    },
    headers: {
      "resource-id": resourceId,
    },
  });

  const { mutate: configureTable, isLoading: configureLoading } =
    useTableConfigureMutation({
      onSuccess: () => {
        navigate(-1);
      },
    });

  const onSubmit = (values) => {
    configureTable({
      data: values,
      resourceId,
    });
  };

  useEffect(() => {
    if (!isRelationQuerySuccess || !isFieldQuerySuccess) return;

    reset({
      fields: fieldsData?.fields || [],
      relations:
        relationsData?.relations?.map((relation) => ({
          ...relation,
          table_from: relation?.table_from?.slug ?? "",
          table_to: relation?.table_to?.slug ?? "",
          view_fields: relation.view_fields?.map((el) => el.id),
        })) || [],
      options: {
        project_id: projectId,
        table_id: databaseId,
      },
    });
  }, [isRelationQuerySuccess, isFieldQuerySuccess]);

  //   if(fieldsLoading || relationsLoading) return <SimpleLoader h={300} />

  return (
    <Box flex={1}>
      <Header title={tableSlug} />
      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
      >
        <div style={{ padding: "20px" }}>
          <Card style={{ padding: "10px" }}>
            <TabList>
              <Tab>Fields</Tab>
              <Tab>Relations</Tab>
            </TabList>

            <TabPanel>
              <FieldsConfiguration control={control} />
            </TabPanel>
            <TabPanel>
              <RelationsConfiguration control={control} />
            </TabPanel>
          </Card>
        </div>
      </Tabs>
    </Box>
  );
};

export default DatabaseConfiguration;
