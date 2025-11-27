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
import { showAlert } from "../../store/alert/alert.thunk";
import {
  useCompanyGetByIdQuery,
  useCompanyUpdateMutation,
} from "../../services/companyService";

const CompanyForm = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mainForm = useForm({
    defaultValues: {
      name: "",
      company_id: companyId,
    },
  });

  const { isLoading } = useCompanyGetByIdQuery({
    companyId: companyId,
    queryParams: {
      enabled: Boolean(companyId),
      onSuccess: (res) => {
        mainForm.reset(res.company);
      },
    },
  });

  const { mutateAsync: updateCompany, isLoading: updateLoading } =
    useCompanyUpdateMutation(
      {
        onSuccess: () => {
          queryClient.refetchQueries(["COMPANY"]);
          store.dispatch(showAlert("Успешно", "success"));
          navigate(-1);
        },
      },
      { companyId }
    );

  const onSubmit = (data) => {
    updateCompany(data);
  };

  if (updateLoading) return <PageFallback />;

  return (
    <div>
      <HeaderSettings
        title="Company"
        backButtonLink={-1}
        subtitle={companyId ? mainForm.watch("name") : "Новый"}
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
              name="name"
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
                loader={updateLoading}
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

export default CompanyForm;
