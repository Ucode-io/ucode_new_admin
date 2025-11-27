export const tableFolderListToNested = (
  list,
  { idSlug, parentIdSlug, undefinedChildren }
) => {
  if (!Array.isArray(list)) return [];
  return getChildrenRecursive(
    list,
    undefined,
    idSlug,
    parentIdSlug,
    undefinedChildren
  );
};

const getChildrenRecursive = (
  list,
  parentId,
  idSlug = "id",
  parentIdSlug = "parent_id",
  undefinedChildren = false
) => {
  const computedList = [];

  list?.forEach((el) => {
    if (el[parentIdSlug] !== parentId) return;

    computedList.push({
      ...el,
      children: getChildrenRecursive(
        list,
        el[idSlug],
        idSlug,
        parentIdSlug,
        undefinedChildren
      ),
    });
  });

  if (!computedList?.length && undefinedChildren) return null;

  return computedList;
};
