import {FormProvider, useForm} from "react-hook-form";
import {BiExport} from "react-icons/bi";
import {FiShare2} from "react-icons/fi";
import {IoDocumentOutline} from "react-icons/io5";
import {RiArrowLeftRightFill} from "react-icons/ri";
import {useParams, useSearchParams} from "react-router-dom";
import {useQueryClient} from "react-query";
import {useEffect, useState} from "react";
import {
  useTemplateByIdQuery,
  useTemplateCreateMutation,
  useTemplateUpdateMutation,
} from "../../../../../../services/templateService";
import {store} from "../../../../../../store";
import {useGetSingleObjectDocumentQuery} from "../../../../../../services/templateNoteShareService";
import {Box, Button} from "@mui/material";
import Header, {HeaderExtraSide, HeaderLeftSide} from "../../../Header";
import ButtonTabs from "../ButtonTabs";
import styles from "./style.module.scss";
import TemplateSettings from "./TemplateSettings";
import CKEditor from "../CKEditor";
import HFTextField from "../../../../../FormElements/HFTextField";

const tabs = [
  {
    id: 1,
    icon: RiArrowLeftRightFill,
    title: "Relations",
  },
  {
    id: 2,
    icon: IoDocumentOutline,
    title: "Document format",
  },
  {
    id: 3,
    icon: BiExport,
    title: "Export",
  },
  {
    id: 4,
    icon: FiShare2,
    title: "Share",
  },
];

const Template = () => {
  const form = useForm();
  const {projectId, templateId, folderId} = useParams();
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useSearchParams();
  const selectedTabIndex = Number(queryParams.get("tab") ?? 0);
  const token = queryParams.get("token");
  const [fieldIsLoading, setFieldIsLoading] = useState(false);
  const company = store.getState().company;

  const {isLoading} = useTemplateByIdQuery({
    envId: company.environmentId,
    id: templateId,
    params: {"project-id": projectId},
    queryParams: {
      enabled: templateId == 1 ? false : Boolean(templateId),
      onSuccess: form.reset,
    },
  });

  const {data: createdShareDocument = {}, isLoading: loadingFromTokenDoc} =
    useGetSingleObjectDocumentQuery({
      params: {
        "project-id": projectId,
      },
      data: {
        token: token,
      },
      queryParams: {
        onSuccess: (res) => (res.data ? form.reset(res.data) : null),
        enabled: Boolean(token),
      },
    });

  useEffect(() => {
    if (!Boolean(templateId)) {
      form.reset({
        folderId: folderId,
        commit_id: "",
        html: "",
        project_id: projectId,
        size: "A4",
        title: "NEW",
        tables: [],
      });
    }
  }, [templateId]);

  const tabSelectHandler = (index) => {
    setQueryParams({
      tab: index,
    });
  };

  const {mutate: updateTemplate} = useTemplateUpdateMutation({
    onSuccess: (res) => {
      queryClient.refetchQueries(["TEMPLATES"]);
    },
  });

  const {mutate: createTemplate} = useTemplateCreateMutation({
    onSuccess: (res) => {
      queryClient.refetchQueries(["TEMPLATES"]);
    },
  });

  const onSubmit = (values) => {
    if (!!values.id) {
      updateTemplate({
        ...values,
        tables: values.tables.map((item) => ({...item, relations: []})),
      });
    } else {
      createTemplate({
        ...values,
        project_id: projectId,
        folder_id: folderId,
        tables: values.tables.map((item) => ({...item, relations: []})),
      });
    }
  };

  return (
    <FormProvider {...form}>
      <Box backgroundColor="#fff">
        <Header color="#000" border="none">
          <HeaderLeftSide flex={1}>
            <HFTextField
              control={form.control}
              name="title"
              className={styles.input}
            />
          </HeaderLeftSide>

          <HeaderExtraSide height="100%">
            <Button variant="contained" onClick={form.handleSubmit(onSubmit)}>
              Save changes
            </Button>
          </HeaderExtraSide>

          <HeaderExtraSide height="100%">
            {token ? (
              ""
            ) : (
              <ButtonTabs
                width="350px"
                selectedTabIndex={selectedTabIndex}
                ml="auto"
                tabs={tabs}
                onSelect={tabSelectHandler}
              />
            )}
          </HeaderExtraSide>
        </Header>

        <Box className={styles.flex}>
          <Box flex={1} overflow="hidden">
            {/* {isLoading || fieldIsLoading ? (
              <SimpleLoader h={300} />
            ) : ( */}
            <CKEditor
              control={form.control}
              name="html"
              form={form}
              fieldIsLoading={fieldIsLoading}
            />
            {/* )} */}
          </Box>

          {token ? (
            ""
          ) : (
            <Box
              height="calc(100vh - 50px)"
              width="350px"
              minWidth="350px"
              backgroundColor={"#fff"}>
              <TemplateSettings
                selectedTabIndex={selectedTabIndex}
                form={form}
                setFieldIsLoading={setFieldIsLoading}
              />
            </Box>
          )}
        </Box>
      </Box>
    </FormProvider>
  );
};

export default Template;
