export function customSortArray(a, b) {
  const commonItems = a?.filter((item) => b.includes(item));
  commonItems?.sort();
  const remainingItems = a?.filter((item) => !b.includes(item));
  const sortedArray = commonItems?.concat(remainingItems);
  return sortedArray;
}
