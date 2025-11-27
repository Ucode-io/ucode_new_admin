import { useMutation, useQuery } from "react-query";
import requestAuth from "../utils/requestAuthV2";

const rolePermissionService = {
  getById: (projectId, roleId) =>
    requestAuth.get(`/role-permission/detailed/${projectId}/${roleId}`),
  update: (data) => requestAuth.put("/role-permission/detailed", data),
  getMenuPermissionById: (projectId, roleId, parentId) =>
    requestAuth.get(
      `/menu-permission/detailed/${projectId}/${roleId}/${parentId}`
    ),
  updateMenuPermission: (data) =>
    requestAuth.put(`/menu-permission/detailed`, data),
};

export const useMenuPermissionGetByIdQuery = ({
  projectId,
  roleId,
  parentId,
  queryParams,
}) => {
  return useQuery(
    ["GET_MENU_PERMISION_BY_ID", { projectId, roleId, parentId }],
    () => {
      return rolePermissionService.getMenuPermissionById(
        projectId,
        roleId,
        parentId
      );
    },
    queryParams
  );
};

export const useRolePermissionGetByIdQuery = ({
  projectId,
  roleId,
  queryParams,
}) => {
  return useQuery(
    ["GET_ROLE_PERMISION_BY_ID", { projectId, roleId }],
    () => {
      return rolePermissionService.getById(projectId, roleId);
    },
    queryParams
  );
};

export const useRolePermissionUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => rolePermissionService.update(data),
    mutationSettings
  );
};

export const useMenuPermissionUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => rolePermissionService.updateMenuPermission(data),
    mutationSettings
  );
};
