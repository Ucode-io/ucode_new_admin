import {Box, Typography} from "@mui/material";
import style from "../style.module.scss";
import FiltersBlock from "../../../../FiltersBlock";
import CRangePickerNew from "../../../../DatePickers/CRangePickerNew";
import {useState} from "react";
import {customStyles} from "../../../../Status";
import Select from "react-select";
import InventoryIcon from "@mui/icons-material/Inventory";

const ActivityFeedHeader = ({histories, setDateFilters, dateFilters}) => {
  const [inputValue, setInputValue] = useState("");
  return (
    <>
      <Box className={style.header}>
        <Box className={style.leftside}>
          <div className={style.foldericon}>
            <InventoryIcon />
          </div>
          <Typography variant="h3">Activity Logs</Typography>
        </Box>
        <Box className={style.rightside}>
          <Typography variant="h5" className={style.itemtitle}>
            {histories?.length || "0"} Items
          </Typography>
        </Box>
      </Box>
      <FiltersBlock sideClassName={style.side} className={style.filter_block}>
        <Select
          inputValue={inputValue}
          onInputChange={(newInputValue, {action}) => {
            setInputValue(newInputValue);
          }}
          options={[
            {label: "text", value: "re"},
            {label: "jo", value: "re"},
          ]}
          menuPortalTarget={document.body}
          isClearable
          isSearchable
          isDisabled
          components={{
            // ClearIndicator: () =>
            //     inputValue?.length && (
            //         <div
            //             style={{
            //                 marginRight: "10px",
            //                 cursor: "pointer",
            //             }}
            //             onClick={(e) => {
            //                 e.stopPropagation();
            //             }}
            //         >
            //             <ClearIcon />
            //         </div>
            //     ),
            DropdownIndicator: null,
          }}
          onChange={(newValue, {action}) => {
            //   changeHandler(newValue);
          }}
          menuShouldScrollIntoView
          styles={customStyles}
          onPaste={(e) => {
            console.log("eeeeeee -", e.clipboardData.getData("Text"));
          }}
          isOptionSelected={(option, value) =>
            value.some((val) => val.guid === value)
          }
          blurInputOnSelect
        />
        <CRangePickerNew
          onChange={setDateFilters}
          value={dateFilters}
          isClearable={false}
        />
      </FiltersBlock>
    </>
  );
};

export default ActivityFeedHeader;
