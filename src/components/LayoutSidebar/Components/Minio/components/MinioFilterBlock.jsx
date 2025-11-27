import { Box, Tooltip, Typography } from "@mui/material";
import style from "../style.module.scss";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SortIcon from "@mui/icons-material/Sort";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { SizeType, onSizeChange } from "./FileType";

const MinioFilterBlock = ({
  selectAllCards,
  selectedCards,
  removeCards,
  setSort,
  sort,
  setSize,
  size,
}) => {
  return (
    <>
      <Box className={style.filterblock}>
        <Box className={style.block}>
          <Box className={style.select}>
            {selectedCards?.length ? (
              <Typography
                variant="h5"
                className={style.title}
                onClick={removeCards}
              >
                <HighlightOffIcon /> {selectedCards?.length} Items Selected
              </Typography>
            ) : (
              <Typography
                variant="h5"
                className={style.title}
                onClick={selectAllCards}
              >
                <CheckCircleOutlineIcon /> Select All
              </Typography>
            )}
          </Box>
          <Box className={style.filter}>
            <Tooltip title="Card size">
              <Box onClick={() => onSizeChange(size, setSize, style)}>
                <SizeType item={size} />
              </Box>
            </Tooltip>
            <Tooltip title="Sort description">
              {sort === "asc" ? (
                <SortIcon onClick={() => setSort("desc")} />
              ) : (
                <SortIcon onClick={() => setSort("asc")} />
              )}
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MinioFilterBlock;
