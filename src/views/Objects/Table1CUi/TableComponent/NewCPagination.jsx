import React, {useRef} from "react";
import styles from "./style.module.scss";
import CSelect from "../../../../components/CSelect";
import {Pagination, PaginationItem, Stack} from "@mui/material";

function CPagination({
  limit = 10,
  setLimit = () => {},
  count,
  setOffset,
  offset,
  folderIds,
}) {
  const userRef = useRef();
  const options = [
    {value: "all", label: "All"},
    {value: 10, label: 10},
    {value: 15, label: 15},
    {value: 20, label: 20},
    {value: 25, label: 25},
    {value: 30, label: 30},
    {value: 35, label: 35},
    {value: 40, label: 40},
  ];

  const getLimitValue = (item) => {
    setLimit(item);
    setOffset(0);
  };

  const currentPage = Math.floor(offset / limit) + 1;

  const handlePageChange = (event, value) => {
    const newOffset = (value - 1) * limit;
    setOffset(newOffset);
  };

  return (
    <div className={styles.tableFooter}>
      {!folderIds?.length && (
        <div className={styles.selectLimit}>
          <p> Показать по</p>
          <div className={styles.limitSide}>
            <CSelect
              options={options}
              disabledHelperText
              size="small"
              value={limit}
              onChange={(e) => getLimitValue(e.target.value)}
              inputProps={{style: {borderRadius: 50}}}
              endAdornment={null}
              sx={null}
            />
          </div>
        </div>
      )}

      <div className={styles.cpagination}>
        <Stack spacing={2}>
          {!folderIds?.length && (
            <Pagination
              ref={userRef}
              onChange={handlePageChange}
              count={Math.ceil(count / limit)}
              page={currentPage}
              shape="rounded"
              renderItem={(item) => {
                if (item.type === "previous") {
                  return (
                    <button
                      className={styles.paginationBtn}
                      onClick={() => setOffset(offset - limit)}
                      disabled={currentPage === 1}>
                      Previous
                    </button>
                  );
                } else if (item.type === "next") {
                  return (
                    <button
                      className={styles.paginationBtn}
                      onClick={() => setOffset(offset + limit)}
                      disabled={currentPage === Math.ceil(count / limit)}>
                      Next
                    </button>
                  );
                } else {
                  return (
                    <PaginationItem
                      {...item}
                      selected={item.page === currentPage}
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#F9FAFB",
                          fontWeight: "bold",
                        },
                      }}
                    />
                  );
                }
              }}
            />
          )}
        </Stack>
      </div>
    </div>
  );
}

export default CPagination;
