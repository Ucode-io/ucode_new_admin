import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {
  useGithubBranchesQuery,
  useGithubLoginMutation,
  useGithubRepositoriesQuery,
  useGithubUserQuery,
} from "@/services/githubService";
import {useEffect, useState} from "react";
import RingLoaderWithWrapper from "@/components/Loaders/RingLoader/RingLoaderWithWrapper";
import HeaderSettings from "@/components/HeaderSettings";
import FormCard from "@/components/FormCard";
import HFSelect from "@/components/FormElements/HFSelect";
import FRow from "@/components/FormElements/FRow";
import HFTextField from "@/components/FormElements/HFTextField";
import {useForm, useWatch} from "react-hook-form";
import listToOptions from "@/utils/listToOptions";
import Footer from "@/components/Footer";
import SecondaryButton from "@/components/Buttons/SecondaryButton";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import {Save} from "@mui/icons-material";
import {useMicrofrontendCreateWebhookMutation} from "@/services/microfrontendService";
import {useDispatch} from "react-redux";
import {alertActions} from "@/store/alert/alert.slice";
import {showAlert} from "@/store/alert/alert.thunk";
import {
  useResourceListQuery,
  useResourceListQueryV2,
} from "@/services/resourceService";

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

const GithubMicrofrontendForm = () => {
  const {appId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const microfrontendListPageLink = `/main/${appId}/microfrontend`;

  const {control, handleSubmit, setValue} = useForm({
    defaultValues: {
      framework_type: "REACT",
      name: "",
      username: "",
      repo_name: "",
      branch: "",
    },
  });

  const selectedRepo = useWatch({
    control,
    name: "repo_name",
  });

  const {mutate: login, isLoading} = useGithubLoginMutation({
    onSuccess: (res) => {
      setSearchParams({access_token: res.access_token});
    },
    onError: () => {
      navigate(microfrontendListPageLink);
    },
  });

  const {data: ownerUsername} = useGithubUserQuery({
    token: searchParams.get("access_token"),
    enabled: !!searchParams.get("access_token"),
    queryParams: {
      select: (res) => res?.data?.login,
      onSuccess: (username) => setValue("username", username),
    },
  });

  const {data: repositories} = useGithubRepositoriesQuery({
    username: ownerUsername,
    token: searchParams.get("access_token"),
    queryParams: {
      enabled: !!ownerUsername,
      select: (res) => listToOptions(res?.data, "name", "name"),
    },
  });

  const {data: branches} = useGithubBranchesQuery({
    username: ownerUsername,
    repo: selectedRepo,
    token: searchParams.get("access_token"),
    queryParams: {
      enabled: !!ownerUsername && !!selectedRepo,
      select: (res) => listToOptions(res?.data, "name", "name"),
    },
  });

  const {mutate: create, isLoading: createIsLoading} =
    useMicrofrontendCreateWebhookMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully created", "success"));
        navigate(microfrontendListPageLink);
      },
    });

  const onSubmit = (values) => {
    create({
      ...values,
      github_token: searchParams.get("access_token"),
    });
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      login({code});
    }
  }, []);

  if (isLoading) return <RingLoaderWithWrapper style={{height: "100vh"}} />;

  return (
    <div>
      <HeaderSettings
        title="Микрофронтенд (GitHub)"
        backButtonLink={microfrontendListPageLink}></HeaderSettings>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-2"
        style={{height: "calc(100vh - 112px)", overflow: "auto"}}>
        <FormCard title="Детали" maxWidth={500}>
          <FRow label={"Названия"} required>
            <HFTextField
              disabledHelperText
              name="name"
              control={control}
              fullWidth
              required
            />
          </FRow>

          <FRow label="Репозиторий" required>
            <HFSelect
              name="repo_name"
              control={control}
              options={repositories ?? []}
              required
            />
          </FRow>

          <FRow label="Ветка" required>
            <HFSelect
              name="branch"
              control={control}
              options={branches}
              required
            />
          </FRow>

          <FRow label="Фреймворк" required>
            <HFSelect
              name="framework_type"
              control={control}
              options={frameworkOptions}
              defaultValue="REACT"
              required
            />
          </FRow>
        </FormCard>
      </form>

      <Footer
        extra={
          <>
            <SecondaryButton
              onClick={() => navigate(microfrontendListPageLink)}
              color="error">
              Close
            </SecondaryButton>
            <PrimaryButton
              loader={createIsLoading}
              onClick={handleSubmit(onSubmit)}>
              <Save /> Save
            </PrimaryButton>
          </>
        }
      />
    </div>
  );
};

export default GithubMicrofrontendForm;
