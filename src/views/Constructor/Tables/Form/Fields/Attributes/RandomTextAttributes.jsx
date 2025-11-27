import React from "react";
import FRow from "../../../../../../components/FormElements/FRow";
import HFTextField from "../../../../../../components/FormElements/HFTextField";
import HFNumberField from "../../../../../../components/FormElements/HFNumberField";

function RandomTextAttributes({control}) {
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
        <FRow label="Prefix">
          <HFTextField name="attributes.prefix" control={control} fullWidth />
        </FRow>
        <FRow label="Limit">
          <HFNumberField
            type={"number"}
            name="attributes.digit_number"
            control={control}
            fullWidth
          />
        </FRow>
      </div>
    </>
  );
}

export default RandomTextAttributes;
