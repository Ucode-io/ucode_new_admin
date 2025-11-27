import { useMemo } from "react";
import { useSelector } from "react-redux";
import { elements } from "./elements";
import { useParams } from "react-router-dom";

const useSidebarElements = () => {
  const { appId } = useParams();
  const constructorElements = useSelector(
    (state) => state.constructorTable?.applications?.tables
  );
  const permissions = useSelector((state) => state.auth.permissions);
  const role = useSelector((state) => state.auth.roleInfo);

  const computedElements = useMemo(() => {
    const computedConstructorElements =
      constructorElements
        ?.filter(
          (el) =>
            el?.is_visible &&
            (permissions?.[el.slug]?.["read"] || role?.name === "DEFAULT ADMIN")
        )
        ?.map((el) => ({
          ...el,
          title: el.label,
          parent_id: el.folder_id,
          isChild: true,
          path: `/main/${el?.parent_id}/object/${el?.slug}?menuId=${el?.id}`,
        })) ?? [];

    return [...(computedConstructorElements ?? []), ...(elements ?? [])];
  }, [constructorElements, permissions, appId, role]);

  return { elements: computedElements ?? [] };
};

export default useSidebarElements;
