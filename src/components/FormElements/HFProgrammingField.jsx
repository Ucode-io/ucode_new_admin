import React, {useEffect, useState} from "react";
import FRowMultiLine from "./FRowMultiLine";
import {Controller, useWatch} from "react-hook-form";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/theme/monokai";
import "brace/mode/java";
import "brace/mode/golang";
import "brace/mode/python";
import "brace/mode/php";
import "brace/mode/csharp";
import "brace/mode/c_cpp";
import "brace/ext/language_tools";
import {Box, Button, Menu} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./style.module.scss";

const Proglanguages = [
  {
    id: 1,
    label: "JavaScript",
    value: "javascript",
  },
  {
    id: 2,
    label: "Golang",
    value: "golang",
  },
  {
    id: 3,
    label: "Python",
    value: "python",
  },
  {
    id: 4,
    label: "NodeJs",
    value: "javascript",
  },
  {
    id: 5,
    label: "Java",
    value: "java",
  },
  {
    id: 6,
    label: "SQL",
    value: "sql",
  },
  {
    id: 7,
    label: "Swift",
    value: "java",
  },
  {
    id: 8,
    label: "C/C++",
    value: "c_cpp",
  },
  {
    id: 9,
    label: "C#",
    value: "csharp",
  },
  {
    id: 10,
    label: "PHP",
    value: "php",
  },
];

function HFProgrammingField({
  control,
  name = "",
  disabledHelperText = false,
  updateObject = () => {},
  isNewTableView = false,
  required = false,
  isTransparent = false,
  withTrim = false,
  tabIndex,
  rules = {},
  field,
  label,
  newColumn,
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [progLanguage, setProgLanguage] = useState("");
  const open = Boolean(anchorEl);

  const value = useWatch({
    name,
    control,
  });

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (Boolean(!progLanguage)) {
      setProgLanguage(value?.split("#")?.[0]);
    }
  }, []);

  return (
    <FRowMultiLine
      label={label}
      required={field?.required}
      extraClassName={isNewTableView ? "tableView" : ""}>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        rules={{
          required: required ? "This is required field" : false,
          ...rules,
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <Box
            sx={{
              paddingTop: "50px",
              background: "#2E3129",
              position: "relative",
            }}>
            <AceEditor
              style={{paddingTop: "20px"}}
              mode={progLanguage}
              theme="monokai"
              onChange={(newValue) => {
                onChange(`${progLanguage}#${newValue}`);
                Boolean(!newColumn && isNewTableView) && updateObject();
              }}
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              width="400px"
              height="300px"
              setOptions={{
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
              editorProps={{$blockScrolling: true}}
              value={value?.split("#")?.[1]}
            />
            {error && <span>{error.message}</span>}

            <Button
              onClick={handleClick}
              variant="contained"
              sx={{
                position: "absolute",
                top: "10px",
                left: "5px",
                textTransform: "capitalize",
                fontSize: "12px",
              }}>
              {progLanguage && progLanguage === "c_cpp"
                ? "C/C++"
                : progLanguage
                  ? progLanguage
                  : "Programming langauge"}
            </Button>
            <Button
              onClick={() => {
                handleClose();
                updateObject();
              }}
              sx={{
                position: "absolute",
                top: "10px",
                right: "5px",
                color: "#fff",
              }}>
              <ClearIcon />
            </Button>

            <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
              <Box
                sx={{width: "120px", padding: "5px 0px", textAlign: "center"}}>
                {Proglanguages?.map((item) => (
                  <Box
                    onClick={() => {
                      setProgLanguage(item?.value);
                      Boolean(isNewTableView && !newColumn) && updateObject();
                      handleClose();
                    }}
                    className={`${item?.value === progLanguage ? styles.programmingLanguageActive : styles.programmingLanguage}`}
                    sx={{cursor: "pointer", fontSize: "14px"}}>
                    {item?.label}
                  </Box>
                ))}
              </Box>
            </Menu>
          </Box>
        )}
      />
    </FRowMultiLine>
  );
}

export default HFProgrammingField;
