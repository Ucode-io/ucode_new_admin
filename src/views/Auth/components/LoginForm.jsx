import {AccountCircle, Lock} from "@mui/icons-material";
import {Button, Dialog, InputAdornment} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {Box} from "@mui/material";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {connect, useDispatch} from "react-redux";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFTextField from "../../../components/FormElements/HFTextField";
import {firebaseCloudMessaging} from "../../../firebase/config";
import authService from "../../../services/auth/authService";
import connectionServiceV2 from "../../../services/auth/connectionService";
import environmentService from "../../../services/environmentService";
import {store} from "../../../store";
import {showAlert} from "../../../store/alert/alert.thunk";
import {loginAction} from "../../../store/auth/auth.thunk";
import {companyActions} from "../../../store/company/company.slice";
import listToOptions from "../../../utils/listToOptions";
import classes from "../style.module.scss";
import DynamicFields from "./DynamicFields";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import RecoverPassword from "./RecoverPassword";
import {useRoleListQuery} from "../../../services/roleServiceV2";
import RegisterFormPage from "./RegisterFormPage";
import companyService from "../../../services/companyService";
import HFNumberField from "../../../components/FormElements/HFNumberField";
import HFInternationPhone from "../../../components/FormElements/HFInternationPhone";
import {authActions} from "../../../store/auth/auth.slice";

const LoginForm = ({setIndex, index, setFormType, formType}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [connectionCheck, setConnectionCheck] = useState(false);
  const [isUserId, setIsUserId] = useState();
  const [selectedCollection, setSelectedCollection] = useState();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [codeAppValue, setCodeAppValue] = useState({});
  const [type, setType] = useState("");

  const {control, handleSubmit, watch, setValue, reset, getValues} = useForm();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setValue("username", "");
    setValue("password", "");
  };

  useEffect(() => {
    getFcmToken();
  }, []);

  const getFcmToken = async () => {
    const token = await firebaseCloudMessaging.init();
    localStorage.setItem("fcmToken", token);
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
      enabled: !!selectedClientTypeID,
      select: (res) => res.data.response ?? [],
      onSuccess: (res) => {
        computeConnections(res);
        setConnectionCheck(true);
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
    setLoading(true);

    authService
      .register(data)
      .then((res) => {
        setIndex(0);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onSubmit = (values) => {
    if (selectedTabIndex === 0) {
      getCompany(values);
    }
    if (selectedTabIndex === 1) {
      if (codeAppValue?.sms_id) {
        getCompany({
          ...values,
          sms_id: codeAppValue?.sms_id,
          type: "phone",
        });
      } else {
        getSendCodeApp({...values, type: "PHONE"});
      }
    }
    if (selectedTabIndex === 2) {
      if (codeAppValue?.sms_id) {
        getCompany({
          ...values,
          sms_id: codeAppValue?.sms_id,
          type: "email",
        });
      } else {
        getSendCodeApp({...values, type: "EMAIL"});
      }
    }
  };

  const getCompany = (values) => {
    setType(values?.type);
    const data = {
      password: values?.password ? values?.password : null,
      username: values?.username ? values?.password : null,
      [values?.type]: values?.recipient,
      ...values,
    };
    companyService
      .getCompanyList(data)
      .then((res) => {
        if (res?.companies) {
          setIsUserId(res?.user_id);
          setCompanies(res?.companies);
          computeCompanyElement(res?.companies);
          localStorage.setItem("");
          setLoading(true);
        } else {
          dispatch(showAlert("The company does not exist", "error"));
          setLoading(false);
        }

        if (index === 1) register(values);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getSendCodeApp = (values) => {
    authService
      .sendCodeApp({
        recipient: values?.recipient,
        text: "You otp code is",
        type: values?.type,
      })
      .then((res) => {
        setCodeAppValue(res);
      })
      .catch((err) => {
        console.log("eerrrrrrr", err);
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
    const computedProject = companies[0]?.projects
      ?.find((item) => item?.id === selectedProjectID)
      ?.resource_environments?.map((el) => el?.environment_id);
    const computedEnv = computedEnvironments?.find(
      (item) => item?.value === selectedEnvID
    );

    setLoading(true);
    dispatch(authActions.setStatus(computedEnv?.access_type));
    dispatch(loginAction({...values, environment_ids: computedProject}));
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
    getFcmToken();
    reset();
  }, [index]);

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

  const selectedProject = useMemo(() => {
    const computedProject = companies[0]?.projects?.find(
      (item) => item?.id === selectedProjectID
    );

    return computedProject?.resource_environments ?? [];
  }, [selectedProjectID, companies]);

  return (
    <>
      {formType === "RESET_PASSWORD" ? (
        <RecoverPassword setFormType={setFormType} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <Tabs
            selected={selectedTabIndex}
            direction={"ltr"}
            onSelect={(index) => setSelectedTabIndex(index)}>
            {formType === "LOGIN" ? (
              <div style={{padding: "0 20px"}}>
                <TabList>
                  <Tab>{t("login")}</Tab>
                  <Tab>{t("phone")}</Tab>
                  <Tab>{t("E-mail")}</Tab>
                </TabList>

                <div
                  className={classes.formArea}
                  style={{marginTop: "10px", height: `calc(100vh - 400px)`}}>
                  <TabPanel>
                    <>
                      <div className={classes.formRow}>
                        <p className={classes.label}>{t("login")}</p>
                        <HFTextField
                          required
                          control={control}
                          name="username"
                          size="large"
                          fullWidth
                          placeholder={t("enter.login")}
                          autoFocus
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccountCircle style={{fontSize: "30px"}} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                      <div className={classes.formRow}>
                        <p className={classes.label}>{t("password")}</p>
                        <HFTextField
                          required
                          control={control}
                          name="password"
                          type="password"
                          size="large"
                          fullWidth
                          placeholder={t("enter.password")}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock style={{fontSize: "30px"}} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                    </>

                    {
                      <Button
                        variant="text"
                        type="button"
                        onClick={() => {
                          formType === "RESET_PASSWORD"
                            ? setFormType("LOGIN")
                            : setFormType("RESET_PASSWORD");
                        }}>
                        Forgot password?
                      </Button>
                    }
                  </TabPanel>
                  <TabPanel>
                    <div className={classes.formRow}>
                      <p className={classes.label}>{t("Phone")}</p>
                      {/* <HFTextField
                        required
                        control={control}
                        name="recipient"
                        size="large"
                        fullWidth
                        placeholder={t("enter.phone")}
                        autoFocus
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircle style={{ fontSize: "30px" }} />
                            </InputAdornment>
                          ),
                        }}
                      /> */}
                      <HFInternationPhone
                        required
                        control={control}
                        name="recipient"
                        size="large"
                        fullWidth
                        placeholder={t("enter.phone")}
                        autoFocus
                      />
                    </div>

                    {codeAppValue?.sms_id && (
                      <div className={classes.formRow}>
                        <p className={classes.label}>{t("Otp")}</p>
                        <HFTextField
                          required
                          control={control}
                          name="otp"
                          type="text"
                          size="large"
                          fullWidth
                          placeholder={"Otp..."}
                        />
                      </div>
                    )}
                  </TabPanel>
                  <TabPanel>
                    <div className={classes.formRow}>
                      <p className={classes.label}>{t("Email")}</p>
                      <HFTextField
                        required
                        control={control}
                        name="recipient"
                        size="large"
                        fullWidth
                        type="email"
                        placeholder={t("enter.email")}
                        autoFocus
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircle style={{fontSize: "30px"}} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>

                    {codeAppValue?.sms_id && (
                      <div className={classes.formRow}>
                        <p className={classes.label}>{t("Otp")}</p>
                        <HFTextField
                          required
                          control={control}
                          name="otp"
                          type="text"
                          size="large"
                          fullWidth
                          placeholder={"Otp..."}
                        />
                      </div>
                    )}
                  </TabPanel>
                </div>
              </div>
            ) : (
              <RegisterFormPage setFormType={setFormType} formType={formType} />
            )}
          </Tabs>
          {formType !== "register" && (
            <>
              <div className={classes.buttonsArea}>
                <PrimaryButton size="large" loader={loading}>
                  {t("enter")}
                </PrimaryButton>
                {/* <Button variant="contained" fullWidth type="submit">
                  ENter
                </Button> */}
              </div>
              <div className={classes.buttonsArea}>
                <PrimaryButton
                  onClick={() => setFormType("register")}
                  size="large"
                  type="button"
                  loader={true}
                  className={`${
                    formType === "register"
                      ? classes.registerBtnPage
                      : classes.registerBtn
                  }`}>
                  {t("Зарегистрироваться")}
                </PrimaryButton>
              </div>
            </>
          )}
        </form>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <div
          style={{
            padding: "0 20px",
            width: "500px",
            maxHeight: `calc(100vh - 150px)`,
            minHeight: "200px",
          }}>
          <h2 className={classes.headerContent}>Multi Company</h2>
          <div className={classes.formArea}>
            {computedCompanies?.length !== 1 && (
              <div className={classes.formRow}>
                <p className={classes.label}>{t("company")}</p>
                <HFSelect
                  required
                  control={control}
                  name="company_id"
                  size="large"
                  fullWidth
                  placeholder={t("enter.company")}
                  options={computedCompanies}
                />
              </div>
            )}
            {computedProjects?.length !== 1 && (
              <div className={classes.formRow}>
                <p className={classes.label}>{t("project")}</p>
                <HFSelect
                  required
                  control={control}
                  name="project_id"
                  size="large"
                  placeholder={t("enter.project")}
                  options={computedProjects}
                />
              </div>
            )}
            {computedEnvironments?.length !== 1 && (
              <div className={classes.formRow}>
                <p className={classes.label}>{t("environment")}</p>
                <HFSelect
                  required
                  control={control}
                  name="environment_id"
                  size="large"
                  placeholder={t("select.environment")}
                  options={computedEnvironments}
                />
              </div>
            )}
            {computedClientTypes?.length !== 1 && (
              <div className={classes.formRow}>
                <p className={classes.label}>{t("client_type")}</p>
                <HFSelect
                  required
                  control={control}
                  name="client_type"
                  size="large"
                  placeholder={t("enter.client_type")}
                  options={computedClientTypes}
                />
              </div>
            )}
            {computedConnections.length
              ? computedConnections?.map((connection, idx) => (
                  <DynamicFields
                    key={connection?.guid}
                    table={computedConnections}
                    connection={connection}
                    index={idx}
                    control={control}
                    setValue={setValue}
                    watch={watch}
                    options={connection?.options}
                    companies={companies}
                    selectedCollection={selectedCollection}
                    setSelectedCollection={setSelectedCollection}
                  />
                ))
              : null}
          </div>
          <div className={classes.footerContent}>
            <Button
              sx={{marginRight: "10px"}}
              variant="contained"
              color="error"
              onClick={handleClose}>
              Cancel
            </Button>
            <div className={classes.buttonsArea}>
              <PrimaryButton
                onClick={handleSubmit(onSubmitDialog)}
                size="small"
                loader={loading}>
                {t("enter")}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Dialog>

      {formType === "RESET_PASSWORD" && (
        <SecondaryButton
          size="large"
          style={{marginTop: "20px"}}
          type="button"
          onClick={() => {
            formType === "RESET_PASSWORD"
              ? setFormType("LOGIN")
              : setFormType("RESET_PASSWORD");
          }}>
          Back to login
        </SecondaryButton>
      )}
    </>
  );
};

export default LoginForm;
