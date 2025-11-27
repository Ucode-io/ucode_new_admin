import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import styles from "../styles.module.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useWatch } from "react-hook-form";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import HFCheckbox from "../../../../components/FormElements/HFCheckbox";

function ConnectionPermission({
  control,
  getUserPermission,
  getTablePermission,
  viewPermissions,
}) {
  const [isCollapsedCon, setIsCollapsedCon] = useState(false);
  const [isViewPermission, setIsViewPermission] = useState(false);
  const [isCreatePermission, setIsCreatePermission] = useState(false);
  const [isEidtPermission, setIsEditPermission] = useState(false);
  const [isDeletePermission, setIsDeletePermission] = useState(false);
  const grantAccess =
    getTablePermission?.current_user_permission?.grant_access || false;

  useEffect(() => {
    if (
      grantAccess &&
      viewPermissions &&
      getUserPermission?.table?.field_permissions
    ) {
      const viewPermissionsMatched = viewPermissions.map((item, index) => {
        const permissionsInGetTable =
          getTablePermission?.current_user_permission?.table.view_permissions[
            index
          ];
        return permissionsInGetTable?.view_permission;
      });
      const editPermissionsMatched = viewPermissions.map((item, index) => {
        const permissionsInGetTable =
          getTablePermission?.current_user_permission?.table.view_permissions[
            index
          ];
        return permissionsInGetTable?.edit_permission;
      });
      const createPermissionsMatched = viewPermissions.map((item, index) => {
        const permissionsInGetTable =
          getTablePermission?.current_user_permission?.table.view_permissions[
            index
          ];
        return permissionsInGetTable?.create_permission;
      });
      const deletePermissionsMatched = viewPermissions.map((item, index) => {
        const permissionsInGetTable =
          getTablePermission?.current_user_permission?.table.view_permissions[
            index
          ];
        return permissionsInGetTable?.delete_permission;
      });

      setIsViewPermission(viewPermissionsMatched);
      setIsCreatePermission(createPermissionsMatched);
      setIsEditPermission(editPermissionsMatched);
      setIsDeletePermission(deletePermissionsMatched);
    }
  }, [viewPermissions, getTablePermission]);

  const handleCollapseConToggle = () => {
    setIsCollapsedCon(!isCollapsedCon);
  };

  return (
    <div className={styles.collapseCon}>
      {viewPermissions?.map((item, index) => (
        <Box>
          <div className={styles.permissionList}>
            <h2 className={styles.permissionListTitle}>{item?.label}</h2>

            <div className={styles.permissionListContentCon}>
              <div className={styles.permissionListItemCon}>
                <HFCheckbox
                  control={control}
                  name={`table.view_permissions.${index}.view_permission`}
                  disabled={
                    !isViewPermission?.[index] ||
                    getUserPermission?.current_user_permission
                  }
                />
                <div>Viewer</div>
              </div>
              <div className={styles.permissionListItemCon}>
                <HFCheckbox
                  control={control}
                  name={`table.view_permissions.${index}.create_permission`}
                  disabled={
                    !isCreatePermission?.[index] ||
                    getUserPermission?.current_user_permission
                  }
                />
                <div>Creator</div>
              </div>
              <div className={styles.permissionListItemCon}>
                <HFCheckbox
                  control={control}
                  name={`table.view_permissions.${index}.edit_permission`}
                  disabled={
                    !isEidtPermission?.[index] ||
                    getUserPermission?.current_user_permission
                  }
                />
                <div>Editor</div>
              </div>
              <div className={styles.permissionListItemCon}>
                <HFCheckbox
                  control={control}
                  name={`table.view_permissions.${index}.delete_permission`}
                  disabled={
                    !isDeletePermission?.[index] ||
                    getUserPermission?.current_user_permission
                  }
                />
                <div>Delete</div>
              </div>
            </div>
          </div>
        </Box>
      ))}
    </div>
  );
}

export default ConnectionPermission;
