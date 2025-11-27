export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;

  if (removedIndex === null && addedIndex === null) return null;
  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, { ...itemToAdd, index: addedIndex + 1 });
  }
  return result;
};

export const applyDragIndex = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;

  if (removedIndex === null && addedIndex === null) return null;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return addedIndex;
};
