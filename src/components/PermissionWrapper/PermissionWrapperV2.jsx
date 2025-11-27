import {useMemo} from "react";
import {useSelector} from "react-redux";

const PermissionWrapperV2 = ({children, tableSlug, type}) => {
  const permissions = useSelector((state) => state.auth.permissions);
  const permissions2 = useSelector((state) => state?.permissions?.permissions);

  const role = useSelector((state) => state.auth.roleInfo);
  if (!tableSlug || role?.name === "DEFAULT ADMIN") return children;

  if (typeof type === "object") {
    if (
      permissions2?.[tableSlug]?.[type[0]] &&
      permissions2?.[tableSlug]?.[type[1]]
    )
      return children;

    return null;
  } else {
    if (permissions2?.[tableSlug]?.[type]) return children;
    return null;
  }
};

export default PermissionWrapperV2;
