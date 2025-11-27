import {Delete, Edit} from "@mui/icons-material";
import {Box, FormControlLabel, Switch} from "@mui/material";
import React, {useEffect, useMemo} from "react";
import {Controller} from "react-hook-form";
import {useParams} from "react-router-dom";
import AutoWidthInput from "../../../../../components/AutoWidthInput";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import {CTableCell, CTableRow} from "../../../../../components/CTable";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import layoutService from "../../../../../services/layoutService";

export default function LayoutsItem({
  createLayout,
  element,
  index,
  getData,
  mainForm,
  allMenus,
  menus,
  remove,
  setModal,
  setDefault,
  setSectionTab,
  navigateToEditForm,
  languages,
}) {
  const {tableSlug} = useParams();

  const watchLayout = mainForm.watch(`layouts.${index}`);

  const updateCurrentLayout = (menuId) => {
    const currentUpdatedLayout = {
      ...watchLayout,
      menu_id: menuId,
    };
    layoutService.update(currentUpdatedLayout, tableSlug);
  };

  const updateChosenLayout = () => {
    const currentUpdatedLayout = {
      ...watchLayout,
    };
    layoutService.update(currentUpdatedLayout, tableSlug);
  };

  const options = useMemo(() => {
    return [
      ...menus,
      allMenus &&
        watchLayout?.menu_id &&
        allMenus.find((item) => item?.value === watchLayout?.menu_id),
    ].filter(function (value) {
      return value?.value;
    });
  }, [watchLayout?.menu_id, allMenus, menus]);

  const removeHandle = (index) => {
    const layout = mainForm.watch(`layouts.${index}`);
    layoutService.remove(tableSlug, layout?.id).then((res) => {
      remove(index);
    });
  };

  useEffect(() => {
    if (createLayout) {
      updateChosenLayout();
      getData();
    }
  }, [createLayout]);

  return (
    <CTableRow key={element.id}>
      <CTableCell>{index + 1}</CTableCell>
      <CTableCell>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {languages?.map((lang) => (
            <Controller
              control={mainForm.control}
              name={`layouts.${index}.attributes.label_${lang.slug}`}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <AutoWidthInput
                  value={value}
                  placeholder={`Name ${lang.slug}`}
                  onChange={(e) => {
                    onChange(e);
                    updateCurrentLayout();
                  }}
                  inputStyle={{
                    border: "none",
                    outline: "none",
                    fontWeight: 500,
                    background: "transparent",
                  }}
                />
              )}
            ></Controller>
          ))}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginLeft: "auto",
            }}
          >
            <Box style={{display: "flex", alignItems: "center"}}>
              <FormControlLabel
                control={
                  <Switch
                    onChange={() => {
                      setDefault(index);
                    }}
                    checked={element.is_default ?? false}
                  />
                }
                label={"Default"}
              />
              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) => {
                      setModal(index, e);
                    }}
                    checked={element.type === "SimpleLayout" ? false : true}
                  />
                }
                label={"Modal"}
              />
              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) => {
                      setSectionTab(index, e);
                    }}
                    checked={element?.is_visible_section ?? false}
                  />
                }
                label={"Remove Tabs"}
              />
            </Box>

            <Box
              sx={{
                minWidth: "200px",
              }}
            >
              <HFSelect
                control={mainForm.control}
                onChange={(e) => updateCurrentLayout(e)}
                name={`layouts.${index}.menu_id`}
                options={options}
              />
            </Box>
          </Box>
        </Box>
      </CTableCell>

      <CTableCell>
        <Box style={{display: "flex", gap: "5px"}}>
          <RectangleIconButton
            color="success"
            onClick={() => navigateToEditForm(element)}
          >
            <Edit color="success" />
          </RectangleIconButton>

          {/* <RectangleIconButton color="error" onClick={() => remove(index)}>
            <Delete color="error" />
          </RectangleIconButton> */}

          <RectangleIconButton
            color="error"
            onClick={() => removeHandle(index)}
          >
            <Delete color="error" />
          </RectangleIconButton>
        </Box>
      </CTableCell>
    </CTableRow>
  );
}
