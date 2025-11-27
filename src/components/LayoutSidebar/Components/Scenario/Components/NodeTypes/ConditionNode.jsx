import { useMemo, useState } from "react";
import { Handle, Position } from "reactflow";
import { useFormContext } from "react-hook-form";
import ConditionNodeCard from "../IconCard/ConditionNodeCard";
import ConditionNodeForm from "../NodeForms/ConditionNodeForm";
// import SimpleLoader from "components/Loaders/SimpleLoader";

const STYLE_PROPS_TARGET = {
  width: 28,
  height: 8,
  background: "#007AFF",
  borderRadius: 2,
};
const STYLE_PROPS_SOURCE = {
  width: 28,
  height: 8,
  background: "#f5644a",
  borderRadius: 2,
};
const STYLE_PROPS_HANDLE = {
  height: 28,
  width: 8,
  background: "#007AFF",
  borderRadius: 2,
};

const ConditionNode = ({ data, isConnectable }) => {
  const { watch: getParentWatch } = useFormContext();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const blocks = getParentWatch("steps");
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const openCreateDrawer = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => setDrawerIsOpen(false);

  const conditions = useMemo(() => {
    const arr = [];
    blocks?.forEach((item) => {
      item?.config?.request_info?.blocks?.forEach((el) => {
        arr.push({
          id: el?.source_handle_id,
          parent_id: el?.parent_id,
          conditions: el?.conditions,
        });
      });
    });
    return arr;
  }, [getParentWatch()]);

  // useEffect(() => {
  //   if (!queryStore.queryRightSidebarIsOpen) {
  //     onClose();
  //   }
  // }, [queryStore.queryRightSidebarIsOpen]);

  // useEffect(() => {
  //   if (loader) {
  //     queryStore.stopConditionLoader();
  //   }
  // }, [loader]);

  return (
    <>
      {/* {loader ? (
        <SimpleLoader color="#007AFF" />
      ) : ( */}
      <>
        <div className="text-updater-node" onClick={openCreateDrawer}>
          <div>
            <ConditionNodeCard
              icon={data.icon}
              noTitle={true}
              title={data?.label}
              data={data}
              conditions={conditions}
              handleStyle={STYLE_PROPS_HANDLE}
              isConnectable={isConnectable}
            />
          </div>
          <Handle
            type="target"
            style={STYLE_PROPS_TARGET}
            position={Position.Top}
            id="conditionNode"
          />

          <Handle
            type="source"
            style={STYLE_PROPS_SOURCE}
            position={Position.Bottom}
            id="errorConditionNode"
          />
        </div>
        <ConditionNodeForm
          open={drawerIsOpen}
          initialValues={drawerIsOpen}
          formIsVisible={drawerIsOpen}
          closeDrawer={closeDrawer}
          data={data}
        />
      </>
      {/* )} */}
    </>
  );
};

export default ConditionNode;
