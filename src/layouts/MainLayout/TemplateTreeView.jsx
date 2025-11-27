import { TreeItem } from "@mui/x-tree-view";
import "../../components/LayoutSidebar/style.scss";
import { useState } from "react";
import { Box, Checkbox } from "@mui/material";
import { useGlobalMenuTemplateListQuery } from "../../services/globalService";
import { updateTreeLevel } from "../../utils/treeLevel";

const flex = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const TemplateTreeView = ({
  element,
  setCheck,
  check,
  projectId,
  envId,
  setSelectedItems,
  level,
}) => {
  const [child, setChild] = useState();
  const [isChecked, setIsChecked] = useState(false);

  const menuItems = {
    attributes: element?.attributes || {},
    icon: element?.icon || "",
    label: element?.label || "",
    id: element?.id || "",
    parent_id: element?.parent_id || "",
    table_id: element?.table_id || "",
    type: element?.type || "",
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);

    if (!isChecked) {
      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        menuItems,
      ]);
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item.id !== element.id)
      );
    }
  };
  const { isLoading } = useGlobalMenuTemplateListQuery({
    params: {
      "project-id": projectId?.project_id,
      "environment-id": envId?.id,
      parent_id: element.id,
    },
    queryParams: {
      onSuccess: (res) => {
        setChild(res?.menus);
        setCheck(false);
      },
    },
  });
  return (
    <TreeItem
      key={element?.id}
      nodeId={element?.id}
      sx={{
        "& .MuiTreeItem-content.Mui-selected": {
          background: "none !important",
          color: "#000",
        },
        "& .MuiTreeItem-content": {
          background: "none !important",
          color: "#000",
          padding: "10px",
          paddingLeft: updateTreeLevel(level),
        },
        "& .MuiTreeItem-label": {
          fontSize: "14px",
          fontWeight: "600",
        },
      }}
      ContentProps={{
        onClick: () => {},
      }}
      label={
        <Box style={flex}>
          <p>{element?.label}</p>
          <Checkbox
            onClick={(e) => {
              e.stopPropagation();
            }}
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </Box>
      }
    >
      {child?.map((item) => (
        <TemplateTreeView
          element={item}
          setCheck={setCheck}
          check={check}
          projectId={projectId}
          envId={envId}
          setSelectedItems={setSelectedItems}
          level={level + 1}
        />
      ))}
    </TreeItem>
  );
};

export default TemplateTreeView;
