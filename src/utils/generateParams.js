const listToObject = (list, keySlug = "slug", valueSlug = "title") => {
  const obj = {};

  list?.forEach((el) => {
    if (el.type === "Raw JSON input") {
      obj[el[keySlug]] = JSON.parse(el.title);
    } else if (el.type === "Number") {
      obj[el[keySlug]] = parseInt(el[valueSlug]);
    } else {
      obj[el[keySlug]] = el[valueSlug];
    }
  });

  return obj;
};

export default listToObject;
