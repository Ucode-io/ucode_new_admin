import { Save } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import HeaderSettings from "../../../HeaderSettings";
import FormCard from "../../../FormCard";
import FRow from "../../../FormElements/FRow";
import HFTextField from "../../../FormElements/HFTextField";
import Footer from "../../../Footer";
import SecondaryButton from "../../../Buttons/SecondaryButton";
import PrimaryButton from "../../../Buttons/PrimaryButton";
import { useDispatch } from "react-redux";
import {
  useEmailCreateMutation,
  useEmailListQuery,
  useEmailUpdateMutation,
} from "../../../../services/emailService";
import { useEffect } from "react";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { store } from "../../../../store";

const EmailDetailPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const company = store.getState().company;
  const { emailId } = useParams();
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      project_id: company.projectId,
    },
  });

  const { data: email } = useEmailListQuery({
    params: { project_id: company.projectId },
  });

  useEffect(() => {
    if (emailId) {
      email?.items.filter(
        (item) =>
          item.id === emailId &&
          reset({ email: item.email, password: item.password })
      );
    }
  }, []);

  const { mutate: createEmail, isLoading: createLoading } =
    useEmailCreateMutation({
      onSuccess: () => {
        dispatch(showAlert("Successful created", "success"));
        queryClient.refetchQueries(["EMAILS"]);
        navigate(-1);
      },
    });

  const { mutate: updateEndvironment, isLoading: updateLoading } =
    useEmailUpdateMutation({
      onSuccess: () => {
        dispatch(showAlert("Successful updated", "success"));
        queryClient.refetchQueries(["EMAILS"]);
        navigate(-1);
      },
    });

  const onSubmit = (values) => {
    if (!emailId) createEmail(values);
    else updateEndvironment({ ...values, id: emailId });
  };

  return (
    <div>
      <HeaderSettings
        title="Email"
        backButtonLink={-1}
        subtitle={emailId ? watch("name") : "Новый"}
      ></HeaderSettings>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-2"
        style={{ height: "calc(100vh - 112px)", overflow: "auto" }}
      >
        <FormCard title="Детали" maxWidth={500}>
          <FRow
            label={"Email"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="email"
              control={control}
              fullWidth
              required
            />
          </FRow>
          <FRow
            label={"Password"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="password"
              control={control}
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
            <PrimaryButton
              loader={createLoading}
              onClick={handleSubmit(onSubmit)}
            >
              <Save /> Save
            </PrimaryButton>
          </>
        }
      />
    </div>
  );
};

export default EmailDetailPage;
