import LinkIcon from "@mui/icons-material/Link";
import { Switch } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../../../utils/applyDrag";
import { columnIcons } from "../../../../utils/constants/columnIcons";
import styles from "./style.module.scss";

const GroupByTab = ({ initialColumns, form, updateView, isMenu }) => {
  const {
    fields: columns,
    move,
    replace,
  } = useFieldArray({
    control: form.control,
    name: "columns",
    keyName: "key",
  });

  const initialCheckedColumns = initialColumns?.map((item) => {
    return {
      ...item,
      is_checked: columns.find((el) => item.id === el.id).is_checked,
    };
  });
  const initialGroupCheckedColumns = initialColumns?.map((item) => {
    return {
      ...item,
      is_checked: false,
    };
  });

  const {
    fields: groupColumn,
    replace: replaceGroup,
    move: groupMove,
  } = useFieldArray({
    control: form.control,
    name: "attributes.group_by_columns",
    keyName: "key",
  });

  const watchedColumns = useWatch({
    control: form.control,
    name: "attributes.group_by_columns",
  });

  const onDrop = (dropResult) => {
    const result = applyDrag(columns, dropResult);
    if (result) {
      move(dropResult.removedIndex, dropResult.addedIndex);
      groupMove(dropResult.removedIndex, dropResult.addedIndex);
    }
  };

  const isWhatChecked = useMemo(() => {
    return watchedColumns?.filter((column) => column?.is_checked === true);
  }, [watchedColumns]);

  useEffect(() => {
    if (isMenu) {
      updateView();
    }
  }, [watchedColumns]);

  const onSwitchChange = (e, index) => {
    const updatedColumns = [...columns];
    const updatedGroupColumn = groupColumn?.map((item, columnIndex) => ({
      ...item,
      is_checked: index === columnIndex ? e.target.checked : item.is_checked,
    }));
    const selectedId = updatedGroupColumn[index].id;

    if (!form.watch(`attributes.group_by_columns.${index}.is_checked`)) {
      const columnIndex = updatedColumns.findIndex(
        (item) => item?.id === selectedId
      );
      if (columnIndex !== -1) {
        const filteredColumn = updatedColumns.splice(columnIndex, 1)[0];
        updatedColumns.unshift(filteredColumn);
      }
      replace(updatedColumns);
    } else {
      const columnIndex = updatedColumns.findIndex(
        (item) => item?.id === selectedId
      );

      if (columnIndex !== -1) {
        const filteredColumn = updatedColumns[columnIndex];
        if (isWhatChecked.length > 1) {
          updatedColumns.splice(columnIndex, 1);
          updatedColumns.splice(1, 0, filteredColumn);
        }
        replace(updatedColumns);
        if (isWhatChecked.length === 1) {
          replace(initialCheckedColumns);
        }
      }
    }

    if (!form.watch(`attributes.group_by_columns.${index}.is_checked`)) {
      const groupMovedColumn = updatedGroupColumn.splice(index, 1)[0];
      updatedGroupColumn.unshift(groupMovedColumn);
      replaceGroup(updatedGroupColumn);
    } else {
      if (isWhatChecked.length > 1) {
        const groupMovedColumn = updatedGroupColumn.splice(index, 1)[0];
        updatedGroupColumn.splice(1, 0, groupMovedColumn);
      }
      replaceGroup(updatedGroupColumn);
      if (isWhatChecked.length === 1) {
        replaceGroup(initialGroupCheckedColumns);
      }
    }
  };

  return (
    <div
      style={{
        minWidth: 200,
        maxHeight: 300,
        overflowY: "auto",
        padding: "10px 14px",
      }}
    >
      <div className={styles.table} style={{}}>
        <Container
          onDrop={onDrop}
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {groupColumn?.map((column, index) =>
            (!form.watch(`attributes.group_by_columns.${index}.is_checked`) &&
              isWhatChecked?.length === 2) ||
            !form.watch(`columns.${index}.is_checked`) ? null : (
              <Draggable key={column.id}>
                <div key={column.id} className={styles.row}>
                  <div
                    className={styles.cell}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      border: 0,
                      borderBottom: "1px solid #eee",
                      paddingLeft: 0,
                      paddingRight: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {columnIcons(column.type) ?? <LinkIcon />}
                    </div>
                    {column.label}
                  </div>
                  <div
                    className={styles.cell}
                    style={{
                      width: 70,
                      border: 0,
                      borderBottom: "1px solid #eee",
                      paddingLeft: 0,
                      paddingRight: 0,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Switch
                      disabled={
                        (!form.watch(
                          `attributes.group_by_columns.${index}.is_checked`
                        ) &&
                          isWhatChecked?.length === 2) ||
                        !form.watch(`columns.${index}.is_checked`)
                      }
                      size="small"
                      checked={form.watch(
                        `attributes.group_by_columns.${index}.is_checked`
                      )}
                      onChange={(e) => {
                        onSwitchChange(e, index);
                      }}
                    />
                  </div>
                </div>
              </Draggable>
            )
          )}
        </Container>
      </div>
    </div>
  );
};

export default GroupByTab;
