import { Box, Icon, Tooltip } from "@mui/material";
import styles from "./index.module.scss";

const center = {
  display: "flex",
  alighItems: "center",
  justifyContent: "center",
};

const ButtonTabs = ({ tabs, onSelect, selectedTabIndex, ...props }) => {
  return (
    <Box style={center} className={styles.container} {...props}>
      {tabs?.map((tab, index) => (
        <Tooltip key={tab.id} label={tab.title}>
          <Box
            onClick={() => onSelect(index, tab)}
            key={tab.id}
            className={`${styles.tab} ${
              selectedTabIndex === index ? styles.active : ""
            }`}
          >
            <Icon as={tab.icon} w={"20px"} h={"20px"} />
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
};

export default ButtonTabs;
