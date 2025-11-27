import { Button, TextField } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import styles from "./index.module.scss";
import MicrofrontendComponent from "../../components/MicrofrontendComponent";
import { useState } from "react";

const MicrofrontendPlayground = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("link"));

  const onButtonClick = () => {
    setSearchParams({
      link: inputValue
    })
  }

  return (
    <div>
      <div className={styles.form}>
        <TextField
          style={{ flex: 1 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          size="small"
          placeholder="Microfrontend remoteEntry.js file link"
        />
        <Button variant="contained" onClick={onButtonClick} >PLAY</Button>
      </div>

      <div className={styles.playground}>
        <MicrofrontendComponent link={searchParams.get("link")} />
      </div>
    </div>
  );
};
export default MicrofrontendPlayground;
