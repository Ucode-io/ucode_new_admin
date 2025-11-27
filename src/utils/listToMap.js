export const listToMap = (list = [], fieldName = "id") => {
  const map = {};

  list?.forEach((item) => {
    if (item?.type === "LOOKUP" || item?.type === "LOOKUPS") {
      map[item["relation_id"]] = item;
    } else {
      map[item[fieldName]] = item;
    }
  });

  return map;
};

export const listToMapForCalendar = (list = [], fieldName = "id") => {
  const map = {};

  list?.forEach((item) => {
    map[item[fieldName]] = item;
  });

  return map;
};
