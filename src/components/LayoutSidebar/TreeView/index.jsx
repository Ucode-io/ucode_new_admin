import { TreeItem } from "@mui/x-tree-view";
import "../style.scss";
import { useState } from "react";
import { useMenuListQuery } from "../../../services/menuService";

const FolderTreeView = ({ element, setCheck, check, folder }) => {
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
    <>
      {element.type === "FOLDER" && (
        <TreeItem key={element?.id} nodeId={element?.id} label={element?.label}>
          {child?.map((item) => (
            <FolderTreeView nodes={child} element={item} setCheck={setCheck} />
          ))}
        </TreeItem>
      )}
    </>
  );
};

export default FolderTreeView;
