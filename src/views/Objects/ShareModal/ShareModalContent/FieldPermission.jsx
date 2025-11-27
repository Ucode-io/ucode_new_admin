import { Box, Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../styles.module.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useWatch } from "react-hook-form";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import HFCheckbox from "../../../../components/FormElements/HFCheckbox";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadCell,
  CTableHeadRow,
  CTableRow,
} from "../../../../components/CTable";
import TableCard from "../../../../components/TableCard";
import FormCheckbox from "../../../Permissions/Roles/Detail/Permissions/Components/Checkbox/FormCheckbox";

function FieldPermission({
  control,
  getUserPermission,
  getTablePermission,
  setValue,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isViewPermissionsMatched, setIsViewPermissionsMatched] = useState();
  const [isEditPermissionsMatched, setIsEditPermissionsMatched] = useState();
  const grantAccess =
    getTablePermission?.current_user_permission?.grant_access || false;
  const fieldPermissions = useWatch({
    control,
    name: "table.field_permissions",
  });

  useEffect(() => {
    if (
      grantAccess &&
      fieldPermissions &&
      getUserPermission?.table?.field_permissions
    ) {
      const viewPermissionsMatched = fieldPermissions.map((item, index) => {
        const permissionsInGetTable =
          getTablePermission?.current_user_permission?.table.field_permissions[
            index
          ];
        return permissionsInGetTable?.view_permission;
      });

      const editPermissionsMatched = fieldPermissions.map((item, index) => {
        const permissionsInGetTable =
          getTablePermission?.current_user_permission?.table.field_permissions[
            index
          ];
        return permissionsInGetTable?.edit_permission;
      });

      setIsViewPermissionsMatched(viewPermissionsMatched);
      setIsEditPermissionsMatched(editPermissionsMatched);
    }
  }, [fieldPermissions, getTablePermission]);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const updateView = (val) => {
    fieldPermissions.forEach((el, index) => {
      setValue(`table.field_permissions.${index}.view_permission`, val);
    });
  };

  const updateEdit = (val) => {
    fieldPermissions.forEach((el, index) => {
      setValue(`table.field_permissions.${index}.edit_permission`, val);
    });
  };

  const allViewTrue = fieldPermissions?.every(
    (permission) => permission.view_permission === true
  );

  const allEditTrue = fieldPermissions?.every(
    (permission) => permission.edit_permission === true
  );

  return (
    <div className={styles.collapse}>
      <Box>
        <TableCard>
          <CTable disablePagination={true} removableHeight={false}>
            <CTableHead>
              <CTableHeadRow>
                <CTableHeadCell>Name</CTableHeadCell>
                <CTableCell>
                  Viewer
                  <Checkbox
                    checked={allViewTrue ? true : false}
                    onChange={(e) => {
                      updateView(e.target.checked);
                    }}
                  />
                </CTableCell>
                <CTableCell>
                  Editor
                  <Checkbox
                    checked={allEditTrue ? true : false}
                    onChange={(e) => {
                      updateEdit(e.target.checked);
                    }}
                  />
                </CTableCell>
              </CTableHeadRow>
            </CTableHead>
            <CTableBody columnsCount={3}>
              {fieldPermissions?.map((item, index) => (
                <CTableRow>
                  <CTableCell>{item?.label}</CTableCell>
                  <CTableCell width={20}>
                    <Box sx={{ justifyContent: "center", display: "flex" }}>
                      <FormCheckbox
                        control={control}
                        name={`table.field_permissions.${index}.view_permission`}
                        disabled={
                          !isViewPermissionsMatched?.[index] ||
                          getUserPermission?.current_user_permission
                        }
                      />
                    </Box>
                  </CTableCell>
                  <CTableCell width={60}>
                    <Box sx={{ justifyContent: "center", display: "flex" }}>
                      <FormCheckbox
                        control={control}
                        name={`table.field_permissions.${index}.edit_permission`}
                        disabled={
                          !isEditPermissionsMatched?.[index] ||
                          getUserPermission?.current_user_permission
                        }
                      />
                    </Box>
                  </CTableCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </TableCard>
      </Box>
    </div>
  );
}

export default FieldPermission;
