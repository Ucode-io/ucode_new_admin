import React from "react";
import FRow from "../../../../../../components/FormElements/FRow";

import HFSelect from "../../../../../../components/FormElements/HFSelect";

function CodeAttributes({control}) {
  const options = [
    {
      id: 1,
      label: "JSON",
      value: "json",
    },
    {
      id: 2,
      label: "Programming Language",
      value: "program",
    },
    {
      id: 3,
      label: "Text",
      value: "text",
    },
  ];
  return (
    <>
      <div className="p-2">
        <FRow label="Lattitude">
          <HFSelect
            options={options}
            name="attributes.field_type"
            control={control}
            fullWidth
          />
        </FRow>
      </div>
    </>
  );
}

export default CodeAttributes;
