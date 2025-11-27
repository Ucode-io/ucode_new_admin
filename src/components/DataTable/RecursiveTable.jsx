import {CTableCell, CTableRow} from "../CTable";
import GroupCellElementGenerator from "./GroupCellElementGenerator";
import {useSelector} from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {Box, Button} from "@mui/material";
import {get} from "@ngard/tiny-get";
import {getRelationFieldTableCellLabel} from "../../utils/getRelationFieldLabel";
import {useState} from "react";

const RecursiveTable = ({
  element,
  index,
  columns,
  width,
  control,
  onRowClick,
  calculateWidthFixedColumn,
  onDeleteClick,
  mainForm,
  checkboxValue,
  onCheckboxChange,
  currentPage,
  view,
  selectedObjectsForDelete,
  setSelectedObjectsForDelete,
  tableSettings,
  pageName,
  calculateWidth,
  watch,
  setFormValue,
  tableSlug,
  isChecked = () => {},
  formVisible,
  remove,
  limit = 10,
  relationAction,
  onChecked,
  relationFields,
  data,
  style,
}) => {
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);

  const clickHandler = () => {
    if (element?.data?.length) {
      setChildBlockVisible((prev) => !prev);
    }
  };
  const filteredColumns = columns.filter((column) => {
    if (column?.type === "LOOKUP" || column?.type === "LOOKUPS") {
      return view?.attributes?.group_by_columns.includes(column?.relation_id);
    } else {
      return view?.attributes?.group_by_columns.includes(column?.id);
    }
  });

  return (
    <>
      {element && (
        <CTableRow key={index}>
          {columns?.map((column, index) => {
            return (
              <CTableCell
                key={column.id}
                className={`overflow-ellipsis ${tableHeight}`}
                style={{
                  minWidth: "220px",
                  color: "#262626",
                  fontSize: "13px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  padding: "0 5px",
                  position: `${
                    tableSettings?.[pageName]?.find(
                      (item) => item?.id === column?.id
                    )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                      ? "sticky"
                      : "relative"
                  }`,
                  left: view?.attributes?.fixedColumns?.[column?.id]
                    ? `${calculateWidthFixedColumn(column.id)}px`
                    : "0",
                  backgroundColor: `${
                    tableSettings?.[pageName]?.find(
                      (item) => item?.id === column?.id
                    )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                      ? "#F6F6F6"
                      : "#fff"
                  }`,
                  zIndex: `${tableSettings?.[pageName]?.find((item) => item?.id === column?.id)?.isStiky || view?.attributes?.fixedColumns?.[column?.id] ? "1" : "0"}`,
                }}
                onClick={() => {
                  element?.guid ? onRowClick(element, index) : clickHandler();
                }}>
                <Box display={"flex"} alignItems={"center"}>
                  {filteredColumns.find((item) => item.id === column.id) &&
                  element?.data?.length ? (
                    childBlockVisible ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowRightIcon />
                    )
                  ) : null}

                  <Box onClick={() => console.log("clicked")}>
                    <GroupCellElementGenerator
                      field={column}
                      row={element}
                      name={`multi.${index}.${column.slug}`}
                      watch={watch}
                      fields={columns}
                      index={index}
                      control={control}
                      setFormValue={setFormValue}
                      relationfields={relationFields}
                      data={data}
                      view={view}
                    />
                  </Box>
                </Box>
              </CTableCell>
            );
          })}
        </CTableRow>
      )}

      {childBlockVisible &&
        element?.data?.map((childELement, childIndex) => (
          <RecursiveTable
            element={childELement}
            index={childIndex}
            columns={columns}
            width={"80px"}
            remove={remove}
            watch={watch}
            control={control}
            key={element.id}
            mainForm={mainForm}
            formVisible={formVisible}
            selectedObjectsForDelete={selectedObjectsForDelete}
            setSelectedObjectsForDelete={setSelectedObjectsForDelete}
            onRowClick={onRowClick}
            isChecked={isChecked}
            calculateWidthFixedColumn={calculateWidthFixedColumn}
            onCheckboxChange={onCheckboxChange}
            currentPage={currentPage}
            limit={limit}
            setFormValue={setFormValue}
            tableHeight={tableHeight}
            tableSettings={tableSettings}
            pageName={pageName}
            calculateWidth={calculateWidth}
            tableSlug={tableSlug}
            onDeleteClick={onDeleteClick}
            relationAction={relationAction}
            onChecked={onChecked}
            relationFields={relationFields}
            data={data}
            view={view}
          />
        ))}
    </>
  );
};

export default RecursiveTable;
