import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Box, Button, Collapse, Icon, Typography } from "@mui/material";

const RecursiveRow = ({
  element,
  level = 1,
  selectedElement,
  onSelect,
  hasNestedLevel,
  onRowClick,
}) => {
  const [childBlockVisible, setChildBlockVisible] = useState(false);

  const clickHandler = () => {
    onRowClick(element.id, element);
    setChildBlockVisible((prev) => !prev);
    if (!element.children) onSelect(element.id, element);
  };

  return (
    <Box position="relative">
      <Box
        className={`${styles.row} ${
          selectedElement === element.id ? styles.active : ""
        }  ${level === 1 ? styles.main : ""}`}
        pl={`${level * 12}px`}
        onClick={clickHandler}
        {...element.rowProps}
      >
        {element.icon && (
          <Icon
            as={element.icon}
            w={5}
            h={5}
            className={styles.icon}
            color="primary"
            {...element.iconProps}
          />
        )}
        <Typography
          className={styles.title}
          noOfLines={element.isTruncated ? 1 : null}
        >
          {element.title}
        </Typography>

        <div className={styles.btnBlock}>{element.buttons}</div>

        {(element.children || element.hasChild) && (
          <Button
            variant="outlined"
            isOpen={childBlockVisible}
            minWidth={6}
            width={6}
            color="#fff"
          />
        )}
      </Box>
      <Collapse in={childBlockVisible} unmountOnExit>
        {element.children?.map((childElement, index) => (
          <RecursiveRow
            key={index}
            element={childElement}
            level={level + 1}
            selectedElement={selectedElement}
            onSelect={onSelect}
            hasNestedLevel={hasNestedLevel}
            onRowClick={onRowClick}
          />
        ))}
      </Collapse>
      {level === 1 && <Box className={styles.divider} />}
    </Box>
  );
};

export default RecursiveRow;
