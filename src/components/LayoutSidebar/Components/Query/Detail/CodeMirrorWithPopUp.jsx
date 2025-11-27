import { useEffect, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import styles from "../style.module.scss";
import CodeMirror from "@uiw/react-codemirror";
import OutsideClickHandler from "react-outside-click-handler";
import { Box, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import getElementBetween from "../../../../../utils/getElementBetween";

const CodeMirrorWithPopUp = ({ form, name }) => {
  let typeOfElement = typeof form.watch(name);
  const [focused, setFocused] = useState(false);
  const dispatch = useDispatch();
  const mirrorValue = form.getValues(name);

  useEffect(() => {
    if (typeof mirrorValue !== "string") {
      form.reset({
        ...form.getValues(),
        body: { ...form.getValues("body"), body: "" },
      });
    }
  }, []);

  const copyToClipboard = () => {
    dispatch(showAlert("Copied to clipboard", "success"));
    navigator.clipboard.writeText(form.watch(name));
  };

  return (
    <div className={styles.container}>
      <div
        onBlur={() => {
          setFocused(false);
        }}
      >
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          position="relative"
        >
          <CodeMirror
            value={typeof mirrorValue === "string" ? mirrorValue : ""}
            width="100%"
            color="#00C387"
            onFocus={() => setFocused(true)}
            theme={"light"}
            onChange={(value) => {
              getElementBetween(form);
              form.setValue(name, value);
            }}
          />

          {focused ? (
            <div className={`${styles.prompt} ${styles.codeMirror}`}>
              <div className={styles.wrapper}>
                <div>
                  <p>{typeOfElement}</p>
                  <p className={styles.paragraph}>"{form.watch(name)}"</p>
                </div>

                <div>
                  <Button
                    variant="contained"
                    colorScheme="green"
                    size="xs"
                    onClick={() => copyToClipboard()}
                  >
                    <MdContentCopy />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </Box>
        {/* </OutsideClickHandler> */}
      </div>
    </div>
  );
};

export default CodeMirrorWithPopUp;
