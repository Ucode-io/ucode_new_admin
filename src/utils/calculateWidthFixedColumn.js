const calculateWidthFixedColumn = (colId, columns) => {
  const prevElementIndex = columns?.findIndex((item) => item.id === colId);

  if (prevElementIndex === -1 || prevElementIndex === 0) {
    return 0;
  }

  let totalWidth = 0;

  for (let i = 0; i < prevElementIndex; i++) {
    const element = document.querySelector(`[id='${columns?.[i].id}']`);
    totalWidth += element?.offsetWidth || 0;
  }

  return totalWidth;
};

export default calculateWidthFixedColumn;
