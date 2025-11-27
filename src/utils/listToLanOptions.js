const listToLanOptions = (
  list,
  labelFieldName = "title",
  valueFieldName = "id",
  labelPrefix = ""
) => {
  return (
    list?.map((el) => ({
      value: valueFieldName !== "all" ? el[valueFieldName] : el,
      label: el?.attributes[`label_${labelPrefix}`],
    })) ?? []
  );
};

export default listToLanOptions;
