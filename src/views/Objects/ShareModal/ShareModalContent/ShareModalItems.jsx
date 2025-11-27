import React, { useEffect } from "react";
import CommonPermission from "./CommonPermission";
import TablePermission from "./TablePermission";
import FieldPermission from "./FieldPermission";
import ConnectionPermission from "./ConnectionPermission";
import ActionPermission from "./ActionPermission";
import { useWatch } from "react-hook-form";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

function ShareModalItems({
  control,
  tablesList,
  clientTypeList,
  getRoleList,
  getUserPermission,
  getTablePermission,
  reset,
  watch,
  tableId,
  setValue,
}) {
  const data = watch();

  const slug = useWatch({
    control,
    name: "table.slug",
  });
  const viewPermissions = useWatch({
    control,
    name: "table.view_permissions",
  });

  const actionPermissions = useWatch({
    control,
    name: "table.action_permissions",
  });

  useEffect(() => {
    if (getUserPermission) {
      reset({
        ...data,
        grant_access: getUserPermission?.grant_access,
        table: {
          record_permissions: getUserPermission?.table?.record_permissions,
          field_permissions: getUserPermission?.table?.field_permissions,
          view_permissions: getUserPermission?.table?.view_permissions,
          action_permissions: getUserPermission?.table?.action_permissions,
          id: tableId?.id,
          slug,
        },
      });
    }
  }, [getUserPermission, reset]);

  return (
    <div>
      <Tabs frameBorder={0}>
        <TabList>
          <Tab>Основные</Tab>
          <Tab>Поля</Tab>
          {viewPermissions && <Tab>Связи</Tab>}
          {actionPermissions && <Tab>Действие (Actions)</Tab>}
        </TabList>
        <TabPanel bg={"#fff"} border={"1px solid #E5E9EB"}>
          <CommonPermission
            control={control}
            tablesList={tablesList}
            clientTypeList={clientTypeList}
            getRoleList={getRoleList}
          />
          <TablePermission
            control={control}
            getUserPermission={getUserPermission}
            getTablePermission={getTablePermission}
          />
        </TabPanel>
        <TabPanel bg={"#fff"} border={"1px solid #E5E9EB"}>
          <FieldPermission
            control={control}
            getUserPermission={getUserPermission}
            getTablePermission={getTablePermission}
            setValue={setValue}
          />
        </TabPanel>
        <TabPanel bg={"#fff"} border={"1px solid #E5E9EB"}>
          <ConnectionPermission
            control={control}
            getUserPermission={getUserPermission}
            getTablePermission={getTablePermission}
            viewPermissions={viewPermissions}
          />
        </TabPanel>
        <TabPanel bg={"#fff"} border={"1px solid #E5E9EB"}>
          <ActionPermission
            control={control}
            getUserPermission={getUserPermission}
            getTablePermission={getTablePermission}
            actionPermissions={actionPermissions}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default ShareModalItems;
