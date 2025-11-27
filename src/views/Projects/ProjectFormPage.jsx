import { Save } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import Footer from "../../components/Footer";
import FormCard from "../../components/FormCard";
import FRow from "../../components/FormElements/FRow";
import HFTextField from "../../components/FormElements/HFTextField";
import HeaderSettings from "../../components/HeaderSettings";
import PageFallback from "../../components/PageFallback";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import { useQueryClient } from "react-query";
import { store } from "../../store";
import {
  useProjectCreateMutation,
  useProjectGetByIdQuery,
  useProjectUpdateMutation,
} from "../../services/projectService";
import { showAlert } from "../../store/alert/alert.thunk";

const ProjectForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const companyId = store.getState().company.companyId;

  const mainForm = useForm({
    defaultValues: {
      title: "",
      company_id: companyId,
      project_id: projectId,
    },
  });

  const { isLoading } = useProjectGetByIdQuery({
    projectId: projectId,
    queryParams: {
      enabled: Boolean(projectId),
      onSuccess: (res) => {
        mainForm.reset(res);
      },
    },
  });

  const { mutateAsync: createProject, isLoading: createLoading } =
    useProjectCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["PROJECT"]);
        store.dispatch(showAlert("Успешно", "success"));
        navigate(-1);
      },
    });
  const { mutateAsync: updateProject, isLoading: updateLoading } =
    useProjectUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["PROJECT"]);
        store.dispatch(showAlert("Успешно", "success"));
        navigate(-1);
      },
    });

  const onSubmit = (data) => {
    if (projectId) updateProject(data);
    else createProject(data);
  };

  if (updateLoading) return <PageFallback />;

  return (
    <div>
      <HeaderSettings
        title="Projects"
        backButtonLink={-1}
        subtitle={projectId ? mainForm.watch("name") : "Новый"}
      ></HeaderSettings>

      <form
        onSubmit={mainForm.handleSubmit(onSubmit)}
        className="p-2"
        style={{ height: "calc(100vh - 112px)", overflow: "auto" }}
      >
        <FormCard title="Детали" maxWidth={500}>
          <FRow
            label={"Названия"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="title"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
        </FormCard>
      </form>

      <Footer
        extra={
          <>
            <SecondaryButton onClick={() => navigate(-1)} color="error">
              Close
            </SecondaryButton>
            <PermissionWrapperV2 tabelSlug="app" type="update">
              <PrimaryButton
                loader={createLoading}
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

export default ProjectForm;
