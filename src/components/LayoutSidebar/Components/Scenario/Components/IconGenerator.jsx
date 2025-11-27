import { GrStatusCriticalSmall, GrStatusUnknown } from "react-icons/gr";
import { HiOutlineCodeBracket } from "react-icons/hi2";
import { ImStop } from "react-icons/im";
import { IoDocumentTextSharp, IoPlay } from "react-icons/io5";
import { TbApi } from "react-icons/tb";

export const IconGenerator = (property) => {
  switch (property) {
    case "startNode":
      return IoPlay;
    case "finishNoded":
      return ImStop;
    case "apiNode":
      return TbApi;
    case "conditionNode":
      return GrStatusCriticalSmall;
    case "queryNode":
      return IoDocumentTextSharp;
    case "functionNode":
      return HiOutlineCodeBracket;

    default:
      return GrStatusUnknown;
  }
};
