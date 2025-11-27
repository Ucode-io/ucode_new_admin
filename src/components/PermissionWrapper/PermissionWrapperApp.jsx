import { useSelector } from "react-redux";

const PermissionWrapperApp = ({ children, permission = "" }) => {
  if (!permission) return null;

  return children;
};

export default PermissionWrapperApp;
