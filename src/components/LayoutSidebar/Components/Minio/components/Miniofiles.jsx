import { Box, Tooltip, Typography } from "@mui/material";
import style from "../style.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import DescriptionIcon from "@mui/icons-material/Description";
import FileTypes from "./FileType";
import { useLocation, useNavigate } from "react-router-dom";
const cdnURL = import.meta.env.VITE_CDN_BASE_URL;

const Card = ({ item, selected, onSelect, handleNavigate }) => {
  const url = `${cdnURL}${item?.link}`;
  const parts = item?.file_name_download?.split(".") || ".";
  const extension = parts[parts?.length - 1]?.toUpperCase();
  const size = item?.file_size / 1048576;

  console.log("extension", extension);
  return (
    <Box
      className={style.card}
      key={item?.id}
      onClick={() => handleNavigate(item)}
    >
      <span
        className={`${selected ? style.checked : style.unchecked}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item);
        }}
      >
        {selected && <CheckIcon />}
      </span>
      <Box className={`${style.file} ${selected && style.dop}`}>
        {extension === "PNG" || extension === "JPEG" || extension === "JPG" ? (
          <img alt="sorry" src={url} className={style.img} />
        ) : (
          <DescriptionIcon />
        )}
      </Box>
      <Typography className={style.title} variant="h6">
        <Tooltip title={item?.title}>{item?.title}</Tooltip>
      </Typography>
      <Typography variant="h6" className={style.text}>
        <FileTypes item={extension.toUpperCase()} />
        {" • "}
        <Tooltip title={`${Math.round(size * 100) / 100} MB`}>
          {Math.round(size * 100) / 100}
        </Tooltip>
      </Typography>
    </Box>
  );
};

const MinioFiles = ({ minios, setSelectedCards, selectedCards, size }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSelectCard = (item) => {
    if (selectedCards?.includes(item)) {
      setSelectedCards(selectedCards?.filter((card) => card !== item));
    } else {
      setSelectedCards([...selectedCards, item]);
    }
  };

  const handleNavigate = (item) => {
    navigate(`${location.pathname}/${item?.id}`);
  };

  return (
    <>
      <Box className={size}>
        {minios?.files?.map((item) => (
          <Card
            key={item}
            item={item}
            selected={selectedCards?.includes(item)}
            onSelect={toggleSelectCard}
            handleNavigate={handleNavigate}
          />
        ))}
      </Box>
    </>
  );
};

export default MinioFiles;
