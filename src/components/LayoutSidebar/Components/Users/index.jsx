import { Box } from "@mui/material";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import RecursiveBlock from "../../SidebarRecursiveBlock/RecursiveBlockComponent";
import "../../style.scss";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const userFolder = {
  label: "Users",
  type: "USER_FOLDER",
  icon: "users.svg",
  parent_id: "a8de4296-c8c3-48d6-bef0-ee17057733d6",
  id: "13",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const Users = ({
  level = 1,
  menuStyle,
  menuItem,
  setElement,
  handleOpenNotify,
  child,
  selectedApp,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleGetClientType = (e) => {
    e.stopPropagation();
    queryClient.refetchQueries("GET_CLIENT_TYPE_LIST");
    dispatch(menuActions.setMenuItem(userFolder));
  };

  return (
    <Box sx={{ margin: "0 5px" }}>
      {child?.map((childElement) => (
        <RecursiveBlock
          onClick={() => {
            handleGetClientType();
          }}
          key={childElement.id}
          level={1}
          element={childElement}
          menuStyle={menuStyle}
          menuItem={menuItem}
          setElement={setElement}
          handleOpenNotify={handleOpenNotify}
          selectedApp={selectedApp}
          userType={true}
        />
      ))}
    </Box>
  );
};

export default Users;
