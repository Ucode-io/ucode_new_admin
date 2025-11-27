import { Save } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import Footer from "../../../components/Footer";
import FormCard from "../../../components/FormCard";
import FRow from "../../../components/FormElements/FRow";
import HFTextField from "../../../components/FormElements/HFTextField";
import HeaderSettings from "../../../components/HeaderSettings";
import PageFallback from "../../../components/PageFallback";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import microfrontendService, {
  useMicrofrontendCreateWebhookMutation,
} from "../../../services/microfrontendService";
import HFSelect from "../../../components/FormElements/HFSelect";
import { useResourceListQueryV2 } from "@/services/resourceService";
import listToOptions from "@/utils/listToOptions";
import {
  useGithubBranchesQuery,
  useGithubRepositoriesQuery,
} from "@/services/githubService";
import { showAlert } from "@/store/alert/alert.thunk";
import { useDispatch } from "react-redux";

const frameworkOptions = [
  {
    label: "React",
    value: "REACT",
  },
  {
    label: "Vue",
    value: "VUE",
  },
  {
    label: "Angular",
    value: "ANGULAR",
  },
];

const MicrofrontendForm = () => {
  const { microfrontendId, appId } = useParams();
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState();
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();

  const microfrontendListPageLink = `/main/${appId}/microfrontend`;

  const mainForm = useForm({
    defaultValues: {
      description: "",
      name: "",
      framework_type: "REACT",
      resource_id: "ucode_gitlab",
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
        navigate(microfrontendListPageLink);
      },
    });

  const createMicrofrontend = (data) => {
    setBtnLoader(true);
    microfrontendService
      .create(data)
      .then(() => {
        navigate(microfrontendListPageLink);
      })
      .catch(() => setBtnLoader(false));
  };

  const updateMicrofrontend = (data) => {
    setBtnLoader(true);

    microfrontendService
      .update({
        ...data,
      })
      .then(() => {
        navigate(microfrontendListPageLink);
      })
      .catch(() => setBtnLoader(false));
  };

  const getData = () => {
    setLoader(true);

    microfrontendService
      .getById(microfrontendId)
      .then((res) => {
        mainForm.reset(res);
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    if (microfrontendId) {
      getData();
    } else {
      setLoader(false);
    }
  }, []);

  const onSubmit = (data) => {
    if (microfrontendId) updateMicrofrontend(data);
    else {
      if (resourceId === "ucode_gitlab") createMicrofrontend(data);
      else
        createWebHook({
          ...data,
          github_token: selectedResource?.token,
          username: selectedResource?.username,
        });
    }
  };

  if (loader) return <PageFallback />;

  return (
    <div>
      <HeaderSettings
        title="Микрофронтенд"
        backButtonLink={-1}
        subtitle={microfrontendId ? mainForm.watch("name") : "Новый"}
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
                />
              </FRow>

              <FRow label="Ветка" required>
                <HFSelect
                  name="branch"
                  control={mainForm.control}
                  options={branches}
                  required
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
          <FRow label="Фреймворк" required>
            <HFSelect
              name="framework_type"
              control={mainForm.control}
              options={frameworkOptions}
              defaultValue="REACT"
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
                loader={btnLoader || createWebHookIsLoading}
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
};

export default MicrofrontendForm;
