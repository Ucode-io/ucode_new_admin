import { Avatar, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import {
  useDeleteUserDocumentMutation,
  useUpdateUserDocumentMutation,
} from "../../../../../../services/templateNoteShareService";
import { Select } from "@mui/material";
import RectangleIconButton from "../../../../../Buttons/RectangleIconButton";

const UserRow = ({ user }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const { projectId } = useParams();
  const queryClient = useQueryClient();

  const { mutate: deleteUserDocument } = useDeleteUserDocumentMutation({
    onSuccess: (res) => {
      queryClient.refetchQueries(["USER_LIST_DOCUMENT"]);
    },
  });

  const { mutate: updateUserDocument } = useUpdateUserDocumentMutation({
    onSuccess: (res) => {
      queryClient.refetchQueries(["USER_LIST_DOCUMENT"]);
    },
  });

  const roles = [
    {
      value: "OWNER",
      label: "owner",
    },
    {
      value: "VIEWER",
      label: "viewer",
    },
    {
      value: "EDITOR",
      label: "editor",
    },
  ];

  const changeRole = (val) => {
    setSelectedRole(val);
    updateUserDocument({
      ...user,
      role: val,
      project_id: projectId,
    });
  };

  return (
    <Box display={"flex"} mt={"10px"} justifyContent={"space-between"}>
      <Box
        display={"flex"}
        alignItems={"center"}
        width="200px"
        overflow="hidden"
      >
        <Avatar name={user.username} src={user.photo} />

        <Box ml={"10px"}>
          <Text fontSize="xl" fontWeight={"600"} color={"#000"}>
            {user.username}
          </Text>
          <Text opacity={"0.5"} color={"#000"}>
            {user.email}
          </Text>
        </Box>
      </Box>

      <Box width="70px" color="#000">
        <Select
          options={roles}
          value={selectedRole}
          onChange={(val) => {
            changeRole(val);
          }}
          label={"Roles"}
        />
      </Box>

      <Box>
        <RectangleIconButton
          color="error"
          type="delete"
          onClick={() =>
            deleteUserDocument({
              projectId,
              permissionId: user.id,
            })
          }
        />
      </Box>
    </Box>
  );
};

export default UserRow;
