import { Box } from "@mui/material";
import styles from "./index.module.scss";

const ColorCircle = ({ color, ...props }) => {
  return (
    <Box
      className={styles.circle}
      bgcolor={"#53973b !important" ?? "#fff"}
      borderColor={color}
      {...props}
    />
  );
};

export default ColorCircle;
