import { Box } from "@mui/material";
import styles from "./index.module.scss";

export const Header = ({ children, ...props }) => {
  return (
    <Box className={styles.header} {...props}>
      {children}
    </Box>
  );
};

export const HeaderLeftSide = ({ children, ...props }) => {
  return (
    <Box className={styles.headerLeftSide} {...props}>
      {children}
    </Box>
  );
};

export const HeaderRightSide = ({ children, ...props }) => {
  return (
    <Box className={styles.headerRightSide} {...props}>
      {children}
    </Box>
  );
};

export const HeaderDivider = () => {
  return <div className={styles.border}></div>;
};

export const HeaderMiddleSide = ({ children, ...props }) => {
  return (
    <Box className={styles.headerMiddleSide} {...props}>
      {children}
    </Box>
  );
};

export const HeaderExtraSide = ({ children, ...props }) => {
  return (
    <Box className={styles.headerExtraSide} {...props}>
      {children}
    </Box>
  );
};

export default Header;
