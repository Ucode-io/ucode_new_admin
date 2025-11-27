import { Box, Icon } from "@mui/material";
import style from "./index.module.scss";

const center = {
  display: "flex",
  alighItems: "center",
  justifyContent: "center",
};

const IconCard = ({
  icon,
  title = "",
  color = "#007AFF",
  noTitle = false,
  iconStyle,
  ...rest
}) => {
  return (
    <Box style={center} className={style.icon_header} {...rest}>
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

export default IconCard;
