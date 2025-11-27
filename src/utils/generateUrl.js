const strFromObj = (list, url) => {
  var str = url;

  list?.forEach((el) => {
    str = str.replace(`{${el.slug}}`, el.title);
  });
  return str;
};

export default strFromObj;
