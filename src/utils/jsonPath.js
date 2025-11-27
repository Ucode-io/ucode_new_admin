import { JSONPath } from "jsonpath-plus";

export const mergeStringAndState = (str, state) => {
  const regexp = /(?<=\{\{).*?(?=\}\})/g;
  const variables = str?.match(regexp);

  let computedStr = str;

  if (!variables?.length) return computedStr;

  for (const variable of variables) {
    if (variable.includes("{") || variable.includes("}")) continue;

    let result = JSONPath({ path: variable.trim(), json: state, wrap: false });

    if (result === undefined) result = "";
    if (Array.isArray(result)) {
      computedStr = computedStr.replace(
        "{{${variable}}}",
        JSON.stringify(result)
      );
      continue;
    }
    computedStr = computedStr.replace(`{{${variable}}}`, result);
  }

  return computedStr;
};
