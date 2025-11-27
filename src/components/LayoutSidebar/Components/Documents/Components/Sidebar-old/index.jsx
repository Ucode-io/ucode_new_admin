import { Box } from "@mui/material";
import styles from "./index.module.scss";
import RecursiveRow from "./RecursiveRow";

const Sidebar = ({ children, ...props }) => {
  return (
    <Box className={styles.sidebar} {...props}>
      {children}
    </Box>
  );
};

export const RightSidebar = ({ children, ...props }) => {
  return (
    <Box className={styles.rightSidebar} {...props}>
      {children}
    </Box>
  );
};

export const SidebarHeader = ({ children, ...props }) => {
  return (
    <Box className={styles.header} {...props}>
      {children}
    </Box>
  );
};

export const SidebarTitle = ({ children, ...props }) => {
  return (
    <h3 className={styles.title} {...props}>
      {children}
    </h3>
  );
};

export const SidebarBody = ({ children, ...props }) => {
  return (
    <Box className={styles.body} height={`calc(100vh - 112px)`} {...props}>
      {children}
    </Box>
  );
};

export const SidebarNestedElements = ({
  elements = [],
  isLoading = false,
  selectedElement,
  onSelect = () => {},
  onRowClick = () => {},
  ...props
}) => {
  const hasNestedLevel = elements.some((element) => element.children);

  return (
    <Box {...props}>
      {elements.map((element, index) => (
        <RecursiveRow
          key={index}
          element={element}
          selectedElement={selectedElement}
          onSelect={onSelect}
          hasNestedLevel={hasNestedLevel}
          onRowClick={onRowClick}
        />
      ))}
    </Box>
  );
};

export default Sidebar;
