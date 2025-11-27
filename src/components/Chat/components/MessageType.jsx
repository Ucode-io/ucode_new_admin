import ImageMessage from "./ImageMessage";
import FileMessage from "./FileMessage";
import VideoMessage from "./VideoMessage";
import TextMessage from "./TextMessage";
import AudioMessage from "./AudioMessage";

const MessageTypes = ({ item }) => {
  switch (item.message_type) {
    case "photo":
      return <ImageMessage item={item} />;
    case "document":
      return <FileMessage item={item} />;
    case "video":
      return <VideoMessage item={item} />;
    case "animation":
      return <VideoMessage item={item} />;
    case "audio":
      return <AudioMessage item={item} />;

    default:
      return <TextMessage item={item} />;
  }
};

export default MessageTypes;
