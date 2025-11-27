// import { useDisclosure } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import DefaultNodeCard from "../IconCard/DefaultNodeCard";
import FunctionNodeForm from "../NodeForms/FunctionNodeForm";
// import FunctionNodeForm from "../../NodeForms/FunctionNodeForm";

const STYLE_PROPS_DEFAULT = {
  width: 28,
  height: 8,
  borderRadius: 2,
  background: "#007AFF",
};
const STYLE_PROPS_TARGET = {
  width: 28,
  height: 8,
  borderRadius: 2,
  background: "#f5644a",
};

const STYLE_PROPS_RIGHT = {
  width: 8,
  height: 28,
  borderRadius: 2,
  background: "#70B362",
};

const FunctionNode = ({ data }) => {
  const btnRef = useRef();

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const openCreateDrawer = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => setDrawerIsOpen(false);

  // useEffect(() => {
  //   if (!queryStore.queryRightSidebarIsOpen) {
  //     onClose();
  //   }
  // }, [queryStore.queryRightSidebarIsOpen]);
  return (
    <>
      <div className="text-updater-node" onClick={openCreateDrawer}>
        <Handle
          type="source"
          id="functionNode"
          style={STYLE_PROPS_RIGHT}
          position={Position.Right}
        />
        <div>
          <DefaultNodeCard
            color={"#007AFF"}
            icon={data.icon}
            noTitle={true}
            title={data?.label}
          />
        </div>
        <Handle
          type="target"
          style={STYLE_PROPS_DEFAULT}
          position={Position.Top}
          id="functionNode"
        />
        <Handle
          type="source"
          style={STYLE_PROPS_TARGET}
          position={Position.Bottom}
          id="errorfunctionNode"
        />
      </div>
      <FunctionNodeForm
        open={drawerIsOpen}
        initialValues={drawerIsOpen}
        formIsVisible={drawerIsOpen}
        closeDrawer={closeDrawer}
        data={data}
      />
    </>
  );
};

export default FunctionNode;
