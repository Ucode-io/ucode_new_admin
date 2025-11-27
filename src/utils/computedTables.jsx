import { useMemo } from "react";
import { getResourceTypeIconID } from "./resourceConstants";
import AddIcon from "@mui/icons-material/Add";
import { RiPencilFill } from "react-icons/ri";

export default function useComputedResource(
  resource,
  sidebarElements,
  menuItem,
  menuStyle,
  createFolder,
  openEditDrawer
) {
  const computedResource = useMemo(
    () =>
      resource?.map((resource) => ({
        ...resource,
        name: resource.title,
        isTruncated: true,
        icon: getResourceTypeIconID(resource.resource_type),
        buttons: (
          <>
            <AddIcon
              size={13}
              onClick={(e) => {
                e?.stopPropagation();
                createFolder();
              }}
              style={{
                color:
                  menuItem?.id === resource?.id
                    ? menuStyle?.active_text
                    : menuStyle?.text || "",
              }}
            />
          </>
        ),
        type: "FOLDER",
        children: sidebarElements?.map((item) => ({
          ...item,
          children: item?.children?.map((el) => ({
            ...el,
            name: el.label,
            resourceId: resource.id,
            buttons: (
              <>
                <RiPencilFill
                  size={13}
                  onClick={(e) => {
                    e?.stopPropagation();
                    openEditDrawer(el?.id, resource?.id);
                  }}
                  style={{
                    color:
                      menuItem?.id === resource?.id
                        ? menuStyle?.active_text
                        : menuStyle?.text || "",
                  }}
                />
              </>
            ),
          })),
        })),
      })),
    [resource, sidebarElements]
  );
  return computedResource;
}
