const VideoMessage = ({ item }) => {
  return (
    <video
      src={item.message}
      alt="test"
      controls
      style={{
        borderRadius: "20px",
      }}
    />
  );
};

export default VideoMessage;
