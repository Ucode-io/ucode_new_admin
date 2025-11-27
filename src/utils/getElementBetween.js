
const getElementBetween = (form) => {
  let goodParts = [];

  let text = ''

  Object.values(form.watch('body')).map((item) => {
    if (typeof item === 'string') {
      text = text + item;
    }

    if (typeof item === 'object') {
      item.forEach((i) => {
        text = text + i.key + i.value;
      });
    }
  });

  const allParts = text.split('{{');

  allParts.forEach((part) => {
    if (part.indexOf('}}') > -1) {
      const goodOne = (part.split('}}'))[0];
      goodParts = goodParts.concat(goodOne);
    }
  });

  let result = goodParts.map((item) => {
    return {
      key: item,
      value: "",
    };
  });

  form.setValue('variables', result);
}

export default getElementBetween;