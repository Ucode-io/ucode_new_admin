import CodeMirrorWithPopUp from "./CodeMirrorWithPopUp";
import JsonFormatForBody from "./JsonFormatForBody";

const QueryBodyTypes = ({ form, control }) => {
  const selectedType = form.watch("body.body_type");

  const types = [
    {
      label: "JSON",
      value: "JSON",
      component: <JsonFormatForBody form={form} control={control} />,
    },
    {
      label: "RAW",
      value: "RAW",
      component: <CodeMirrorWithPopUp form={form} name={"body.body"} />,
    },
    {
      label: "x-www-form-urlencoded",
      value: "x-www-form-urlencoded",
      component: <JsonFormatForBody form={form} control={control} />,
    },
    {
      label: "Binary",
      value: "Binary",
      component: <CodeMirrorWithPopUp form={form} name={"body.body"} />,
    },
    {
      label: "None",
      value: "None",
      component: "",
    },
  ];

  return types.map((type) => {
    if (type?.value === selectedType) {
      return type?.component;
    }
  });
};

export default QueryBodyTypes;
