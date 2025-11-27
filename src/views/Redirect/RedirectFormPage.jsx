import { Save } from "@mui/icons-material";
import { useForm, useWatch } from "react-hook-form";
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
  useRedirectCreateMutation,
  useRedirectGetByIdQuery,
  useRedirectListQuery,
  useRedirectUpdateMutation,
} from "../../services/redirectService";
import { useState } from "react";

const RedirectFormPage = () => {
  const { redirectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [computedData, setComputedData] = useState()

  const mainForm = useForm({
    defaultValues: {
      defaultFrom: "/api/",
      defaultTo: "/",
    },
  });
  
  const { isLoading: redirectLoading } = useRedirectListQuery({
    queryParams: {
      onSuccess: (res) => setComputedData(res?.redirect_urls?.length),
    },
  });

  const { isLoading } = useRedirectGetByIdQuery({
    redirectId: redirectId,
    queryParams: {
      enabled: Boolean(redirectId),
      onSuccess: (res) => {
        mainForm.reset({
          ...res,
          from: res.from.slice(5),
          to: res.to.slice(1),
          defaultFrom: "/api/",
          defaultTo: "/",
        });
      },
    },
  });

  const { mutateAsync: createRedirect, isLoading: createLoading } =
    useRedirectCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["REDIRECT"]);
        store.dispatch(showAlert("Успешно", "success"));
        navigate(-1);
      },
    });
  const { mutateAsync: updateRedirect, isLoading: updateLoading } =
    useRedirectUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["REDIRECT"]);
        store.dispatch(showAlert("Успешно", "success"));
        navigate(-1);
      },
    });

  const onSubmit = (data) => {
    if (redirectId)
      updateRedirect({
        ...data,
        from: data.defaultFrom + data.from,
        to: data.defaultTo + data.to,
      });
    else
      createRedirect({
        ...data,
        from: data.defaultFrom + data.from,
        to: data.defaultTo + data.to,
        order: computedData + 1
      });
  };

  if (isLoading) return <PageFallback />;

  return (
    <div>
      <HeaderSettings
        title="Redirects"
        backButtonLink={-1}
        subtitle={redirectId ? mainForm.watch("name") : "Новый"}
      ></HeaderSettings>

      <form
        onSubmit={mainForm.handleSubmit(onSubmit)}
        className="p-2"
        style={{ height: "calc(100vh - 112px)", overflow: "auto" }}
      >
        <FormCard title="Детали" maxWidth={500}>
          <FRow
            label={"From"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="defaultFrom"
              control={mainForm.control}
              fullWidth
              required
              disabled={true}
              style={{
                width: "40%",
              }}
            />
            <HFTextField
              disabledHelperText
              name="from"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
          <FRow
            label={"To"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="defaultTo"
              control={mainForm.control}
              fullWidth
              required
              disabled={true}
              style={{
                width: "40%",
              }}
            />
            <HFTextField
              disabledHelperText
              name="to"
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
                loader={createLoading || updateLoading}
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

export default RedirectFormPage;
