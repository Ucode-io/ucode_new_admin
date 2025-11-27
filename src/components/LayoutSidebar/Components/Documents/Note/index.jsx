import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useNoteByIdQuery, useNoteCreateMutation, useNoteUpdateMutation } from "../../../../../services/noteService";
import { store } from "../../../../../store";
import { useGetSingleObjectDocumentQuery } from "../../../../../services/templateNoteShareService";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button } from "@mui/material";
import Header, { HeaderLeftSide, HeaderRightSide } from "../../Header";
import HFTextField from "../../../../FormElements/HFTextField";
import EditorJs from "../Components/EditorJS";
import styles from "./style.module.scss";
import { folderIds } from "../../../SidebarRecursiveBlock/mock/folders";
import menuService from "../../../../../services/menuService";

const Note = () => {
  const form = useForm();
  const { projectId, noteId, folderId } = useParams();
  const company = store.getState().company;
  const [queryParams, setQueryParams] = useSearchParams();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

  useEffect(() => {
    if (searchParams.get("menuId")) {
      menuService
        .getByID({
          menuId: searchParams.get("menuId"),
        })
        .then((res) => {
          setMenuItem(res);
        });
    }
  }, []);

  const token = queryParams.get("token");

  const { isLoading } = useNoteByIdQuery({
    envId: company.environmentId,
    id: noteId,
    params: { "project-id": projectId },
    queryParams: {
      enabled: Boolean(noteId) || Boolean(token),
      onSuccess: form.reset,
      cacheTime: false,
    },
  });

  const { data: createdShareDocument = {}, isLoading: loadingFromTokenDoc } = useGetSingleObjectDocumentQuery({
    params: {
      "project-id": projectId,
    },
    data: {
      token: token,
    },
    queryParams: {
      onSuccess: (res) =>
        res.data
          ? form.reset({
              json: res.data.json,
              title: res.data.title,
            })
          : null,
      enabled: Boolean(token),
    },
  });

  useEffect(() => {
    if (!Boolean(noteId)) {
      form.reset({
        folderId: folderId,
        commit_id: "",
        json: {},
        project_id: projectId,
        title: "NEW NOTE",
        tables: [],
      });
    }
  }, [noteId]);

  const { mutate: updateNote } = useNoteUpdateMutation({
    onSuccess: (res) => {
      dispatch(showAlert("Success", "success"));
      queryClient.refetchQueries(["MENU"], folderIds.wiki_id);
      navigate("/main/744d63e6-0ab7-4f16-a588-d9129cf959d1");
    },
  });

  const { mutate: createNote } = useNoteCreateMutation({
    onSuccess: (res) => {
      queryClient.refetchQueries(["MENU"], folderIds.wiki_id);
      navigate("/main/744d63e6-0ab7-4f16-a588-d9129cf959d1");
    },
  });

  const onSubmit = (values) => {
    if (!!values.id) {
      updateNote({
        ...values,
        parent_id: menuItem?.id,
        is_visible: true,
      });
    } else {
      createNote({
        ...values,
        project_id: projectId,
        folder_id: folderId,
        parent_id: menuItem?.id,
        is_visible: true,
      });
    }
  };

  return (
    <FormProvider {...form}>
      <Box
        backgroundColor="white"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Header border="none">
          <HeaderLeftSide flex={1}>
            <HFTextField control={form.control} name="title" className={styles.input} />
          </HeaderLeftSide>
        </Header>

        <EditorJs control={form.control} name={"json"} isLoading={isLoading} loadingFromTokenDoc={loadingFromTokenDoc} />
        <Header border="none">
          <HeaderRightSide flex={1}>
            <Button variant="contained" onClick={form.handleSubmit(onSubmit)}>
              Save
            </Button>
          </HeaderRightSide>
        </Header>
      </Box>
    </FormProvider>
  );
};

export default Note;
