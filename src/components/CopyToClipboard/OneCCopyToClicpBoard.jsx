import {useState} from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";

import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import {useDispatch} from "react-redux";
import {showAlert} from "../../store/alert/alert.thunk";
import {Box} from "@mui/material";

const OneCCopyToClipboard = ({copyText, ...props}) => {
  const [isCopied, setIsCopied] = useState(false);
  const dispatch = useDispatch();

  const handleClick = () => {
    navigator.clipboard.writeText(copyText);
    setIsCopied(true);
    dispatch(showAlert("Скопировано в буфер обмена", "success"));
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <RectangleIconButton {...props}>
      {isCopied ? (
        <DoneIcon htmlColor="#6e8bb7" />
      ) : (
        // <ContentCopyIcon onClick={handleClick} htmlColor="#6e8bb7" />
        <Box onClick={handleClick}>
          <img src="/img/copy-01.svg" alt="" />
        </Box>
      )}
    </RectangleIconButton>
  );
};

export default OneCCopyToClipboard;
