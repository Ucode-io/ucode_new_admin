import {Box, TableCell, TableRow} from "@mui/material";

const actionTypeStyles = {
  post: {
    background: "#49CB90",
  },
  get: {
    background: "#61affe",
  },
  delete: {
    background: "#f93e3e",
  },
  put: {
    background: "#fca130",
  },
};

const QueryLogBody = ({row, tableStyles, handleRowClick}) => {
  const actionTypeStyle =
    actionTypeStyles[row.request?.action_type.toLowerCase()] || {};
  return (
    <>
      <TableRow
        sx={{cursor: "pointer"}}
        key={row.id}
        onClick={() => handleRowClick(row)}
      >
        <TableCell
          key={row.id}
          align={row.align}
          component="th"
          scope="row"
          sx={{
            ...tableStyles,
          }}
        >
          <Box
            sx={{
              ...actionTypeStyle,
              width: "80px",
              height: "33px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "3px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {row.request?.action_type}
          </Box>
        </TableCell>
        <TableCell
          sx={{
            ...tableStyles,
          }}
          align="right"
        >
          {row.response?.length > 10
            ? `${row?.response?.substring(0, 25)}...`
            : row?.response}
        </TableCell>
        <TableCell
          sx={{
            ...tableStyles,
          }}
          align="right"
        >
          {row.user_data?.login ??
            row?.user_data?.email ??
            row?.user_data?.phone ??
            row?.user_data?.name}
        </TableCell>
        <TableCell
          sx={{
            ...tableStyles,
          }}
          align="right"
        >
          {row?.duration} s
        </TableCell>
      </TableRow>
    </>
  );
};

export default QueryLogBody;
