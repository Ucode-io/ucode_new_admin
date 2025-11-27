import { Button } from "@mui/material";
import React, { useMemo } from "react";
import styles from "../styles.module.scss";
import { useQuery } from "react-query";
import constructorTableService from "../../../../services/constructorTableService";
import listToOptions from "../../../../utils/listToOptions";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import constructorObjectService from "../../../../services/constructorObjectService";
import { useWatch } from "react-hook-form";
import tablePermissionService from "../../../../services/tablePermission";
import ClearIcon from "@mui/icons-material/Clear";
import ShareModalItems from "./ShareModalItems";

function ShareContent({
  handleClose,
  control,
  watch,
  handleSubmit,
  setValue,
  reset,
}) {
  const { tableSlug } = useParams();
  const projectId = useSelector((state) => state.auth.projectId);

  const client_type = useWatch({
    control,
    name: "client_type",
  });
  const role_id = useWatch({
    control,
    name: "guid",
  });

  const slug = useWatch({
    control,
    name: "table.slug",
  });

  const params = {
    role_id: role_id,
    table_slug: slug ?? tableSlug,
    // project_id: projectId,
  };
  //============   TABLE GET LIST
  const { data: tables = [] } = useQuery(
    ["GET_TABLES_LIST"],
    () => {
      return constructorTableService.getList({ projectId });
    },
    {
      select: (data) => data?.tables ?? [],
    }
  );

  //===============   CLIENT TYPE GET LIST
  const { data: clientTypeList } = useQuery(
    ["GET_OBJECT_LIST", "client_type"],
    () => {
      return constructorObjectService.getListV2("client_type", {
        data: {},
      });
    },
    {
      select: (res) => {
        return (
          res?.data?.response.map((item) => ({
            label: item?.name,
            value: item?.guid,
          })) ?? []
        );
      },
    }
  );

  //===============   GET ROLE GET LIST
  const { data: getRoleList } = useQuery(
    ["GET_OBJECT_LIST", client_type],
    () => {
      return constructorObjectService.getListV2("role", {
        data: {
          client_type_id: client_type,
        },
      });
    },
    {
      enable: !client_type,
      select: (res) => {
        return (
          res?.data?.response.map((item) => ({
            label: item?.name,
            value: item?.guid,
          })) ?? []
        );
      },
    }
  );

  // =============  GET PERMISSIONS WITH ROLE AND SLUG
  const { data: getTablePermission } = useQuery(
    ["GET_TABLE_PERMISSONS", role_id],
    () => {
      return tablePermissionService.getList(params);
    },
    {
      enable: !params,
      select: (res) => res ?? {},
    }
  );

  // ========== COMPUTE USER PERMISSION ACCORDING TO TYPE
  const getUserPermission = useMemo(() => {
    if (getTablePermission?.selected_user_permission) {
      return getTablePermission?.selected_user_permission;
    } else {
      return {
        ...getTablePermission?.current_user_permission,
        current_user_permission: true,
      };
    }
  }, [getTablePermission]);

  // ========== COMPUTE TABLES OPTIONS
  const tablesList = useMemo(() => {
    let getObjects = [];
    getObjects = listToOptions(tables, "label", "slug");
    return getObjects;
  }, [tables]);

  // =========== COMPUTE CHOSEN TABLEID
  const tableId = useMemo(() => {
    if (slug) {
      return tables.find((item) => item?.slug === slug);
    } else {
      return tables.find((item) => item?.slug === tableSlug);
    }
  }, [slug, tableSlug, tables]);

  const onSubmit = (values) => {
    tablePermissionService.update(values).then(() => {
      handleClose();
    });
  };

  return (
    <div className={styles.shareContent}>
      <div className={styles.shareHeader}>
        <h2>Доступы</h2>
        <Button onClick={handleClose}>
          <ClearIcon style={{ color: "#000" }} />
        </Button>
      </div>

      <div className={styles.shareContentBody}>
        <ShareModalItems
          control={control}
          tablesList={tablesList}
          clientTypeList={clientTypeList}
          getRoleList={getRoleList}
          getUserPermission={getUserPermission}
          getTablePermission={getTablePermission}
          watch={watch}
          reset={reset}
          tableId={tableId}
          setValue={setValue}
        />
      </div>
      <div className={styles.shareFooter}>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Apply
        </Button>
        <Button color="error" onClick={handleClose}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default ShareContent;
