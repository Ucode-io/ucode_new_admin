import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate, useParams } from "react-router-dom";
import RectangleIconButton from "../../Buttons/RectangleIconButton";
const ChatRouter = () => {
  const navigate = useNavigate();
  const param = useParams();
  const handleClick = () => {
    navigate(`/main/${param.appId}/chat`);
  };

  return (
    <div>
      <RectangleIconButton color="primary" onClick={handleClick}>
        <ChatBubbleOutlineIcon color="primary" />
      </RectangleIconButton>
    </div>
  );
};
export default ChatRouter;
