import {Box, Dialog} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useQuery} from "react-query";
import {useDispatch} from "react-redux";
import classes from "./style.module.scss";
import listToOptions from "../../../utils/listToOptions";
import connectionServiceV2 from "../../../services/auth/connectionService";
import authService from "../../../services/auth/authService";
import companyService from "../../../services/companyService";
import {loginAction} from "../../../store/auth/auth.thunk";
import LoginTab from "./LoginTab";
import {authActions} from "../../../store/auth/auth.slice";
import LoginCompaniesList from "./LoginCompaniesList";

const LoginFormDesign = ({}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [connectionCheck, setConnectionCheck] = useState(false);
  const [isUserId, setIsUserId] = useState();
  const [selectedCollection, setSelectedCollection] = useState();
  const [codeAppValue, setCodeAppValue] = useState({});
  const [googleAuth, setGoogleAuth] = useState(null);

  const [open, setOpen] = useState(false);

  const {control, handleSubmit, watch, setValue} = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValue("username", "");
    setValue("password", "");
  };

  const selectedCompanyID = watch("company_id");
  const selectedProjectID = watch("project_id");
  const selectedClientTypeID = watch("client_type");
  const selectedEnvID = watch("environment_id");
  const getFormValue = watch();

  const {data: computedConnections = [], isLoading} = useQuery(
    [
      "GET_CONNECTION_LIST",
      {"project-id": selectedProjectID},
      {"environment-id": selectedEnvID},
      {"user-id": isUserId},
    ],
    () => {
      return connectionServiceV2.getList(
        {
          "project-id": selectedProjectID,
          client_type_id: selectedClientTypeID,
          "user-id": isUserId,
        },
        {"environment-id": selectedEnvID}
      );
    },
    {
      enabled: !!selectedClientTypeID && !!selectedEnvID,
      select: (res) => res.data.response ?? [],
      onSuccess: (res) => {
        computeConnections(res);
        setConnectionCheck(true);
        setLoading(true);
      },
      onError: () => {
        setLoading(false);
      },
    }
  );

  //=======COMPUTE COMPANIES
  const computedCompanies = useMemo(() => {
    return listToOptions(companies, "name");
  }, [companies]);

  //=======COMPUTE PROJECTS
  const computedProjects = useMemo(() => {
    const company = companies?.find(
      (company) => company.id === selectedCompanyID
    );
    return listToOptions(company?.projects, "name");
  }, [companies, selectedCompanyID]);

  //=======COMPUTE ENVIRONMENTS
  const computedEnvironments = useMemo(() => {
    const company = companies?.find(
      (company) => company.id === selectedCompanyID
    );
    const companyProject = company?.projects?.find(
      (el) => el?.id === selectedProjectID
    );

    return companyProject?.resource_environments?.map((item) => ({
      label: item?.name,
      value: item?.environment_id,
      access_type: item?.access_type,
    }));
  }, [selectedEnvID, companies, selectedProjectID]);

  //======COMPUTE CLIENTTYPES
  const computedClientTypes = useMemo(() => {
    const company = companies?.find(
      (company) => company.id === selectedCompanyID
    );
    const companyProject = company?.projects?.find(
      (el) => el?.id === selectedProjectID
    );

    const companyEnvironment = companyProject?.resource_environments?.find(
      (el) => el?.environment_id === selectedEnvID
    );

    return companyEnvironment?.client_types?.response?.map((item) => ({
      label: item?.name,
      value: item?.guid,
    }));
  }, [companies, selectedCompanyID, selectedEnvID, selectedProjectID]);

  const register = (data) => {
    authService
      .register(data)
      .then((res) => {})
      .catch(() => {
        setLoading(false);
      });
  };

  const onSubmit = (values) => {
    getCompany(values);
  };

  const getCompany = (values) => {
    const data = {
      password: values?.password ? values?.password : "",
      username: values?.username ? values?.password : "",
      [values?.type]: values?.recipient || undefined,
      ...values,
    };

    setLoading(true);
    companyService
      .getCompanyList(data)
      .then((res) => {
        if (res?.companies) {
          setIsUserId(res?.user_id ?? "");
          setCompanies(res?.companies ?? {});
          computeCompanyElement(res?.companies ?? "");
          localStorage.setItem("");
        } else {
          dispatch(showAlert("The company does not exist", "error"));
        }

        if (index === 1) register(values);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const checkConnections = useMemo(() => {
    if (getFormValue?.tables) {
      const tableKeys = Object.keys(getFormValue.tables);
      return tableKeys.every((key) => {
        const item = getFormValue.tables[key];
        return item?.object_id && item?.table_slug;
      });
    }
    return false;
  }, [getFormValue]);

  const computeConnections = (connections) => {
    const data = {
      ...getFormValue,
      ...googleAuth,
      type: googleAuth?.type ? googleAuth?.type : getFormValue?.type,
      sms_id: codeAppValue?.sms_id,
    };
    if (
      (Array.isArray(connections) && connections?.length === 0) ||
      connections === undefined
    ) {
      if (
        getFormValue?.username &&
        getFormValue?.password &&
        getFormValue?.client_type &&
        getFormValue?.project_id &&
        getFormValue?.environment_id
      ) {
        onSubmitDialog(data);
      } else if (googleAuth?.type === "google" && googleAuth?.google_token) {
        onSubmitDialog(data);
      } else if (
        !getFormValue?.username ||
        !getFormValue?.password ||
        !getFormValue?.company_id ||
        !getFormValue?.project_id ||
        !getFormValue?.environment_id ||
        !getFormValue?.client_type
      ) {
        handleClickOpen();
      }
    } else if (Array.isArray(connections) && connections?.length > 0) {
      if (
        getFormValue?.username &&
        getFormValue?.password &&
        getFormValue?.client_type &&
        getFormValue?.project_id &&
        getFormValue?.environment_id &&
        checkConnections
      ) {
        onSubmitDialog(getFormValue);
      } else {
        handleClickOpen();
      }
    }
  };

  const onSubmitDialog = (values) => {
    const data = {
      ...values,
      type: values?.phone
        ? "phone"
        : values?.email
          ? "email"
          : values?.type === "google"
            ? "google"
            : undefined,
      sms_id: codeAppValue?.sms_id,
    };
    const computedProject = companies[0]?.projects
      ?.find((item) => item?.id === selectedProjectID)
      ?.resource_environments?.map((el) => el?.environment_id);
    const computedEnv = computedEnvironments?.find(
      (item) => item?.value === selectedEnvID
    );
    const currencies = companies[0]?.projects?.find(
      (item) => item?.id === selectedProjectID
    )?.currencies;

    dispatch(authActions.setStatus(computedEnv?.access_type));
    dispatch(
      loginAction({
        ...data,
        environment_ids: computedProject,
        currencies: currencies,
      })
    );
  };

  const computeCompanyElement = (company) => {
    const validLength = company?.length === 1;
    if (validLength) {
      setValue("company_id", company?.[0]?.id);
    }
    if (validLength) {
      if (company?.[0]?.projects?.length === 1) {
        setValue("project_id", company?.[0]?.projects?.[0]?.id);
      }
    }

    if (validLength) {
      if (company?.[0]?.projects?.length === 1) {
        if (company?.[0]?.projects?.[0]?.resource_environments?.length === 1) {
          setValue(
            "environment_id",
            company?.[0]?.projects?.[0]?.resource_environments?.[0]
              ?.environment_id
          );
        }
      }
    }
    if (validLength) {
      if (company?.[0]?.projects?.length === 1) {
        if (company?.[0]?.projects?.[0]?.resource_environments?.length === 1) {
          if (
            company?.[0]?.projects?.[0]?.resource_environments?.[0]
              ?.client_types?.response?.length === 1
          ) {
            setValue(
              "client_type",
              company?.[0]?.projects?.[0]?.resource_environments?.[0]
                ?.client_types?.response?.[0]?.guid
            );
          }
        }
      }
    }
  };

  useEffect(() => {
    if (computedConnections?.length > 0) {
      computedConnections.forEach((connection, index) => {
        if (connection.options.length === 1) {
          setValue(`tables[${index}].object_id`, connection?.options[0]?.guid);
          setSelectedCollection(connection.options[0]?.value);
          setValue(
            `tables[${index}].table_slug`,
            connection?.options?.[0]?.[connection?.view_slug]
          );
        }
      });
    }
  }, [computedConnections]);

  useEffect(() => {
    if (computedCompanies?.length === 1) {
      setValue("company_id", computedCompanies?.[0]?.value);
    }
    if (computedProjects?.length === 1) {
      setValue("project_id", computedProjects?.[0]?.value);
    }
    if (computedEnvironments?.length === 1) {
      setValue("environment_id", computedEnvironments?.[0]?.value);
    }
    if (computedClientTypes?.length === 1) {
      setValue("client_type", computedClientTypes?.[0]?.value);
    }
  }, [
    computedCompanies,
    computedProjects,
    computedEnvironments,
    computedClientTypes,
  ]);

  useEffect(() => {
    const shouldOpen =
      computedCompanies?.length > 1 ||
      computedProjects?.length > 1 ||
      computedEnvironments?.length > 1 ||
      computedClientTypes?.length > 1;

    if (shouldOpen) {
      handleClickOpen();
    }
  }, [
    computedCompanies,
    computedProjects,
    computedEnvironments,
    computedClientTypes,
  ]);

  useEffect(() => {
    if (connectionCheck && getFormValue?.tables) {
      computeConnections(getFormValue?.tables);
    }
  }, [connectionCheck, getFormValue?.tables]);

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <LoginTab loading={loading} control={control} getCompany={getCompany} />
      </form>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            padding: "30px",
            width: "550px",
            maxHeight: "70vh",
            borderRadius: "12px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
          },
        }}>
        <LoginCompaniesList
          computedProjects={computedProjects}
          computedCompanies={computedCompanies}
          computedEnvironments={computedEnvironments}
          computedClientTypes={computedClientTypes}
          computedConnections={computedConnections}
          selectedCollection={selectedCollection}
          companies={companies}
          loading={loading}
          control={control}
          watch={watch}
          setValue={setValue}
          handleSubmit={handleSubmit(onSubmitDialog)}
          setSelectedCollection={setSelectedCollection}
        />
      </Dialog>
    </Box>
  );
};

export default LoginFormDesign;
