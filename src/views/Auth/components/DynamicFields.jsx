import axios from "axios";
import {useEffect, useMemo, useState} from "react";
import {useQuery} from "react-query";
import HFSelect from "../../../components/FormElements/HFSelect";
import classes from "../style.module.scss";

const DynamicFields = ({
  control,
  setValue,
  connection,
  table = {},
  index,
  watch,
  companies,
  userId,
  options,
  selectedCollection,
  setSelectedCollection,
}) => {
  const selectedProjectID = watch("project_id");
  const selectedClientTypeID = watch("client_type");
  const selectedEnvID = watch("environment_id");

  const computedConnections = useMemo(() => {
    return (
      options?.map((item) => ({
        value: item?.guid,
        label: item?.[connection?.view_slug],
      })) ?? []
    );
  }, [options, connection]);

  const url = `${
    import.meta.env.VITE_AUTH_BASE_URL_V2
  }/get-connection-options/${connection?.guid}/${userId}`;

  const data = {
    data: {
      "project-id": selectedProjectID,
      user_ids: userId,
    },
  };

  const config = {
    headers: {
      "environment-id": selectedEnvID,
    },
    params: {
      "project-id": selectedProjectID,
    },
  };

  // const { data: computedConnections = [] } = useQuery(
  //   [
  //     "GET_CONNECTION_OPTIONS",
  //     { table_slug: connection?.table_slug },
  //     { "environment-id": selectedEnvID },
  //   ],
  //   () => {
  //     return axios.get(url, config);
  //   },
  //   {
  //     enabled: !!selectedClientTypeID,
  //     select: (res) => {
  //       return (
  //         res?.data?.data?.data?.response?.map((item) => ({
  //           value: item?.guid,
  //           label: item?.[connection?.view_slug],
  //         })) ?? []
  //       );
  //     },
  //   }
  // );

  useEffect(() => {
    if (computedConnections?.length === 1) {
      setValue(`tables.${index}.object_id`, computedConnections[0]?.value);
      setSelectedCollection(computedConnections[0]?.value);
    }
  }, [computedConnections]);

  useEffect(() => {
    setValue(`tables.${index}.table_slug`, connection?.table_slug);
  }, [watch(`tables.${index}.object_id`)]);

  return (
    <div className={classes.formRow}>
      <p className={classes.label}>{table.label}</p>
      <HFSelect
        control={control}
        name={`tables.${index}.object_id`}
        size="large"
        fullWidth
        options={computedConnections}
        placeholder={connection?.view_slug}
        required
        onChange={(e, val) => {
          console.log("e", e);
          setSelectedCollection(e);
          // setValue(`tables[${index}].table_slug`, connection?.table_slug);
        }}
      />
    </div>
  );
};

export default DynamicFields;
