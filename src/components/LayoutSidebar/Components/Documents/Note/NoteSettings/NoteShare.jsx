import { useForm } from "react-hook-form";
import { BsLock, BsUnlock } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useUsersListQuery } from "../../../../../../services/userService";
import {
  useCreateShareDocumentMutation,
  useCreateUserDocumentMutation,
  useUpdateShareDocumentMutation,
  useUserListDocumentQuery,
} from "../../../../../../services/templateNoteShareService";
import { Box, Button, Switch, Typography } from "@mui/material";
import {
  SidebarBody,
  SidebarHeader,
  SidebarTitle,
} from "../../Components/Sidebar-old";
import ShareSearchInput from "../../Components/Select/ShareSearchInput";
import HFSelect from "../../../../../FormElements/HFSelect";
import UserRow from "./UserRow";

const NoteShare = () => {
  const form = useForm();
  const queryClient = useQueryClient();
  const { projectId, templateId, noteId } = useParams();
  const [isPrivate, setIsPrivate] = useState(false);
  let selectedUser = form.watch("search");
  let selectedRole = form.watch("role");
  let selectedShareType = form.watch("access");
  const [tokenToShare, setTokenToShare] = useState({});
  const [urlToCopy, setUrlToCopy] = useState("https://awdawdawdawdaw.uz");
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

  const { data: users = [] } = useUsersListQuery({
    params: {
      "project-id": projectId,
    },
    queryParams: {
      select: (res) =>
        res.users.map((user) => ({
          ...user,
          value: user.id,
          label: `${user.name ?? ""} ${user.email}`,
        })),
    },
  });

  const { data: userWithAccess = [] } = useUserListDocumentQuery({
    params: {
      "project-id": projectId,
      "object-id": templateId ?? noteId,
    },
    queryParams: {
      select: (res) => res.users,
      enabled: Boolean(noteId ?? templateId),
    },
  });

  const { mutate: createUserDocument } = useCreateUserDocumentMutation({
    onSuccess: (res) => {
      queryClient.refetchQueries(["USER_LIST_DOCUMENT"]);
    },
  });

  const { mutate: updateUserDocument } = useUpdateShareDocumentMutation({
    onSuccess: (res) => {
      queryClient.refetchQueries(["USER_LIST_DOCUMENT"]);
      setTokenToShare(res.token);
      setIsPrivate(res.is_private);
    },
  });

  const { data: createdShareDocument = {} } = useCreateShareDocumentMutation({
    params: {
      "project-id": projectId,
    },
    data: {
      object_id: templateId ?? noteId,
      project_id: projectId,
      role: "VIEWER",
      type: templateId ? "TEMPLATE" : "NOTE",
    },
    queryParams: {
      onSuccess: (res) => {
        setTokenToShare(res.token);
        setIsPrivate(res.is_private);
        form.setValue("access", res.role);
      },
      enabled: Boolean(noteId ?? templateId),
    },
  });

  useEffect(() => {
    setUrlToCopy(
      `${window.location.origin}/project/${projectId}/docs/view/${
        templateId ? "templates" : "notes"
      }?token=${tokenToShare}`
    );
  }, [tokenToShare]);

  return (
    <Box>
      <SidebarHeader>
        <SidebarTitle>Note Share</SidebarTitle>
      </SidebarHeader>

      <SidebarBody height="calc(100vh - 100px)" px={2}>
        <Box display="flex" width="100%" gap="5px">
          <Box width="70%">
            <HFSelect
              control={form.control}
              name={"search"}
              placeholder="Invite by name or e-mail"
              options={users}
              fullwidth
            />
          </Box>
          <Box width="30%">
            <HFSelect
              control={form.control}
              name={`role`}
              placeholder="Role"
              options={roles}
              fullwidth
            />
          </Box>
        </Box>

        <Box mt={"24px"}>
          <Typography mb="10px" color={"#000"}>
            Users with access
          </Typography>
          {userWithAccess?.map((user) => (
            <UserRow user={user} />
          ))}
        </Box>

        <Box mt={"24px"}>
          <Box display="flex" justifyContent="space-between" mb="10px">
            <Typography color={"#000"} display={"flex"} alignItems={"center"}>
              Public link
            </Typography>

            <Box ml="10px" display="flex" alignItems="center">
              {isPrivate ? (
                <BsLock color={"#000"} size={"24px"} />
              ) : (
                <BsUnlock color={"#000"} size={"24px"} />
              )}
              <Switch
                size="lg"
                ml="8px"
                isChecked={isPrivate}
                onChange={(e) => {
                  setIsPrivate(e.target.checked);
                  updateUserDocument({
                    is_private: isPrivate,
                    object_id: templateId ?? noteId,
                    project_id: projectId,
                    role: selectedShareType,
                    type: templateId ? "TEMPLATE" : "NOTE",
                  });
                }}
              />
            </Box>
          </Box>

          <Box
            display={"flex"}
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="column"
          >
            <Box color="#000" width="100%">
              <HFSelect
                control={form.control}
                name={"access"}
                options={[
                  { value: "EDITOR", label: "EDITOR" },
                  { value: "VIEWER", label: "VIEWER" },
                ]}
                label={"Access"}
              />
            </Box>
          </Box>
        </Box>

        <Box display={"flex"} justifyContent={"flex-end"} mt={"32px"}>
          <Button
            variant="contained"
            onClick={() => {
              createUserDocument({
                params: {
                  "project-id": projectId,
                },
                data: {
                  email: users.find((item) => item.id === selectedUser).email,
                  is_deleted: false,
                  object_id: templateId ?? noteId,
                  role: selectedRole,
                  photo_url: "string",
                  project_id: projectId,
                  type: templateId ? "TEMPLATE" : "NOTE",
                  user_id: selectedUser,
                  username: users.find((item) => item.id === selectedUser).name,
                },
              });
            }}
          >
            Share
          </Button>
        </Box>
      </SidebarBody>
    </Box>
  );
};

export default NoteShare;
