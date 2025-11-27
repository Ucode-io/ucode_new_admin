export const EdgeGenerator = (property) => {
  switch (property) {
    case "errorQueryNode":
      return "#f5644a";
    case "errorConditionNode":
      return "#f5644a";
    case "successFinishNoded":
      return "#70B362";
    case "queryNode":
      return "#007AFF";
    case "conditionNode":
      return "#007AFF";
    case "errorFinish":
      return "#f5644a";
    default:
      return "#007AFF";
  }
};
