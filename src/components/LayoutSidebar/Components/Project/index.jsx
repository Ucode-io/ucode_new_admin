import {Save} from "@mui/icons-material";
import {useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useQueryClient} from "react-query";
import {useNavigate, useParams} from "react-router-dom";
import {
  useProjectGetByIdQuery,
  useProjectUpdateMutation,
  useProjectsAllSettingQuery,
} from "../../../../services/projectService";
import {store} from "../../../../store";
import PrimaryButton from "../../../Buttons/PrimaryButton";
import SecondaryButton from "../../../Buttons/SecondaryButton";
import Footer from "../../../Footer";
import FormCard from "../../../FormCard";
import FRow from "../../../FormElements/FRow";
import HFAvatarUpload from "../../../FormElements/HFAvatarUpload";
import HFMultipleSelect from "../../../FormElements/HFMultipleSelect";
import HFSelect from "../../../FormElements/HFSelect";
import HFTextField from "../../../FormElements/HFTextField";
import HeaderSettings from "../../../HeaderSettings";
import HFAutocomplete from "../../../FormElements/HFAutocomplete";
import {Autocomplete, TextField} from "@mui/material";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../../store/alert/alert.thunk";

const ProjectSettingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const company = store.getState().company;
  const {control, reset, handleSubmit, watch} = useForm();
  const dispatch = useDispatch();

  const {isLoading} = useProjectGetByIdQuery({
    projectId: company.projectId,
    queryParams: {
      onSuccess: (res) => {
        reset({
          ...res,
          language: res?.language?.map((lang) => lang.id),
          currency: res.currency.id,
          timezone: res.timezone.id,
        });
      },
    },
  });

  const {data: language} = useProjectsAllSettingQuery({
    params: {
      "project-id": company.projectId,
      type: "LANGUAGE",
      limit: 200,
    },
  });
  const {data: timezone} = useProjectsAllSettingQuery({
    params: {
      "project-id": company.projectId,
      type: "TIMEZONE",
      limit: 200,
    },
  });
  const {data: currency} = useProjectsAllSettingQuery({
    params: {
      "project-id": company.projectId,
      type: "CURRENCY",
      limit: 200,
    },
  });

  const languageOptions = useMemo(() => {
    const arr = [];
    language?.data?.language?.forEach((el) => {
      arr.push({
        value: el?.id,
        label: el.name,
      });
    });
    return arr;
  }, [language]);

  const timezoneOptions = useMemo(() => {
    const arr = [];
    timezone?.data?.timezone?.forEach((el) => {
      arr.push({
        value: el?.id,
        label: el.name,
      });
    });
    return arr;
  }, [timezone]);

  const currencyOptions = useMemo(() => {
    const arr = [];
    currency?.data?.currency?.forEach((el) => {
      arr.push({
        value: el?.id,
        label: el.name,
      });
    });
    return arr;
  }, [currency]);

  const {mutate: updateProject, isLoading: btnLoading} =
    useProjectUpdateMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully updated", "success"));
        queryClient.invalidateQueries(["PROJECTS"]);
      },
    });

  const filteredLanguage = languageOptions?.filter((item) =>
    watch("language")?.includes(item.value)
  );
  const filteredCurrency = currencyOptions?.filter(
    (item) => item.value === watch("currency")
  );
  const filteredTimezone = timezoneOptions?.filter(
    (item) => item.value === watch("timezone")
  );

  const onSubmit = (values) => {
    updateProject({
      ...values,
      timezone: filteredTimezone.map((item) => ({
        id: item.value,
        label: item.label,
      }))[0],
      currency: filteredCurrency.map((item) => ({
        id: item.value,
        label: item.label,
      }))[0],
      project_id: company.projectId,
      k8s_namespace: "cp-region-type-id",
      company_id: company.companyId,
      language: filteredLanguage.map((item) => ({
        id: item.value,
        label: item.label,
      })),
    });
  };
  return (
    <div
      style={{
        background: "#fff",
        height: "100%",
      }}>
      <HeaderSettings
        title="Project settings"
        subtitle={watch("title")}
        disabledMenu={false}></HeaderSettings>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-2"
        style={{height: "calc(100vh - 112px)", overflow: "auto"}}>
        <FRow
          label={"Name"}
          componentClassName="flex gap-2 align-center"
          required>
          <HFTextField
            disabledHelperText
            name="title"
            control={control}
            fullWidth
            required
          />
        </FRow>
        <HFAvatarUpload control={control} name="logo" />

        <FRow
          label={"Language"}
          componentClassName="flex gap-2 align-center"
          required>
          <HFMultipleSelect
            options={languageOptions}
            name="language"
            control={control}
            fullWidth
            required
          />
        </FRow>
        <FRow
          label={"Currency"}
          componentClassName="flex gap-2 align-center"
          required>
          <HFAutocomplete
            disabledHelperText
            options={currencyOptions}
            name="currency"
            control={control}
            fullWidth
            required
          />
        </FRow>
        <FRow
          label={"Timezone"}
          componentClassName="flex gap-2 align-center"
          required>
          <HFAutocomplete
            disabledHelperText
            options={timezoneOptions}
            name="timezone"
            control={control}
            fullWidth
            required
          />
        </FRow>
      </form>

      <Footer
        extra={
          <>
            <SecondaryButton onClick={() => navigate(-1)} color="error">
              Close
            </SecondaryButton>
            <PrimaryButton loader={btnLoading} onClick={handleSubmit(onSubmit)}>
              <Save /> Save
            </PrimaryButton>
          </>
        }
      />
    </div>
  );
};

export default ProjectSettingPage;
