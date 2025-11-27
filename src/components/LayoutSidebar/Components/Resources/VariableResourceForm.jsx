import { Save } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Tabs } from "react-tabs";
import { store } from "../../../../store";
import listToOptions from "../../../../utils/listToOptions";
import apiKeyService from "../../../../services/apiKey.service";
import roleServiceV2 from "../../../../services/roleServiceV2";
import clientTypeServiceV2 from "../../../../services/auth/clientTypeServiceV2";
import SecondaryButton from "../../../Buttons/SecondaryButton";
import HeaderSettings from "../../../HeaderSettings";
import FormCard from "../../../FormCard";
import FRow from "../../../FormElements/FRow";
import HFTextField from "../../../FormElements/HFTextField";
import PrimaryButton from "../../../Buttons/PrimaryButton";
import Footer from "../../../Footer";
import resourceService from "../../../../services/resourceService";
import resourceVariableService from "../../../../services/resourceVariableService";


const VariableResourceForm = () => {
  const { appId, apiKeyId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const [btnLoader, setBtnLoader] = useState();
  const [role, setRole] = useState([]);
  const [loader, setLoader] = useState(false);
  const [clientType, setClientType] = useState([]);
  const authStore = store.getState().auth;

  const mainForm = useForm({
    defaultValues: {
      environment_id: authStore.environmentId,
      project_id: authStore.projectId,
      client_type_id: authStore.clientType.id,
      role_id: authStore.roleInfo.id,
    },
  });



  const createApp = (data) => {
    setBtnLoader(true);

    resourceVariableService.createVariable({
      ...data,
      project_resource_id: appId
    })
      .then(() => {
        navigate(-1);
        getRoleList();
      })
      .catch(() => setBtnLoader(false));
  };

  const updateApp = (data) => {
    setBtnLoader(true);

    resourceVariableService
      .update({
        ...data,
      })
      .then(() => {
        navigate(-1);
        getRoleList();
      })
      .catch(() => setBtnLoader(false));
  };

  const getRoleList = () => {
    roleServiceV2
      .getList({
        clienty_type_id: mainForm.watch("client_type_id"),
      })
      .then((res) => {
        setRole(res.data);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };
  const getClientTypeList = () => {
    clientTypeServiceV2
      .getList({})
      .then((res) => {
        setClientType(res.data);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };

  const getById = () => {
    resourceVariableService
      .getById(apiKeyId)
      .then((res) => {
        mainForm.reset(res);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };



  useEffect(() => {
    getClientTypeList();
  }, []);
  useEffect(() => {
    if (mainForm.watch("client_type_id")) {
      getRoleList();
    }
  }, [mainForm.watch("client_type_id")]);

  useEffect(() => {
    if (apiKeyId) {
      getById();
    }
  }, [apiKeyId]);

  const computedClientTypes = useMemo(() => {
    return listToOptions(clientType?.response, "name", "guid");
  }, [clientType?.response]);

  const computedRoles = useMemo(() => {
    return listToOptions(role?.response, "name", "guid");
  }, [role?.response]);

  const onSubmit = (data) => {
    if (apiKeyId) updateApp(data);
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
          title="Приложение"
          backButtonLink={-1}
          subtitle={appId ? mainForm.watch("name") : "Key"}
        ></HeaderSettings>

        <form
          onSubmit={mainForm.handleSubmit(onSubmit)}
          className="p-2"
          style={{ height: "calc(100vh - 112px)", overflow: "auto" }}
        >
          <FormCard title="Детали" maxWidth={500}>
            <FRow
              label={"Key"}
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFTextField
                disabledHelperText
                name="key"
                control={mainForm.control}
                fullWidth
                required
              />
            </FRow>
            <FRow
              label={"Value"}
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFTextField
                disabledHelperText
                name="value"
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

export default VariableResourceForm;
