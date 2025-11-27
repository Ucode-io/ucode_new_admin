import { useRef, useState } from "react";
import { Handle, Position } from "reactflow";
// import QueryNodeForm from "../../NodeForms/QueryNodeForm";
// import QueryToolForm from "../../NodeForms/QueryToolForm";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { store } from "../../../../../../store";
import DefaultNodeCard from "../IconCard/DefaultNodeCard";
import { useQueryByIdQuery } from "../../../../../../services/queryService";
import QueryToolForm from "../NodeForms/QueryToolForm";
import QueryNodeForm from "../NodeForms/QueryNodeForm";

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

const QueryNode = ({ data }) => {
  const company = store.getState().company;
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const {
  //   isOpen: isToolOpen,
  //   onOpen: onToolOpen,
  //   onClose: isToolClose,
  // } = useDisclosure();
  const btnRef = useRef();
  const { setValue: setParentFormValue, getValues: getParentValues } =
    useFormContext();
  const nodes = getParentValues().steps;
  const index = nodes?.findIndex((node) => node?.ui_component?.id === data?.id);
  const { handleSubmit, control, setValue, watch, getValues, reset } = useForm({
    defaultValues: {
      ...getParentValues().steps[index]?.config,
      type: "QUERY",
      callback_type: "success",
    },
  });
  const {
    fields: variablesFields,
    append: variablesAppend,
    remove: variablesRemove,
  } = useFieldArray({
    control,
    name: "request_info.variables",
  });

  const [toolIsOpen, setToolIsOpen] = useState(false);
  const [nodeIsOpen, setNodeIsOpen] = useState(false);
  const openCreateDrawer = () => {
    setToolIsOpen(true);
  };
  const openNodeDrawer = () => {
    setNodeIsOpen(true);
  };

  const closeDrawer = () => setToolIsOpen(false);
  const closeTool = () => setNodeIsOpen(false);

  // useEffect(() => {
  //   if (!queryStore.queryBottomSidebarIsOpen) {
  //     isToolClose();
  //   }
  //   if (!queryStore.queryRightSidebarIsOpen) {
  //     onClose();
  //   }
  // }, [queryStore.queryBottomSidebarIsOpen, queryStore.queryRightSidebarIsOpen]);

  const { isLoading } = useQueryByIdQuery({
    envId: company.environmentId,
    id: watch("request_info.id"),
    params: { "project-id": company.projectId },
    queryParams: {
      enabled: Boolean(watch("request_info.id")),
      onSuccess: (res) => {
        reset({ request_info: { ...res } });
      },
      cacheTime: false,
    },
  });

  const onSubmit = (values) => {
    setParentFormValue(`steps.${index}.config`, {
      ...values,
      request_info: {
        ...values.request_info,
        environment_id: company.environmentId,
        projectId: company.projectId,
      },
      type: "QUERY",
    });
    // onClose();
    // isToolClose();
  };

  return (
    <>
      <div
        className="text-updater-node"
        onClick={() => {
          // queryStore.queryBottomSidebarIsOpen && onToolOpen();
          // queryStore.queryRightSidebarIsOpen && onOpen();
          openCreateDrawer();
          openNodeDrawer();
        }}
        ref={btnRef}
      >
        <Handle
          type="source"
          id="queryNode"
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
          id="queryNode"
        />
        <Handle
          type="source"
          style={STYLE_PROPS_TARGET}
          position={Position.Bottom}
          id="errorQueryNode"
        />
      </div>
      {/* <QueryToolForm
        isOpen={isToolOpen}
        btnRef={btnRef}
        data={data}
        control={control}
        watch={watch}
        setValue={setValue}
        getValues={getValues}
        reset={reset}
        onClose={isToolClose}
        variablesAppend={variablesAppend}
        isLeftSideOpen={isOpen}
      />
      <QueryNodeForm
        isOpen={isOpen}
        btnRef={btnRef}
        onClose={onClose}
        data={data}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        control={control}
        watch={watch}
        setValue={setValue}
        getParentValues={getParentValues}
        index={index}
        variablesRemove={variablesRemove}
        variablesFields={variablesFields}
        variablesAppend={variablesAppend}
      /> */}
      <QueryToolForm
        open={toolIsOpen}
        initialValues={toolIsOpen}
        formIsVisible={toolIsOpen}
        closeDrawer={closeDrawer}
        data={data}
      />
      <QueryNodeForm
        open={nodeIsOpen}
        initialValues={nodeIsOpen}
        formIsVisible={nodeIsOpen}
        closeDrawer={closeTool}
        data={data}
      />
    </>
  );
};

export default QueryNode;
