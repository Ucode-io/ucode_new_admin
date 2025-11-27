import {Box, Fade, Menu, TextField} from "@mui/material";
import {useMemo, useState} from "react";
import styles from "./style.module.scss";
import useDebounce from "../../../../../hooks/useDebounce";
import {useDispatch} from "react-redux";
import {filterActions} from "../../../../../store/filter/filter.slice";
import {useParams} from "react-router-dom";

const FilterAutoComplete = ({
  options = [],
  searchText,
  setSearchText,
  localCheckedValues,
  value = [],
  onChange = () => {},
  label,
  field,
  view,
}) => {
  const {tableSlug} = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const computedValue = useMemo(() => {
    return value
      ?.map((el) => options?.find((option) => option.value === el))
      .filter((el) => el);
  }, [value, options]);

  const inputChangeHandler = useDebounce((val) => {
    setSearchText(val.target.value);
  }, 300);

  const closeMenu = () => {
    setAnchorEl(null);
    setSearchText("");
  };

  const rowClickHandler = (option) => {
    handleClose();
    if (value?.includes(option.value)) {
      onChange(value.filter((item) => item !== option.value));
    } else {
      onChange([...value, option.value]);
    }
  };

  const clearFilter = (e) => {
    e.stopPropagation();
    dispatch(
      filterActions.removeFromList({
        tableSlug,
        viewId: view.id,
        name: field?.slug,
      })
    );
  };

  return (
    <div className={styles.autocomplete}>
      {value?.length === 0 ? (
        <div onClick={handleClick} className={styles.filterListItem}>
          <p>{field?.label}</p>
          {/* <img src="/img/plus.svg" alt="" /> */}
        </div>
      ) : (
        <div onClick={handleClick} className={styles.filterListItemActive}>
          <p className={styles.filterLabel}>{field?.label}</p>
          <p className={styles.filterCount}>{value?.length}</p>
          <button onClick={clearFilter} className={styles.addFilter}>
            <img src="/img/x_close.svg" alt="" />
          </button>
        </div>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        TransitionComponent={Fade}
        onClose={handleClose}
        classes={{list: styles.menu, paper: styles.paper}}>
        <Box className={styles.menuBox} sx={{minWidth: "326px"}}>
          <div className={styles.searchBox}>
            <button className={styles.searchBtn}>
              <img src="/img/search_icon.svg" alt="" />
            </button>
            <TextField
              variant="outlined"
              placeholder="Поиск"
              onChange={inputChangeHandler}
              fullWidth
              InputProps={{
                sx: {
                  height: "44px",
                  padding: 0,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  padding: "0 10px",
                  "& fieldset": {
                    border: "none",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "15px 15px 15px 0px",
                },
              }}
            />
          </div>
          {field?.type === "SINGLE_LINE" ? (
            <div className={styles.menuItemsSingle}>
              {options?.map((filter, index) => (
                <div
                  className={styles.menuItem}
                  key={index}
                  onClick={() => {
                    rowClickHandler(filter);
                  }}>
                  {filter?.label}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.menuItems}>
              {options?.map((filter, index) => (
                <div
                  className={styles.menuItem}
                  key={index}
                  onClick={() => {
                    rowClickHandler(filter);
                  }}>
                  {filter?.label}
                </div>
              ))}
            </div>
          )}
        </Box>
      </Menu>
    </div>
  );
};

export default FilterAutoComplete;
