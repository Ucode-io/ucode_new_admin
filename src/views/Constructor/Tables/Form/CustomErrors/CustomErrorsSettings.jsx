import { Close } from "@mui/icons-material";
import { Divider, IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../../components/FormElements/FRow";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import styles from "./style.module.scss";
import { store } from "../../../../../store";
import actionTypes from "./mock/ActionTypes";
import {
  useCustomErrorCreateMutation,
  useCustomErrorUpdateMutation,
} from "../../../../../services/customErrorMessageService";
import HFNumberField from "../../../../../components/FormElements/HFNumberField";
import { useQueryClient } from "react-query";
import HFTextArea from "../../../../../components/FormElements/HFTextArea";
import HFAutocomplete from "../../../../../components/FormElements/HFAutocomplete";
import constructorObjectService from "../../../../../services/constructorObjectService";

const CustomErrorsSettings = ({
  closeSettingsBlock = () => {},
  customError,
  getRelationFields,
  formType,
  height,
  mainForm,
}) => {
  const authStore = store.getState().auth;
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [errorIds, setErrorIds] = useState(null);
  const [languages, setLanguages] = useState(null);

  const { handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      project_id: authStore.projectId,
      table_id: id,
    },
  });

  const fieldsList = useMemo(() => {
    return mainForm.getValues("fields") ?? [];
  }, []);

  const getErrorIdOptions = (search, id) => {
    constructorObjectService
      .getListV2("object_builder.custom_error", {
        data: {
          limit: 10,
          search: search,
          view_fields: ["title"],
          additional_request: {
            additional_field: "guid",
            additional_values: [id || ""],
          },
        },
      })
      .then((res) => {
        setErrorIds(res.data?.response);
      });
  };
  const getLanguageOptions = (search, id) => {
    constructorObjectService
      .getListV2("setting.languages", {
        data: {
          limit: 10,
          search: search,
          view_fields: ["name"],
          additional_request: {
            additional_field: "guid",
            additional_values: [id || ""],
          },
        },
      })
      .then((res) => {
        setLanguages(res.data?.response);
      });
  };

  const computedLanguageOptions = useMemo(() => {
    return languages?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [languages]);

  const computedErrorIdsOptions = useMemo(() => {
    return errorIds?.map((item) => ({
      value: item.guid,
      label: item.title,
    }));
  }, [errorIds]);

  const { mutate: create, isLoading: createLoading } =
    useCustomErrorCreateMutation({
      onSuccess: () => {
        closeSettingsBlock(null);
        queryClient.refetchQueries(["CUSTOM_ERROR_MESSAGE"]);
      },
    });

  const { mutate: update, isLoading: updateLoading } =
    useCustomErrorUpdateMutation({
      onSuccess: () => {
        closeSettingsBlock(null);
        queryClient.refetchQueries(["CUSTOM_ERROR_MESSAGE"]);
      },
    });

  const submitHandler = (values) => {
    if (formType === "CREATE") {
      create({
        ...values,
      });
    } else {
      update({
        ...values,
      });
    }
  };

  useEffect(() => {
    if (formType === "CREATE") return;
    getLanguageOptions(undefined, customError?.language_id);
    getErrorIdOptions(undefined, customError?.error_id);
    reset({
      ...customError,
    });
  }, [customError]);

  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <h2>
          {formType === "CREATE" ? "Create" : "Edit"} Custom Error Message
        </h2>

        <IconButton onClick={closeSettingsBlock}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.settingsBlockBody} style={{ height }}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className={styles.fieldSettingsForm}
        >
          <div className="p-2">
            <FRow label="Code" required>
              <HFNumberField
                name="code"
                control={control}
                placeholder="Type code"
                fullWidth
                required
              />
            </FRow>
            <FRow label="Message" required>
              <HFTextArea
                name="message"
                control={control}
                placeholder="Type Message"
                fullWidth
                required
              />
            </FRow>
            <Divider className="my-1" />

            <h2>Fields list:</h2>

            {fieldsList.map((field) => (
              <div>
                {field.label} - <strong>{field.slug}</strong>{" "}
              </div>
            ))}

            <Divider className="my-1" />
            <FRow label="Error id">
              <HFAutocomplete
                name="error_id"
                control={control}
                placeholder="Type Error id"
                fullWidth
                options={computedErrorIdsOptions}
                onFieldChange={(e) => {
                  getErrorIdOptions(e.target.value);
                }}
              />
            </FRow>
            <FRow label="Languages" required>
              <HFAutocomplete
                name="language_id"
                control={control}
                placeholder="Type language"
                fullWidth
                required
                options={computedLanguageOptions}
                onFieldChange={(e) => {
                  getLanguageOptions(e.target.value);
                }}
              />
            </FRow>
            <FRow label="Action type" required>
              <HFSelect
                name="action_type"
                control={control}
                placeholder="Action type"
                options={actionTypes}
                autoFocus
                required
              />
            </FRow>
          </div>

          {/* <RowBlock control={control} /> */}

          <div className={styles.settingsFooter}>
            <PrimaryButton
              size="large"
              className={styles.button}
              style={{ width: "100%" }}
              onClick={handleSubmit(submitHandler)}
              loader={createLoading || updateLoading}
            >
              Save
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomErrorsSettings;
