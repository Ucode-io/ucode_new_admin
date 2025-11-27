import { useState } from "react";
import { Handle, Position } from "reactflow";
import DefaultNodeCard from "../IconCard/DefaultNodeCard";
import StartNodeForm from "../NodeForms/StartNodeForm";

const STYLE_PROPS_TARGET = {
  width: 28,
  height: 8,
  borderRadius: 2,
  background: "#007AFF",
};

const StartNode = ({ data }) => {
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
          id="startNode"
          style={STYLE_PROPS_TARGET}
          position={Position.Bottom}
        />
        <div>
          <DefaultNodeCard
            color={"#007AFF"}
            icon={data.icon}
            noTitle={true}
            title={data?.label}
          />
        </div>
      </div>
      <StartNodeForm
        open={drawerIsOpen}
        initialValues={drawerIsOpen}
        formIsVisible={drawerIsOpen}
        closeDrawer={closeDrawer}
        data={data}
      />
    </>
  );
};

export default StartNode;
