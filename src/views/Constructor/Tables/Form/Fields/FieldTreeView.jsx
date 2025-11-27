import "./style.module.scss";
import { useState } from "react";
import { useMenuListQuery } from "../../../../../services/menuService";
import { TreeItem } from "@mui/x-tree-view";

const FieldTreeView = ({ element, setCheck, check, folder }) => {
  const [child, setChild] = useState();

  const { isLoading } = useMenuListQuery({
    params: {
      parent_id: element?.id,
    },
    queryParams: {
      cacheTime: 10,
      enabled: Boolean(element?.id),
      onSuccess: (res) => {
        setChild(res?.menus);
        setCheck(false);
      },
    },
  });
  return (
    <TreeItem
      key={element?.id}
      nodeId={element?.attributes?.path}
      label={element?.label}
      sx={{
        "& .MuiTreeItem-content.Mui-selected": {
          background: "#007AFF",
          color: "#fff",
          padding: "8.5px 14px",
          "&:hover": {
            background: "#007AFF",
          },
        },
        "& .MuiTreeItem-content": {
          padding: "8.5px 14px",
        },
      }}
    >
      {child?.map((item) => (
        <FieldTreeView nodes={child} element={item} setCheck={setCheck} />
      ))}
    </TreeItem>
  );
};

export default FieldTreeView;
