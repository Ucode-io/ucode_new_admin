import { useCallback, useRef, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ConnectionMode,
} from "reactflow";
import { EdgeGenerator } from "../Nodes/Edge/EdgeGenerator";
import { generateGUID } from "../../../../utils/generateID";
import {
  useScenarioCreateMutation,
  useScenarioGetByIdQuery,
  useScenarioUpdateMutation,
} from "../../../../services/scenarioService";
import { store } from "../../../../store";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { AiFillBug, AiFillPlusSquare } from "react-icons/ai";
import ModalView from "./Components/ModalView";
import StartNode from "./Components/NodeTypes/StartNode";
import FinishNode from "./Components/NodeTypes/FinishNode";
import ConditionNode from "./Components/NodeTypes/ConditionNode";
import QueryNode from "./Components/NodeTypes/QueryNode";
import FunctionNode from "./Components/NodeTypes/FunctionNode";
import { IconGenerator } from "./Components/IconGenerator";
import style from "./index.module.scss";
import "reactflow/dist/style.css";
import Navbar from "./Components/Navbar";
import RunForm from "./Components/RunForm";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { useDispatch } from "react-redux";
import RingLoaderWithWrapper from "../../../Loaders/RingLoader/RingLoaderWithWrapper";

const initialEdges = [];
const initialNodes = [];

const nodeTypes = {
  startNode: StartNode,
  finishNoded: FinishNode,
  conditionNode: ConditionNode,
  queryNode: QueryNode,
  functionNode: FunctionNode,
};

const Flow = () => {
  const company = store.getState().company;
  const navigate = useNavigate();
  const { projectId, categoryId, scenarioId } = useParams();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [toggle, setToggle] = useState(true);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [scrollValue, setScrollValue] = useState(false);
  const methods = useForm();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState(0);
  const dispatch = useDispatch();

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "steps",
    keyName: "key",
  });

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback((params) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          style: {
            stroke: EdgeGenerator(params.targetHandle),
            strokeWidth: 3,
          },
        },
        eds
      )
    );
  }, []);

  const closeBtn = (value) => {
    setScrollValue(value);
  };
  const deleteNodeById = (id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    let nodeId = "";
    id.forEach((i) => {
      nodeId = nodes.findIndex((item) => item.id === i.id);
    });
    remove(nodeId);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/type");
      const title = event.dataTransfer.getData("application/title");
      // const id = event.dataTransfer.getData("application/id");
      const id = generateGUID();

      if (typeof type === "undefined" || !type) {
        return;
      }
      let icon = IconGenerator(type);

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const positionAbsolute = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: id,
        position,
        positionAbsolute,
        data: { label: ``, icon: icon, id: id, conditions: [] },
        width: 78,
        height: 78,
        type: type,
        title: title,
      };

      setNodes((nds) => nds?.concat(newNode));
      append({ ui_component: newNode });
    },
    [reactFlowInstance]
  );
  const { isLoading } = useScenarioGetByIdQuery({
    dagId: scenarioId,
    projectId: projectId,
    envId: company.environmentId,
    queryParams: {
      cacheTime: 10,
      enabled: !!scenarioId,
      onSuccess: (res) => {
        methods.reset({ ...res });
        setNodes(
          res?.steps?.map((item) => {
            return {
              ...item.ui_component,
              data: {
                id: item.ui_component.data.id,
                label: "",
                icon: IconGenerator(item.ui_component.type),
              },
            };
          })
        );
        setEdges(res.dag.attributes.edges);
      },
    },
  });

  const { mutate: createScenario, isLoading: createLoading } =
    useScenarioCreateMutation({
      projectId: projectId,
      onSuccess: (res) => {
        dispatch(showAlert("Успешно!", "success"));
        queryClient.refetchQueries(["SCENARIO"]);
        navigate(
          `/project/${projectId}/scenarios/${categoryId}/detail/${res.id}`
        );
        // setApiEndpointId(res.guid);
      },
    });

  const { mutate: updataScenario, isLoading: updateLoading } =
    useScenarioUpdateMutation({
      projectId: projectId,
      onSuccess: (res) => {
        dispatch(showAlert("Успешно!", "success"));
        queryClient.refetchQueries(["SCENARIO"]);
      },
    });

  const onSubmit = (values) => {
    if (scenarioId) {
      updataScenario({
        ...values,
        dag: {
          category_id: categoryId,
          type: "HTTP",
          status: "ACTIVE",
          id: scenarioId,
          attributes: { edges },
          title: values.dag.title,
        },
      });
    } else {
      createScenario({
        ...values,
        dag: {
          category_id: categoryId,
          type: "HTTP",
          status: "ACTIVE",
          attributes: { edges },
          title: values.dag.title,
        },
      });
    }
  };
  return (
    <>
      {isLoading || createLoading || updateLoading ? (
        <RingLoaderWithWrapper />
      ) : (
        <FormProvider {...methods}>
          <Navbar
            onSubmit={onSubmit}
            handleSubmit={methods.handleSubmit}
            control={methods.control}
            setToggle={setToggle}
            toggle={toggle}
            watch={methods.watch}
            scenarioId={scenarioId}
          />
          <div className={style.Flow}>
            <div className={style.scenarioTabs}>
              <Tabs
                direction={"ltr"}
                selectedIndex={selectedTab}
                onSelect={setSelectedTab}
                className={toggle ? style.tabswithtoggle : style.tabs}
              >
                <TabList>
                  <Tab className={style.tab}>
                    <AiFillPlusSquare fontSize={22} />
                  </Tab>
                  <Tab className={style.tab}>
                    <AiFillBug fontSize={22} />
                  </Tab>
                </TabList>
                <TabPanel className={selectedTab === 0 && style.panel}>
                  <ModalView
                    closeBtn={closeBtn}
                    id={style.box_right}
                    className={style[scrollValue] || ""}
                  />
                </TabPanel>
                <TabPanel className={selectedTab && style.runpanel}>
                  <RunForm methods={methods} />
                </TabPanel>
              </Tabs>
            </div>
            <div
              id={toggle ? style.box_middle : style.box}
              className={scrollValue && style.box_middle_close}
              ref={reactFlowWrapper}
            >
              <ReactFlow
                style={{ backgroundColor: "#E5E5E5" }}
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onClick={(e) => console.log("e", e)}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                connectionMode={ConnectionMode.Loose}
                onNodesDelete={deleteNodeById}
              >
                <Background />
              </ReactFlow>
            </div>
          </div>
        </FormProvider>
      )}
    </>
  );
};

export default Flow;
