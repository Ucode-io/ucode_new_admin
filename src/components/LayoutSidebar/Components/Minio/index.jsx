import {Box} from "@mui/material";
import style from "./style.module.scss";
import {useSelector} from "react-redux";
import MinioHeader from "./components/MinioHeader";
import MinioFilterBlock from "./components/MinioFilterBlock";
import {useMinioObjectListQuery} from "../../../../services/fileService";
import FileUploadModal from "./components/FileUploadModal";
import {useEffect, useState} from "react";
import MinioFiles from "./components/Miniofiles";
import {store} from "../../../../store";
import {useSearchParams} from "react-router-dom";
import menuService from "../../../../services/menuService";

const MinioPage = () => {
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

  const [selectedCards, setSelectedCards] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [fileModalIsOpen, setFileModalIsOpen] = useState(null);
  const [size, setSize] = useState(style.miniocontainersmall);
  const [sort, setSort] = useState("asc");
  const company = store.getState().company;

  const {data: minios, isLoading} = useMinioObjectListQuery({
    params: {
      folder_name: menuItem?.attributes?.path,
      // sort: sort,
      project_id: company.projectId,
    },
    queryParams: {
      onSuccess: (res) => {},
    },
  });

  const openModal = () => {
    setFileModalIsOpen(true);
  };

  const closeModal = () => {
    setFileModalIsOpen(null);
  };

  const removeCards = (title) => {
    setSelectedCards([]);
  };

  const selectAllCards = () => {
    if (!selectAll) {
      setSelectedCards(minios?.objects);
    } else {
      setSelectedCards([]);
    }
    setSelectAll(!selectAll);
  };

  return (
    <>
      <Box className={style.minio}>
        <MinioHeader
          menuItem={menuItem}
          openModal={openModal}
          minios={minios}
          selectedCards={selectedCards}
        />

        <MinioFilterBlock
          menuItem={menuItem}
          selectAllCards={selectAllCards}
          selectedCards={selectedCards}
          removeCards={removeCards}
          setSort={setSort}
          sort={sort}
          setSize={setSize}
          size={size}
        />
        <MinioFiles
          minios={minios}
          setSelectedCards={setSelectedCards}
          selectedCards={selectedCards}
          size={size}
        />
      </Box>

      {fileModalIsOpen && (
        <FileUploadModal closeModal={closeModal} menuItem={menuItem} />
      )}
    </>
  );
};

export default MinioPage;
