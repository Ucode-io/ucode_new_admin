import {Box} from "@mui/material";
import {useSelector} from "react-redux";
import MinioSinglePageHeader from "./MinioSInglePageHeader";
import style from "./style.module.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {
  useFileDeleteMutation,
  useFileGetByIdQuery,
  useFileUpdateMutation,
} from "../../../../../../services/fileService";
import {useForm} from "react-hook-form";
import MinioForm from "./MinioForm";
import {store} from "../../../../../../store";
import {showAlert} from "../../../../../../store/alert/alert.thunk";
import {useQueryClient} from "react-query";
import DescriptionIcon from "@mui/icons-material/Description";
import {useEffect, useState} from "react";
import menuService from "../../../../../../services/menuService";
const cdnURL = import.meta.env.VITE_CDN_BASE_URL;

const MinioSinglePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const {fileId} = useParams();
  const {control, watch, reset, getValues} = useForm({});

  const {mutate: updateFile, isLoading: updateLoading} = useFileUpdateMutation({
    onSuccess: () => {
      queryClient.refetchQueries(["MINIO_OBJECT"]);
      store.dispatch(showAlert("Успешно", "success"));
      navigate(-1);
    },
  });

  const {mutate: deleteFile, isLoading: deleteLoading} = useFileDeleteMutation({
    onSuccess: () => {
      store.dispatch(showAlert("Успешно", "success"));
      queryClient.refetchQueries(["MINIO_OBJECT"]);
      navigate(-1);
    },
  });

  const deleteFileElements = (id) => {
    deleteFile(id);
  };

  const onSubmit = (data) => {
    updateFile({...getValues(), id: file?.id});
  };

  const {data: file, isLoading} = useFileGetByIdQuery({
    fileId,
    queryParams: {
      enabled: Boolean(fileId),
      onSuccess: (res) => {
        reset(res);
      },
    },
  });

  const url = `${cdnURL}${watch("link")}`;

  const parts = file?.file_name_download?.split(".") || ".";
  const extension = parts[parts?.length - 1]?.toUpperCase();

  return (
    <>
      <Box className={style.minio}>
        <MinioSinglePageHeader
          menuItem={menuItem}
          file={file}
          onSubmit={onSubmit}
          deleteFileElements={deleteFileElements}
        />

        {extension === "PNG" || extension === "JPEG" || extension === "JPG" ? (
          <Box className={style.image}>
            <img alt="sorry" src={url} />
          </Box>
        ) : (
          <Box className={style.file}>
            <DescriptionIcon />
          </Box>
        )}
        <MinioForm control={control} file={file} />
      </Box>
    </>
  );
};

export default MinioSinglePage;
