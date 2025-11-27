import React, {lazy, Suspense, useEffect} from "react";
import {Controller, useWatch} from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import "./reactQuill.scss";
import {Quill} from "react-quill";
import RingLoaderWithWrapper from "../../../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import {Box} from "@mui/material";

const ReactQuill = lazy(() => import("react-quill"));

const HCMultiLine = ({
  control,
  name = "",
  disabledHelperText = false,
  updateObject,
  isNewTableView = false,
  required = false,
  isTransparent = false,
  fullWidth = false,
  withTrim = false,
  tabIndex,
  rules = {},
  field,
  label,
  ...props
}) => {
  const value = useWatch({
    control,
    name,
  });

  useEffect(() => {
    const Font = Quill.import("formats/font");
    Font.whitelist = [
      "sans-serif",
      "lato",
      "roboto",
      "san-francisco",
      "serif",
      "monospace",
    ];
    Quill.register(Font, true);
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{header: "1"}, {header: "2"}],
        [{list: "ordered"}, {list: "bullet"}],
        ["bold", "italic", "underline"],
        [{color: []}],
        ["link", "image", "video"],
        [
          {
            font: [
              "sans-serif",
              "lato",
              "roboto",
              "san-francisco",
              "serif",
              "monospace",
            ],
          },
        ],
      ],
    },
  };

  return (
    <Box id="hcMultiline">
      <Controller
        control={control}
        name={name}
        defaultValue=""
        rules={{
          required: required ? "This is required field" : false,
          ...rules,
        }}
        render={({field: {onChange}, fieldState: {error}}) => (
          <Suspense fallback={<RingLoaderWithWrapper />}>
            <ReactQuill
              theme="snow"
              value={value}
              modules={modules}
              defaultValue={value}
              onChange={(val) => {
                onChange(val);
                isNewTableView && updateObject();
              }}
              tabIndex={tabIndex}
              autoFocus={false}
              style={{
                backgroundColor: isTransparent ? "transparent" : "",
                minWidth: "200px",
                width: "100%",
                border: "1px solid #FFF",
                fontFamily: "sans-serif",
              }}
            />
          </Suspense>
        )}
      />
    </Box>
  );
};

export default HCMultiLine;
