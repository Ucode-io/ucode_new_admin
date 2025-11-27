import style from "./index.module.scss";
import { Box, Icon } from "@mui/material";
const center = {
  display: "flex",
  alighItems: "center",
  justifyContent: "center",
};

const DefaultNodeCard = ({
  icon,
  title = "",
  color = "#007AFF",
  noTitle = false,
  iconStyle,
  ...rest
}) => {
  return (
    <Box style={center} className={style.default_node} {...rest}>
      <Icon
        style={iconStyle}
        as={icon}
        w={noTitle ? 10 : 8}
        h={noTitle ? 10 : 8}
        className={style.icon}
      />
      {title && <div className={style.icon_title}> {title} </div>}
    </Box>
  );
};

export default DefaultNodeCard;
