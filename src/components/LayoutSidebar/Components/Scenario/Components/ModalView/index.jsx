import { ImStop } from "react-icons/im";
import { GrStatusCriticalSmall } from "react-icons/gr";
import { IoDocumentTextSharp, IoPlay } from "react-icons/io5";
import { HiOutlineCodeBracket } from "react-icons/hi2";
import GridItems from "../GridItems";
import CardModal from "../Modal";

const ModalView = ({ ...props }) => {
  const list = [
    {
      label: "System steps",
      widgets: [
        {
          label: "start_node",
          icon: IoPlay,
          type: "startNode",
        },
        // {
        //   label: "Api",
        //   icon: TbApi,
        //   type: "apiNode",
        // },
        {
          label: "condition_node",
          icon: GrStatusCriticalSmall,
          type: "conditionNode",
        },
        {
          label: "finish_node",
          icon: ImStop,
          type: "finishNoded",
        },
        {
          label: "query",
          icon: IoDocumentTextSharp,
          type: "queryNode",
        },
        {
          label: "function_node",
          icon: HiOutlineCodeBracket,
          type: "functionNode",
        },
        // {
        //   label: "Exit",
        //   icon: LeaveIcon,
        // },
      ],
    },
    // {
    //   label: "Integration",
    //   widgets: [
    //     {
    //       label: "Query",
    //       icon: GrDocumentText,
    //       type: "queryNode",
    //     },
    //   ],
    // },
    // {
    //   label: "Integrations",
    //   widgets: [
    //     {
    //       label: "SQL query",
    //       icon: SqlIcon,
    //     },
    //     {
    //       label: "API response",
    //       icon: ApiIcon,
    //     },
    //     {
    //       label: "HTTP request",
    //       icon: HttpIcon,
    //     },
    //   ],
    // },
  ];

  return (
    <>
      <CardModal {...props}>
        <GridItems list={list} />
      </CardModal>
    </>
  );
};

export default ModalView;
