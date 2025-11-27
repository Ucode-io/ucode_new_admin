import { Save } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Tabs } from "react-tabs";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import Footer from "../../components/Footer";
import FormCard from "../../components/FormCard";
import FRow from "../../components/FormElements/FRow";
import HFTextField from "../../components/FormElements/HFTextField";
import HeaderSettings from "../../components/HeaderSettings";
import PageFallback from "../../components/PageFallback";
import { store } from "../../store";
import smsOtpService from "../../services/auth/smsOtpService";

const SmsFormPage = () => {
  const { appId, apiKeyId, redirectId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const [btnLoader, setBtnLoader] = useState();
  const [loader, setLoader] = useState(false);
  const authStore = store.getState().auth;

  const mainForm = useForm({
    defaultValues: {},
  });

  const createApp = (data) => {
    setBtnLoader(true);
    const params = {
      "project-id": authStore.projectId,
    };
    smsOtpService
      .create({ ...data, number_of_otp: parseInt(data?.number_of_otp) }, params)
      .then(() => {
        navigate(-1);
        // getRoleList();
      })
      .catch(() => setBtnLoader(false));
  };

  const updateApp = (data) => {
    setBtnLoader(true);

    smsOtpService
      .update({
        ...data,
        number_of_otp: parseInt(data?.number_of_otp),
      })
      .then(() => {
        navigate(-1);
        // getRoleList();
      })
      .catch(() => setBtnLoader(false));
  };

  const getById = () => {
    smsOtpService
      .getById(redirectId)
      .then((res) => {
        mainForm.reset(res);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };

  // useEffect(() => {
  //   if (mainForm.watch("client_type_id")) {
  //     getRoleList();
  //   }
  // }, [mainForm.watch("client_type_id")]);

  useEffect(() => {
    if (redirectId) {
      getById();
    }
  }, [redirectId]);

  const onSubmit = (data) => {
    if (redirectId) updateApp(data);
    else createApp(data);
  };

  if (loader) return <PageFallback />;

  return (
    <div>
      <Tabs
        selectedIndex={Number(search.get("tab") ?? 0)}
        onSelect={(index) => setSearch({ tab: index })}
        direction={"ltr"}
        style={{ height: "100vh", position: "relative" }}
      >
        <HeaderSettings
          title="Sms Otp"
          backButtonLink={-1}
          subtitle={appId ? mainForm.watch("name") : "Новый"}
        ></HeaderSettings>

        <form
          onSubmit={mainForm.handleSubmit(onSubmit)}
          className="p-2"
          style={{ height: "calc(100vh - 112px)", overflow: "auto" }}
        >
          <FormCard title="Детали" maxWidth={500}>
            <FRow
              label={"Login"}
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFTextField
                disabledHelperText
                name="login"
                control={mainForm.control}
                fullWidth
                required
              />
            </FRow>
            <FRow
              label={"Default Otp"}
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFTextField
                disabledHelperText
                name="default_otp"
                control={mainForm.control}
                fullWidth
                required
              />
            </FRow>
            <FRow
              label={"Number Of Otp"}
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFTextField
                disabledHelperText
                name="number_of_otp"
                control={mainForm.control}
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

              <PrimaryButton
                loader={btnLoader}
                onClick={mainForm.handleSubmit(onSubmit)}
              >
                <Save /> Save
              </PrimaryButton>
            </>
          }
        />
      </Tabs>
    </div>
  );
};

export default SmsFormPage;
