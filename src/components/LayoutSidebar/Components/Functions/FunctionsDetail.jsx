import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./index.module.scss";
import { useFunctionByIdQuery } from "../../../../services/functionService";
import { Box } from "@mui/material";

const FunctionsDetail = () => {
  const { functionId, projectId } = useParams();
  const [loader, setLoader] = useState(true);

  const { data: func, isLoading } = useFunctionByIdQuery({
    functionId,
    queryParams: {
      cacheTime: false,
    },
  });

  return (
    <Box>
      <Box height="100vh">
        <iframe
          onLoadCapture={() => setLoader(false)}
          src={func?.url}
          title="vs-code"
          width="100%"
          height="100%"
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation"
          className={styles.iframe}
        />
      </Box>
    </Box>
  );
};
export default FunctionsDetail;
