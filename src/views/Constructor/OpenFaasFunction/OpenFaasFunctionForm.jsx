import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useResourceListQueryV2 } from "../../../services/resourceService";
import listToOptions from "../../../utils/listToOptions";
import microfrontendService, {
  useMicrofrontendCreateWebhookMutation,
} from "../../../services/microfrontendService";
import { showAlert } from "../../../store/alert/alert.thunk";
import PageFallback from "../../../components/PageFallback";
import HeaderSettings from "../../../components/HeaderSettings";
import FormCard from "../../../components/FormCard";
import FRow from "../../../components/FormElements/FRow";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFTextField from "../../../components/FormElements/HFTextField";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import { Save } from "@mui/icons-material";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import {
  useGithubBranchesQuery,
  useGithubRepositoriesQuery,
} from "@/services/githubService";
import Footer from "../../../components/Footer";
import { useFunctionV1CreateMutation } from "../../../services/constructorFunctionService";
import functionService, {
  useFunctionByIdQuery,
  useFunctionCreateMutation,
  useFunctionUpdateMutation,
} from "../../../services/functionService";
import { useQueryClient } from "react-query";

// const frameworkOptions = [
//   {
//     label: "React",
//     value: "REACT",
//   },
//   {
//     label: "Vue",
//     value: "VUE",
//   },
//   {
//     label: "Angular",
//     value: "ANGULAR",
//   },
// ];

export default function OpenFaasFunctionForm() {
  const { functionId, appId } = useParams();
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState();
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const microfrontendListPageLink = `/main/${appId}/openfaas-functions`;

  const mainForm = useForm({
    defaultValues: {
      description: "",
      name: "",
      // framework_type: "REACT",
      resource_id: "ucode_gitlab",
      type: "FUNCTION",
    },
  });

  const resourceId = mainForm.watch("resource_id");
  const selectedRepo = mainForm.watch("repo_name");

  const { data: resources } = useResourceListQueryV2({
    params: {
      type: "GITHUB",
    },
    queryParams: {
      select: (res) => res.integration_resources,
    },
  });

  const resourceOptions = useMemo(() => {
    return [
      { value: "ucode_gitlab", label: "Ucode GitLab" },
      ...listToOptions(resources, "username", "id", " (GitHub)"),
    ];
  }, [resources]);

  const selectedResource = useMemo(() => {
    if (resourceId === "ucode_gitlab") return null;

    return resources?.find((resource) => resource.id === resourceId);
  }, [resources, resourceId]);

  const { data: repositories } = useGithubRepositoriesQuery({
    username: selectedResource?.username,
    token: selectedResource?.token,
    queryParams: {
      enabled: !!selectedResource?.username,
      select: (res) => listToOptions(res?.data, "name", "name"),
    },
  });

  const { data: branches } = useGithubBranchesQuery({
    username: selectedResource?.username,
    repo: selectedRepo,
    token: selectedResource?.token,
    queryParams: {
      enabled: !!selectedResource?.username && !!selectedRepo,
      select: (res) => listToOptions(res?.data, "name", "name"),
    },
  });

  const { mutate: createWebHook, isLoading: createWebHookIsLoading } =
    useMicrofrontendCreateWebhookMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully created", "success"));
        navigate(-1);
      },
    });

  const { mutate: createFunction, isLoading: createFunctionIsLoading } =
    useFunctionCreateMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully created", "success"));
        navigate(-1);
      },
    });

  const { mutate: updateFunction, isLoading: updateFunctionIsLoading } =
    useFunctionUpdateMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully updated", "success"));
        navigate(-1);
      },
    });

  const { isLoading } = useFunctionByIdQuery({
    functionId,
    queryParams: {
      enabled: Boolean(functionId),
      onSuccess: (res) => {
        mainForm.reset({ ...res, resource_id: res.resource });
      },
    },
  });

  const onSubmit = (data) => {
    if (functionId) updateFunction(data);
    else {
      if (resourceId === "ucode_gitlab") createFunction(data);
      else
        createWebHook({
          ...data,
          github_token: selectedResource?.token,
          username: selectedResource?.username,
        });
    }
  };

  if (isLoading) return <PageFallback />;

  return (
    <div>
      <HeaderSettings
        title="Open faas функция"
        backButtonLink={-1}
        subtitle={functionId ? mainForm.watch("name") : "Новый"}
      ></HeaderSettings>

      <form
        onSubmit={mainForm.handleSubmit(onSubmit)}
        className="p-2"
        style={{ height: "calc(100vh - 112px)", overflow: "auto" }}
      >
        <FormCard title="Детали" maxWidth={500}>
          <FRow
            label={"Ресурс"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFSelect
              disabledHelperText
              name="resource_id"
              control={mainForm.control}
              fullWidth
              options={resourceOptions}
              required
              disabled={functionId}
            />
          </FRow>

          {resourceId !== "ucode_gitlab" && (
            <>
              <FRow label="Репозиторий" required>
                <HFSelect
                  name="repo_name"
                  control={mainForm.control}
                  options={repositories ?? []}
                  required
                  disabled={functionId}
                />
              </FRow>

              <FRow label="Ветка" required>
                <HFSelect
                  name="branch"
                  control={mainForm.control}
                  options={branches}
                  required
                  disabled={functionId}
                />
              </FRow>
            </>
          )}

          {resourceId === "ucode_gitlab" && (
            <FRow
              label={"Ссылка"}
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFTextField
                disabledHelperText
                name="path"
                control={mainForm.control}
                fullWidth
                required
                disabled={functionId}
              />
            </FRow>
          )}
          <FRow
            label={"Названия"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="name"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
          {resourceId === "ucode_gitlab" && (
            <FRow label="Описания">
              <HFTextField
                name="description"
                control={mainForm.control}
                multiline
                rows={4}
                fullWidth
              />
            </FRow>
          )}
        </FormCard>
      </form>

      <Footer
        extra={
          <>
            <SecondaryButton
              onClick={() => navigate(microfrontendListPageLink)}
              color="error"
            >
              Close
            </SecondaryButton>
            <PermissionWrapperV2 tableSlug="app" type="update">
              <PrimaryButton
                loader={
                  btnLoader ||
                  createWebHookIsLoading ||
                  createFunctionIsLoading ||
                  updateFunctionIsLoading
                }
                onClick={mainForm.handleSubmit(onSubmit)}
              >
                <Save /> Save
              </PrimaryButton>
            </PermissionWrapperV2>
          </>
        }
      />
    </div>
  );
}
