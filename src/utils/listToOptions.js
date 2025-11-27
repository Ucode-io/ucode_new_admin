const listToOptions = (
  list,
  labelFieldName = "title",
  valueFieldName = "id",
  labelPrefix = ""
) => {
  return (
    list?.map((el) => ({
      value: valueFieldName !== "all" ? el[valueFieldName] : el,
      label: el[labelFieldName] + labelPrefix,
    })) ?? []
  );
};

export default listToOptions;
