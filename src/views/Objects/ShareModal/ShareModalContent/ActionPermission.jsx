import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../styles.module.scss";
import { useWatch } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import HFCheckbox from "../../../../components/FormElements/HFCheckbox";

function ActionPermission({
  control,
  getUserPermission,
  getTablePermission,
  actionPermissions,
}) {
  const [isCollapsedCon, setIsCollapsedCon] = useState(false);
  const [isActionPermissionsMatched, setIsActionPermissionsMatched] =
    useState(false);
  const grantAccess =
    getTablePermission?.current_user_permission?.grant_access || false;

  const handleCollapseConToggle = () => {
    setIsCollapsedCon(!isCollapsedCon);
  };

  useEffect(() => {
    if (
      grantAccess &&
      actionPermissions &&
      getUserPermission?.table?.field_permissions
    ) {
      const viewPermissionsMatched = actionPermissions.map((item, index) => {
        const permissionsInGetTable =
          getTablePermission?.current_user_permission?.table.action_permissions[
            index
          ];
        return permissionsInGetTable?.permission;
      });

      setIsActionPermissionsMatched(viewPermissionsMatched);
    }
  }, [actionPermissions, getTablePermission]);

  return (
    <div className={styles.collapseCon}>
      {actionPermissions?.map((item, index) => (
        <Box>
          <div className={styles.permissionList}>
            <h2 className={styles.permissionListTitle}>{item?.label}</h2>

            <div className={styles.permissionListContent}>
              <div className={styles.permissionListItem}>
                <HFCheckbox
                  control={control}
                  name={`table.action_permissions.${index}.permission`}
                  disabled={
                    isActionPermissionsMatched?.[index] ||
                    getUserPermission?.current_user_permission
                  }
                />
                <div>Viewer</div>
              </div>
            </div>
          </div>
        </Box>
      ))}
    </div>
  );
}

export default ActionPermission;
