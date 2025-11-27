import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useApiEndpointGetByIdQuery } from "../../../../../services/apiEndpointService";
import { useApiCategoryGetByIdQuery } from "../../../../../services/apiCategoryService";
import axios from "axios";
import strFromObj from "../../../../../utils/generateUrl";
import listToObject from "../../../../../utils/generateParams";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import { Box, Button, Select } from "@mui/material";
import styles from "../style.module.scss";
import BackButton from "../../../../BackButton";
import RingLoaderWithWrapper from "../../../../Loaders/RingLoader/RingLoaderWithWrapper";
import DetailQueryBox from "./DetailQueryBox";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { ArrowDown, CopyIcon } from "../../../../../assets/icons/icon";
import CodeMirror from "@uiw/react-codemirror";
import HFSelect from "../../../../FormElements/HFSelect";
import CSelect from "../../../../CSelect";

const ApiEndpointDetail = () => {
  const { endpointId, categoryId, projectId } = useParams();
  const [response, setResponse] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { control, setValue, getValues, reset, watch } = useForm({
    defaultValues: {
      base_url: "https:api.admin.ucode.io/",
      authentification: true,
    },
  });
  const languages = watch("attributes.example");
  const method = getValues("method")?.toLowerCase();
  const url = `${watch("base_url")}${watch("additional_url")}`;

  const responseOptions = useMemo(() => {
    let arr = [];
    arr = watch("attributes.result")?.map((el) => {
      return {
        label: el.code,
        value: el.body,
      };
    });
    return arr;
  }, [watch("attributes.result")]);

  const { isLoading } = useApiEndpointGetByIdQuery({
    fieldId: endpointId,
    projectId,
    queryParams: {
      cacheTime: 10,
      enabled: !!endpointId,
      onSuccess: (res) => {
        reset(res);
      },
    },
  });
  const { isLoading: formLoading } = useApiCategoryGetByIdQuery({
    fieldId: categoryId,
    projectId,
    queryParams: {
      cacheTime: 10,
      enabled: !!watch("method"),
      onSuccess: (res) => {
        setValue("base_url", res.base_url);
      },
    },
  });

  const Request = (method, url) => {
    const attributes = getValues("attributes");
    axios({
      method: method,
      url: strFromObj(getValues("attributes.path_params"), url),
      data: listToObject(attributes.body_params),
      headers: listToObject(attributes.header_params),
      params: listToObject(attributes.query_params),
    })
      .then((res) => {
        setResponse(JSON.stringify(res.data, null, 2));
        dispatch(showAlert("Успешно", "success"));
      })
      .catch((err) => {
        console.log("err", err);
        setResponse(err.message);
        dispatch(showAlert("Ошибка", "error"));
      });
  };

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "space-between",
        height: "100vh",
        overflow: "auto",
        background: "#fff",
      }}
    >
      <Box flex={0.6}>
        <div className={styles.detail}>
          <h3 className={styles.title}>
            <BackButton
              onClick={() => {
                navigate(-1);
              }}
            />
            {getValues("title")}
          </h3>
          <div className={styles.method}>
            <div>
              <span>{getValues("method")}</span>
              {getValues("base_url")}
              {getValues("additional_url")}
            </div>
            <p>{getValues("desc")}</p>
          </div>
          {isLoading || formLoading ? (
            <RingLoaderWithWrapper />
          ) : (
            <div className={styles.cards}>
              <DetailQueryBox
                control={control}
                fields={getValues("attributes.path_params")}
                title="Path params"
                fieldName="attributes.path_params"
              />
              <DetailQueryBox
                control={control}
                fields={getValues("attributes.query_params")}
                title="Query params"
                fieldName="attributes.query_params"
              />
              <DetailQueryBox
                control={control}
                fields={getValues("attributes.body_params")}
                title="Body params"
                fieldName="attributes.body_params"
              />
              <DetailQueryBox
                control={control}
                fields={getValues("attributes.header_params")}
                title="Header params"
                fieldName="attributes.header_params"
              />
            </div>
          )}
        </div>
      </Box>
      <Box flex={0.4}>
        <div className={styles.request}>
          <p>Language</p>
          <div>
            <Tabs
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
              className={styles.tabs}
            >
              <TabList>
                {languages?.map((field) => (
                  <Tab
                    selectedClassName={styles.active}
                    className={styles.tab}
                    key={field.id}
                  >
                    {field.lang}
                  </Tab>
                ))}
              </TabList>
              {languages?.map((field) => (
                <TabPanel bg={"#fff"} p={0} key={field.id}>
                  <div className={styles.redactor}>
                    <div className={styles.type}>
                      <h3 className={styles.title}>Axios</h3>
                      <ArrowDown width={"12"} height={"6"} />
                    </div>
                    <CodeMirror
                      value={field.body}
                      height="auto"
                      width="360px"
                      color="#00C387"
                      theme={"dark"}
                    />
                    <div className={styles.action}>
                      <CopyIcon />
                      <Button
                        variant="contained"
                        onClick={() => Request(method, url)}
                      >
                        Try it
                      </Button>
                    </div>
                  </div>
                </TabPanel>
              ))}{" "}
              <div className={styles.response}>
                <div className={styles.example}>
                  <h3 className={styles.title}>Response</h3>
                  <div className={styles.select}>
                    <CSelect
                      placeholder="Example"
                      options={responseOptions}
                      value={response}
                      onChange={(e) => {
                        setResponse(e?.target?.value);
                      }}
                      disabledHelperText
                    />
                  </div>
                </div>
                {response ? (
                  <>
                    <CodeMirror
                      value={response}
                      width="360px"
                      height="400px"
                      color="#00C387"
                      nonce
                    />
                  </>
                ) : (
                  <div className={styles.action}>
                    <p>
                      Click Try it to start a request and see the response here.
                      Or choose an example
                    </p>
                    <p>application/json</p>
                  </div>
                )}
              </div>
            </Tabs>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default ApiEndpointDetail;
