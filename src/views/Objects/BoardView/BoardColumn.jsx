import {Add} from "@mui/icons-material";
import {Button, IconButton} from "@mui/material";
import {useEffect, useMemo} from "react";
import {useState} from "react";
import {useMutation, useQueryClient} from "react-query";
import {useParams} from "react-router-dom";
import {Container, Draggable} from "react-smooth-dnd";
import BoardCardRowGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator";
import constructorObjectService from "../../../services/constructorObjectService";
import {applyDrag, applyDragIndex} from "../../../utils/applyDrag";
import styles from "./style.module.scss";
import BoardPhotoGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator/BoardPhotoGenerator";
import BoardModalDetailPage from "./components/BoardModaleDetailPage";

const BoardColumn = ({tab, data = [], fieldsMap, view = []}) => {
  const {tableSlug} = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState();
  const [index, setIndex] = useState();
  const [dateInfo, setDateInfo] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [computedData, setComputedData] = useState(
    data.filter((el) => {
      if (Array.isArray(el[tab.slug])) return el[tab.slug].includes(tab.value);
      return el[tab.slug] === tab.value;
    })
  );
  console.log("tabbbbbbbbb", tab);
  const {mutate} = useMutation(
    ({data, index}) => {
      return constructorObjectService.update(tableSlug, {
        data: {
          ...data,
          [tab.slug]: [tab.value],
          board_order: index + 1,
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
      },
    }
  );

  const onDrop = (dropResult) => {
    const result = applyDrag(computedData, dropResult);
    if (result) setComputedData(result);
    setIndex(dropResult?.addedIndex);
    if (result?.length > computedData?.length) {
      mutate({data: dropResult.payload, index: dropResult.addedIndex});
    } else if (result?.length === computedData?.length) {
      mutate({data: dropResult.payload, index: dropResult.addedIndex});
    }
  };

  const viewFields = useMemo(() => {
    return view.columns?.map((id) => fieldsMap[id]).filter((el) => el) ?? [];
  }, [view, fieldsMap, data]);

  useEffect(() => {
    setComputedData(
      data?.filter((el) => {
        if (Array.isArray(el[tab.slug]))
          return el[tab.slug].includes(tab.value);
        return el[tab.slug] === tab.value;
      })
    );
  }, [data]);

  const navigateToEditPage = (el) => {
    setOpen(true);
    setSelectedRow(el);
    setDateInfo({});
  };
  const navigateToCreatePage = (slug) => {
    setOpen(true);
    setDateInfo({[tab.slug]: tab.value});
    setSelectedRow(null);
  };

  return (
    <>
      <div className={styles.column}>
        <div className={`${styles.columnHeaderBlock} column-header`}>
          <div className={styles.title}>{tab.label}</div>
          <div className={styles.rightSide}>
            <IconButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigateToCreatePage();
              }}>
              <Add />
            </IconButton>
            <div className={styles.counter}>{computedData?.length ?? 0}</div>
          </div>
        </div>

        <Container
          style={{
            height: "calc(100vh - 220px)",
            overflow: "auto",
            borderRadius: "6px",
            minHeight: "0",
          }}
          groupName="subtask"
          getChildPayload={(i) => computedData[i]}
          onDrop={(e) => {
            onDrop(e);
          }}
          dropPlaceholder={{className: "drag-row-drop-preview"}}>
          {computedData.map((el) => (
            <Draggable
              key={el.guid}
              index={index}
              style={{
                background: "#fff",
                borderRadius: "12px",
                marginBottom: "6px",
                cursor: "pointer",
              }}>
              <div
                className={styles.card}
                key={el.guid}
                onClick={() => navigateToEditPage(el)}>
                {viewFields.map((field) => (
                  <BoardPhotoGenerator key={field.id} field={field} el={el} />
                ))}
                {viewFields.map((field) => (
                  <BoardCardRowGenerator key={field.id} field={field} el={el} />
                ))}
              </div>
            </Draggable>
          ))}
        </Container>

        <div className={`${styles.columnFooterBlock}`}>
          <Button
            variant="contain"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              navigateToCreatePage();
            }}>
            <Add /> Add new
          </Button>
        </div>
      </div>
      <BoardModalDetailPage
        open={open}
        setOpen={setOpen}
        dateInfo={dateInfo}
        selectedRow={selectedRow}
      />
    </>
  );
};

export default BoardColumn;
