import { useState } from "react";
import { Handle, Position } from "reactflow";
import DefaultNodeCard from "../IconCard/DefaultNodeCard";
import { useFormContext } from "react-hook-form";
import FinishNodeForm from "../NodeForms/FinishNodeForm";

const STYLE_PROPS_TARGET = {
  width: 28,
  height: 8,
  borderRadius: 2,
  background: "#007AFF",
};

const FinishNode = ({ data }) => {
  const [type, setType] = useState("success");
  const { setValue: setParentFormValue, getValues: getParentValues } =
    useFormContext();
  const nodes = getParentValues().steps;
  const index = nodes?.findIndex((node) => node?.ui_component?.id === data?.id);
  const callback_type = getParentValues(`steps.${index}.config.callback_type`);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const openCreateDrawer = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => setDrawerIsOpen(false);

  return (
    <>
      <div className="text-updater-node" onClick={openCreateDrawer}>
        <Handle
          type="source"
          id="backFinishNode"
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
      <FinishNodeForm
        open={drawerIsOpen}
        initialValues={drawerIsOpen}
        formIsVisible={drawerIsOpen}
        closeDrawer={closeDrawer}
        data={data}
        setType={setType}
        type={type}
        setParentFormValue={setParentFormValue}
        getParentValues={getParentValues}
        index={index}
        callback_type={callback_type}
      />
    </>
  );
};

export default FinishNode;
