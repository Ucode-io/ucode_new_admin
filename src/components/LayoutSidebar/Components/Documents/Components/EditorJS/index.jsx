import { Controller } from "react-hook-form";
import { Box } from "@mui/material";
import Editor from "./Editor";

const EditorJs = ({
  name,
  control,
  defaultValue = "",
  required = false,
  form,
  isLoading,
  loadingFromTokenDoc,
}) => {
  return (
    <Box
      pr="96px"
      pl="96px"
      height={"auto"}
      minHeight={"87vh"}
      style={{
        background: "#fff",
      }}
    >
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{ required }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Editor
            value={value}
            onChange={onChange}
            isLoading={isLoading}
            loadingFromTokenDoc={loadingFromTokenDoc}
          />
        )}
      />
    </Box>
  );
};

export default EditorJs;
