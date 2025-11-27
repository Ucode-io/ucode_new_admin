import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import React from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import {showAlert} from "../../store/alert/alert.thunk";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import {CTableCell, CTableRow} from "../CTable";
import NewTableDataForm from "../ElementGenerators/NewTableDataForm";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";

const AddDataColumn = React.memo(
  ({
    columns,
    relOptions,
    getValues,
    mainForm,
    relationfields,
    data,
    onRowClick,
    width,
    rows,
    setAddNewRow,
    refetch,
    view,
    isRelationTable,
  }) => {
    const dispatch = useDispatch();
    const {tableSlug, id} = useParams();

    const computedSlug = isRelationTable
      ? view?.type === "Many2One"
        ? `${tableSlug}_id`
        : `${tableSlug}_ids`
      : tableSlug;

    const computedTableSlug = isRelationTable ? view?.relatedTable : tableSlug;

    const {
      handleSubmit,
      control,
      setValue: setFormValue,
      formState: {errors},
    } = useForm({});

    const onSubmit = (values) => {
      constructorObjectService
        .create(computedTableSlug, {
          data: {
            ...values,
            [isRelationTable && computedSlug]: id,
          },
        })
        .then((res) => {
          refetch();
          setAddNewRow(false);
          dispatch(showAlert("Successfully created!", "success"));
        })
        .catch((e) => {
          console.log("ERROR: ", e);
        })
        .finally(() => {});
    };

    return (
      <CTableRow>
        <CTableCell
          align="center"
          className="data_table__number_cell"
          style={{
            padding: "4px 4px",
            minWidth: "80px",
            position: "sticky",
            left: "0",
            backgroundColor: "#F6F6F6",
            zIndex: "2",
          }}>
          {rows?.length ? rows?.length + 1 : 1}
        </CTableCell>
        {columns?.map((column, index) => (
          <CTableCell
            align="center"
            className="data_table__number_cell"
            style={{
              padding: "4px 4px",
              minWidth: "80px",
              position: "sticky",
              left: "0",
              backgroundColor: "#fff",
              zIndex: "1",
            }}>
            <NewTableDataForm
              relOptions={relOptions}
              tableSlug={tableSlug}
              fields={columns}
              field={column}
              getValues={getValues}
              mainForm={mainForm}
              control={control}
              setFormValue={setFormValue}
              relationfields={relationfields}
              data={data}
              onRowClick={onRowClick}
              width={width}
              index={index}
            />
          </CTableCell>
        ))}
        <CTableCell
          align="center"
          className="data_table__number_cell"
          style={{
            position: "sticky",
            backgroundColor: "#fff",
            zIndex: "1",
            minWidth: "85px",
            color: "#262626",
            fontSize: "13px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            padding: "0 5px",
            right: "0",
            borderLeft: "1px solid #eee",
          }}>
          <td
            style={{
              border: "none",
            }}>
            <div
              style={{
                display: "flex",
                gap: "5px",
                padding: "3px",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
                <RectangleIconButton
                  color="error"
                  onClick={() => setAddNewRow(false)}>
                  <ClearIcon color="error" />
                </RectangleIconButton>
              </PermissionWrapperV2>
              <RectangleIconButton
                color="success"
                onClick={handleSubmit(onSubmit)}>
                <DoneIcon color="success" />
              </RectangleIconButton>
            </div>
          </td>
        </CTableCell>
      </CTableRow>
    );
  }
);

export default AddDataColumn;
