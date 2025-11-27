import React, {useMemo} from "react";
import {Controller} from "react-hook-form";
import {useQuery} from "react-query";
import constructorObjectService from "../../services/constructorObjectService";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {getFieldLabel} from "../../utils/getFieldLabel";
import {
  getLabelWithViewFields,
  getRelationFieldTabsLabel,
} from "../../utils/getRelationFieldLabel";
import {MenuItem, OutlinedInput, Select} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function HFRelationFieldSetting({control, name, selectedField}) {
  const {i18n} = useTranslation();
  const languages = useSelector((state) => state.languages.list);

  const {data: optionsFromLocale} = useQuery(
    ["GET_OBJECT_LIST", selectedField],
    () => {
      if (!selectedField?.table_slug) return null;
      return constructorObjectService.getListV2(
        selectedField?.table_slug,
        {
          data: {
            limit: 10,
            offset: 0,
          },
        },
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      enabled: Boolean(selectedField?.table_slug),
      select: (res) => {
        return res?.data?.response ?? [];
      },
      onSuccess: (data) => {
        // if (page > 1) {
        //   setAllOptions((prevOptions) => [...prevOptions, ...data.options]);
        // } else {
        //   setAllOptions(data?.options);
        // }
      },
    }
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <>
          <Select
            options={optionsFromLocale}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            value={value}
            input={<OutlinedInput error={error} size="small" />}
            fullWidth
            getOptionValue={(option) =>
              option?.guid ?? option?.id ?? option?.client_type_id
            }
            MenuProps={MenuProps}>
            {optionsFromLocale?.map((option) => (
              <MenuItem key={option.value} value={option.guid}>
                {getLabelWithViewFields(
                  selectedField?.attributes?.view_fields,
                  option
                )}
              </MenuItem>
            ))}
          </Select>
        </>
      )}></Controller>
  );
}

export default HFRelationFieldSetting;
