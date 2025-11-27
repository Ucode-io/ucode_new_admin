import {updateLevel} from "../../../../utils/level";

export default function activeStyles({menuItem, element, menuStyle, level}) {
  return {
    height: "40px",
    backgroundColor:
      menuItem?.id === element?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      menuItem?.id === element?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    borderRadius: "10px",
    margin: "0 0px",
    display:
      element?.id === "0" ||
      (element?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };
}
