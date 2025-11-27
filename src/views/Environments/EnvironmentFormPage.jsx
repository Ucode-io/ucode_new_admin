import {Save} from "@mui/icons-material";
import {useForm} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import Footer from "../../components/Footer";
import FormCard from "../../components/FormCard";
import FRow from "../../components/FormElements/FRow";
import HFTextField from "../../components/FormElements/HFTextField";
import HeaderSettings from "../../components/HeaderSettings";
import PageFallback from "../../components/PageFallback";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import {Box} from "@mui/material";
import NewColorInput from "../../components/FormElements/HFNewColorPicker";
import styles from "./style.module.scss";
import {
  useEnvironmentCreateMutation,
  useEnvironmentGetByIdQuery,
  useEnvironmentUpdateMutation,
} from "../../services/environmentService";
import {useQueryClient} from "react-query";
import {store} from "../../store";
import {showAlert} from "../../store/alert/alert.thunk";

const EnvironmentForm = () => {
  const {envId} = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const project_id = store.getState().company.projectId;
  const company_id = store.getState().company?.companyId;

  const mainForm = useForm({
    defaultValues: {
      description: "",
      name: "",
      project_id: project_id,
    },
  });

  const {isLoading} = useEnvironmentGetByIdQuery({
    envId: envId,
    queryParams: {
      enabled: Boolean(envId),
      onSuccess: (res) => {
        mainForm.reset(res);
      },
    },
  });

  const {mutateAsync: createEnv, isLoading: createLoading} =
    useEnvironmentCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["ENVIRONMENT"]);
        navigate(-1);
        store.dispatch(showAlert("Успешно", "success"));
      },
    });
  const {mutateAsync: updateEnv, isLoading: updateLoading} =
    useEnvironmentUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["ENVIRONMENT"]);
        navigate(-1);
        store.dispatch(showAlert("Успешно", "success"));
      },
    });

  const onSubmit = (data) => {
    const datas = {
      ...data,
      company_id: company_id,
    };
    if (envId) updateEnv(datas);
    else createEnv(datas);
  };

  if (updateLoading) return <PageFallback />;

  return (
    <div>
      <HeaderSettings
        title="Environment"
        backButtonLink={-1}
        subtitle={envId ? mainForm.watch("name") : "Новый"}></HeaderSettings>

      <form
        onSubmit={mainForm.handleSubmit(onSubmit)}
        className="p-2"
        style={{height: "calc(100vh - 112px)", overflow: "auto"}}>
        <FormCard title="Детали" maxWidth={500}>
          <FRow
            label={"Названия"}
            componentClassName="flex gap-2 align-center"
            required>
            <HFTextField
              disabledHelperText
              name="name"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
          <FRow
            label={"Цвет"}
            componentClassName="flex gap-2 align-center"
            required>
            <Box className={styles.colorpicker}>
              <NewColorInput control={mainForm.control} name="display_color" />
              <HFTextField
                control={mainForm.control}
                name="display_color"
                fullWidth
                className={styles.formcolorinput}
              />
            </Box>
          </FRow>
          <FRow label="Описания">
            <HFTextField
              name="description"
              control={mainForm.control}
              multiline
              rows={4}
              fullWidth
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
                onClick={mainForm.handleSubmit(onSubmit)}>
                <Save /> Save
              </PrimaryButton>
            </PermissionWrapperV2>
          </>
        }
      />
    </div>
  );
};

export default EnvironmentForm;
