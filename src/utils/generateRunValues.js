const runList = (list) => {
  const obj = {};
  list?.forEach((el) => {
    if (el.type === "String") {
      obj[el.key] = el.value;
    } else if (el.type === "Number") {
      obj[el.key] = parseInt(el.value);
    }
  });

  return obj;
};

export default runList;
