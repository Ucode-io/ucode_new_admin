import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  useApiEndpointCreateMutation,
  useApiEndpointGetByIdQuery,
  useApiEndpointUpdateMutation,
} from "../../../../services/apiEndpointService";
import { store } from "../../../../store";
import { useApiCategoryGetByIdQuery } from "../../../../services/apiCategoryService";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../../store/alert/alert.thunk";
import RingLoaderWithWrapper from "../../../Loaders/RingLoader/RingLoaderWithWrapper";
import { Box, Button, Switch, Tooltip } from "@mui/material";
import Header, { HeaderExtraSide, HeaderLeftSide } from "../Header";
import HFTextField from "../../../FormElements/HFTextField";
import { AiFillEye } from "react-icons/ai";
import styles from "./style.module.scss";
import HFSelect from "../../../FormElements/HFSelect";
import { languages, methods, results, types } from "../Query/mock/ApiEndpoints";
import FRow from "../../../FormElements/FRow";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import AddIcon from "@mui/icons-material/Add";
import CodeMirror from "@uiw/react-codemirror";
import ApiQueryBox from "./Components/ApiQueryBox";
import { Delete } from "@mui/icons-material";
import RedirectDetail from "./Components/RedirectDetail";
import {
  useRedirectCreateMutation,
  useRedirectUpdateMutation,
} from "../../../../services/redirectService";

const flex = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "#fff",
  width: "100%",
  height: "100%",
};

const ApiEndpoint = () => {
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { categoryId, endpointId } = useParams();
  const queryClient = useQueryClient();
  const commitId = queryParams.get("commit_id");
  const company = store.getState().company;
  const dispatch = useDispatch();
  const location = useLocation();
  const [computedData, setComputedData] = useState();

  const { control, watch, setValue, getValues, reset, handleSubmit, register } =
    useForm({
      defaultValues: {
        authentification: true,
      },
    });

  const mainForm = useForm({
    defaultValues: {
      defaultTo: "/",
    },
  });
  const allValues = getValues();
  const redirectId = watch("attributes.redirect_id");

  useEffect(() => {
    setValue("additional_url", mainForm.watch("from"));
  }, [mainForm.watch("from")]);

  const {
    fields: exampleFields,
    append: exampleAppend,
    remove: exampleRemove,
  } = useFieldArray({
    control,
    name: "attributes.example",
  });
  const {
    fields: resultFields,
    append: resultAppend,
    remove: resultRemove,
  } = useFieldArray({
    control,
    name: "attributes.result",
  });

  const { isLoading, refetch } = useApiEndpointGetByIdQuery({
    fieldId: endpointId,
    envId: company.environmentId,
    commitId,
    projectId: company.projectId,
    queryParams: {
      cacheTime: 10,
      enabled: !!endpointId,
      onSuccess: (res) => {
        reset({ ...res });
      },
    },
  });
  const { isLoading: formLoading } = useApiCategoryGetByIdQuery({
    fieldId: categoryId,
    envId: company.environmentId,
    projectId: company.projectId,
    queryParams: {
      cacheTime: 10,
      onSuccess: (res) => {
        setValue("base_url", res.base_url);
      },
    },
  });
  const { mutateAsync: createRedirect, isLoading: redirectCreateLoading } =
    useRedirectCreateMutation({
      onSuccess: (res) => {
        setValue("attributes.redirect_id", res?.id);
        queryClient.refetchQueries(["REDIRECT"]);
        store.dispatch(showAlert("Успешно", "success"));
        onSubmit();
      },
    });
  const { mutateAsync: updateRedirect, isLoading: redirectUpdateLoading } =
    useRedirectUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["REDIRECT"]);
        store.dispatch(showAlert("Успешно", "success"));
        onSubmit();
      },
    });

  const onRedirect = () => {
    if (redirectId)
      updateRedirect({
        ...mainForm.watch(),
        from: mainForm.watch("defaultFrom") + mainForm.watch("from"),
        to: mainForm.watch("defaultTo") + mainForm.watch("to"),
      });
    else
      createRedirect({
        ...mainForm.watch(),
        from: mainForm.watch("defaultFrom") + mainForm.watch("from"),
        to: mainForm.watch("defaultTo") + mainForm.watch("to"),
        order: computedData + 1,
      });
  };

  const { mutate: createApi, isLoading: createLoading } =
    useApiEndpointCreateMutation({
      onSuccess: (res) => {
        dispatch(showAlert("Successfully created", "success"));
        queryClient.refetchQueries(["API_ENDPOINT"]);
        navigate(pathname.replace("create", res.guid));
      },
    });
  const { mutate: updateApi } = useApiEndpointUpdateMutation({
    onSuccess: (res) => {
      dispatch(showAlert("Successfully Updated!", "success"));
      queryClient.refetchQueries(["API_ENDPOINT"]);
      queryClient.refetchQueries(["API_ENDPOINTS_HISTORY"]);
      refetch();
    },
  });

  const onSubmit = () => {
    delete allValues.type_api_endpoint;
    if (endpointId) {
      updateApi({
        ...allValues,
        project_id: company.projectId,
        category_id: categoryId,
        envId: company.environmentId,
      });
    } else {
      createApi({
        ...allValues,
        project_id: company.projectId,
        category_id: categoryId,
        envId: company.environmentId,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box style={flex}>
        {isLoading || formLoading ? (
          <RingLoaderWithWrapper />
        ) : (
          <Box overflow="hidden" width={"100%"}>
            <Header>
              <HeaderLeftSide>
                <HFTextField
                  control={control}
                  name="title"
                  placeholder={"Title"}
                  className={styles.titleInput}
                  defaultValue="Title"
                />
              </HeaderLeftSide>
              <HeaderExtraSide pr={1} gap={2}>
                <Button
                  variant="contained"
                  isLoading={createLoading}
                  onClick={onRedirect}
                >
                  Save
                </Button>

                <Tooltip label="Preview">
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      navigate(`${location.pathname}/preview`);
                    }}
                    padding={0}
                  >
                    <AiFillEye size="20" />
                  </Button>
                </Tooltip>
              </HeaderExtraSide>
            </Header>
            <Box className={styles.endpoint}>
              <Box width={"65%"} borderRight="1px solid #E5E9EB">
                <div className={styles.body}>
                  <div className={styles.title}>
                    <div className={styles.descInput}>
                      <HFTextField
                        control={control}
                        name="desc"
                        placeholder={"Description"}
                        defaultValue="Description"
                        className={styles.titleInput}
                      />
                    </div>
                    <HFSelect
                      options={methods}
                      control={control}
                      disabled
                      width="150px"
                      name="type_api_endpoint"
                      placeholder={"Select..."}
                    />
                  </div>
                  <div className={styles.api}>
                    <HFSelect
                      options={methods}
                      control={control}
                      required
                      name="method"
                      placeholder={"Select"}
                      width="150px"
                    />
                    <div className={styles.url}>
                      <HFTextField
                        control={control}
                        name="attributes.base_url"
                        placeholder="Base url"
                        disabled
                        disabled_text={"Disabled"}
                      />
                      <HFTextField
                        control={control}
                        name="additional_url"
                        placeholder={"Additional url"}
                        required
                        disabled={redirectId ? true : false}
                      />
                    </div>
                  </div>

                  <p>
                    Use {"{param_name}"} to include params in URL. Use{" "}
                    {"{version}"} to include the version. Set the API base URL
                    on the settings page.
                  </p>

                  <div className={styles.headers}>
                    <ApiQueryBox
                      control={control}
                      options={types}
                      fieldName="attributes.path_params"
                      title="Path params"
                      register={register}
                    />
                    <ApiQueryBox
                      control={control}
                      options={types}
                      fieldName="attributes.query_params"
                      title="Query params"
                      register={register}
                    />
                    <ApiQueryBox
                      control={control}
                      options={types}
                      fieldName="attributes.body_params"
                      title="Body params"
                      register={register}
                    />
                    <ApiQueryBox
                      control={control}
                      options={types}
                      fieldName="attributes.header_params"
                      title="Headers"
                      register={register}
                    />
                  </div>
                </div>
                <RedirectDetail
                  watch={watch}
                  mainForm={mainForm}
                  setValue={setValue}
                  redirectId={redirectId}
                  setComputedData={setComputedData}
                />
              </Box>
              <Box width={"35%"}>
                <div className={styles.auth}>
                  <p>AUTH</p>
                  <p>
                    When should Authentication be enabled for this endpoint?
                  </p>
                  <div className={styles.switch}>
                    <FRow>
                      {watch("authentification") ? "Enabled" : "Disabled"}
                    </FRow>
                    <Switch
                      id="isChecked"
                      // checked={watch("authentification")}
                      isChecked={watch("authentification")}
                      onChange={(e) => {
                        setValue("authentification", e.target.checked);
                      }}
                    />
                  </div>
                </div>
                <div className={styles.body}>
                  <div className={styles.examples}>
                    <p>EXAMPLE</p>
                    <Tabs>
                      <TabList>
                        {exampleFields.map((field, index) => (
                          <Tab borderBottom={"0"} key={field.id}>
                            {watch(`attributes.example.${index}.lang`)}
                          </Tab>
                        ))}

                        <AddIcon
                          onClick={() => {
                            exampleAppend({
                              title: "Text",
                              body: "",
                              lang: "Text",
                            });
                          }}
                        />
                      </TabList>

                      {exampleFields.map((field, index) => (
                        <TabPanel
                          bg={"#fff"}
                          border={"1px solid #E5E9EB"}
                          key={field.id}
                        >
                          <div className={styles.head}>
                            <div className={styles.actions}>
                              <Delete
                                onClick={() =>
                                  exampleRemove(exampleFields.id - 1)
                                }
                              />
                            </div>

                            <div className={styles.type}>
                              <HFSelect
                                options={languages}
                                control={control}
                                required
                                name={`attributes.example.${index}.lang`}
                                placeholder={"Select..."}
                                onChange={(e) => {
                                  setValue(
                                    `attributes.example.${index}.title`,
                                    e.value
                                  );
                                }}
                              />
                            </div>
                          </div>

                          <CodeMirror
                            value={getValues(
                              `attributes.example.${index}.body`
                            )}
                            height="200px"
                            onChange={(value) => {
                              setValue(
                                `attributes.example.${index}.body`,
                                value
                              );
                            }}
                          />
                        </TabPanel>
                      ))}
                    </Tabs>
                  </div>

                  <div className={styles.results}>
                    <p>RESULTS</p>
                    <Tabs>
                      <TabList>
                        {resultFields.map((field, index) => (
                          <Tab borderBottom={"0"} key={field.id}>
                            <span
                              className={
                                watch(`attributes.result.${index}.color`) ===
                                "#1FC53E"
                                  ? styles.ok
                                  : styles.error
                              }
                            />
                            {watch(`attributes.result.${index}.code`) ||
                              watch(`attributes.result.${index}.title`)}
                          </Tab>
                        ))}

                        <AddIcon
                          onClick={() => {
                            resultAppend({
                              title: "Text",
                              body: "",
                              lang: "Text",
                              code: "",
                              color: "",
                            });
                          }}
                        />
                      </TabList>

                      {resultFields.map((field, index) => (
                        <TabPanel
                          bg={"#fff"}
                          border={"1px solid #E5E9EB"}
                          key={field.id}
                        >
                          <div className={styles.head}>
                            <div className={styles.actions}>
                              <div className={styles.code}>
                                <HFSelect
                                  options={results}
                                  control={control}
                                  placeholder={"Select"}
                                  required
                                  name={`attributes.result.${index}.code`}
                                  width="100px"
                                  onChange={(e) => {
                                    setValue(
                                      `attributes.result.${index}.code`,
                                      e.value
                                    );
                                    setValue(
                                      `attributes.result.${index}.color`,
                                      e.color
                                    );
                                  }}
                                />
                              </div>
                              <Delete
                                onClick={() =>
                                  resultRemove(resultFields.id - 1)
                                }
                              />
                            </div>

                            <div className={styles.type}>
                              <HFSelect
                                options={languages}
                                control={control}
                                placeholder={"Select"}
                                required
                                name={`attributes.result.${index}.lang`}
                                width="100%"
                              />
                            </div>
                          </div>

                          <CodeMirror
                            value={getValues(`attributes.result.${index}.body`)}
                            height="200px"
                            onChange={(value) => {
                              setValue(
                                `attributes.result.${index}.body`,
                                value
                              );
                            }}
                          />
                        </TabPanel>
                      ))}
                    </Tabs>
                  </div>
                </div>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </form>
  );
};

export default ApiEndpoint;
