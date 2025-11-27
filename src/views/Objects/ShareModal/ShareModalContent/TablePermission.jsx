import { Box } from "@mui/material";
import React from "react";
import HFCheckbox from "../../../../components/FormElements/HFCheckbox";
import styles from "../styles.module.scss";
import HFCheckboxRecord from "./HFCheckboxRecord";

function TablePermission({ control, getUserPermission, getTablePermission }) {
  const grantAccess =
    getTablePermission?.current_user_permission?.grant_access || false;
  const currentPermissions =
    getTablePermission?.current_user_permission.table?.record_permissions || {};

  const isCheckboxDisabled = (permissionName) => {
    if (
      getUserPermission?.current_user_permission ||
      currentPermissions[permissionName] === "No"
    ) {
      return true;
    } else if (grantAccess && currentPermissions[permissionName] === "Yes") {
      return false;
    }
  };

  return (
    <Box
      sx={{
        padding: "0px 15px 15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        // borderBottom: "1px solid #eee",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <div className={styles.checkBox}>
          <HFCheckboxRecord
            control={control}
            name="table.record_permissions.read"
            disabled={isCheckboxDisabled("read")}
          />
          <p>View</p>
        </div>
        <div className={styles.checkBox}>
          <HFCheckboxRecord
            control={control}
            name="table.record_permissions.write"
            disabled={isCheckboxDisabled("write")}
          />
          <p>Create</p>
        </div>
        <div className={styles.checkBox}>
          <HFCheckboxRecord
            control={control}
            name="table.record_permissions.update"
            disabled={isCheckboxDisabled("update")}
          />
          <p>Edit</p>
        </div>
        <div className={styles.checkBox}>
          <HFCheckboxRecord
            control={control}
            name="table.record_permissions.delete"
            disabled={isCheckboxDisabled("delete")}
          />
          <p>Cancel</p>
        </div>
        <div className={styles.checkBox}>
          <HFCheckbox
            control={control}
            name="table.record_permissions.is_public"
            disabled={isCheckboxDisabled("is_public")}
          />
          <p>Is public</p>
        </div>
      </Box>
    </Box>
  );
}

export default TablePermission;
