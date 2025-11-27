import BackupTableIcon from "@mui/icons-material/BackupTable";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Pagination,
  Typography,
} from "@mui/material";
import {format} from "date-fns";
import React, {useState, useMemo, useEffect} from "react";
import {useQuery} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import billingService from "../../services/billingService";
import {faresActions} from "../../store/fares/fares.slice";
import {numberWithSpaces} from "../../utils/formatNumbers";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function FaresPage() {
  const project = useSelector((state) => state?.company?.projectItem);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 15;

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {data: fares, refetch} = useQuery(
    ["GET_TRANSACTION_LIST", project],
    () => {
      return billingService.getFaresList();
    },
    {
      select: (res) => res?.fares ?? [],
      onSuccess: (data) => dispatch(faresActions.setFares(data)),
    }
  );

  const filteredFares = useMemo(() => {
    if (!debouncedSearchQuery) return fares;
    return fares?.filter((fare) =>
      fare?.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [fares, debouncedSearchQuery]);

  const paginatedFares = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredFares?.slice(startIndex, endIndex) || [];
  }, [filteredFares, page, limit]);

  const totalCount = filteredFares?.length || 0;
  const totalPages = Math.ceil(totalCount / limit);
  const offset = (page - 1) * limit;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      setPage(1);
    }
  }, [debouncedSearchQuery]);

  return (
    <Box
      id={"billingTable"}
      sx={{
        padding: "80px 24px 14px 24px",
        backgroundColor: "#fff",
        height: "calc(100vh - 24px)",
      }}>
      <Box sx={{marginBottom: "20px"}}>
        <TextField
          fullWidth
          placeholder="Search fares by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{color: "#64748b"}} />
              </InputAdornment>
            ),
            sx: {
              height: "46px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              "& .MuiInputBase-input": {
                padding: "12px 14px",
                height: "46px",
                boxSizing: "border-box",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e2e8f0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#cbd5e1",
              },
              "&.Mui-focused": {
                backgroundColor: "transparent",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2563eb",
              },
            },
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #D5D7DA",
          borderRadius: "12px",
          boxShadow: "none",
          height: "calc(100vh - 160px)",
          overflow: "auto",
        }}>
        <Table
          stickyHeader
          sx={{
            position: "relative",
            borderCollapse: "separate",
            borderSpacing: 0,
          }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid #D5D7DA",
                }}>
                Fare name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid #D5D7DA",
                }}>
                Description
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid #D5D7DA",
                }}>
                Price
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid #D5D7DA",
                }}>
                Currency
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  letterSpacing: "0.5px",
                  borderBottom: "1px solid #D5D7DA",
                }}>
                Disactivate day
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Boolean(paginatedFares?.length) ? (
              paginatedFares?.map((row, index) => (
                <TableRow
                  onClick={() =>
                    navigate(`/main/fares/${row?.id}/${row?.name}`)
                  }
                  key={index}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f8fafc !important",
                    },
                    transition: "all 0.2s ease",
                    "&:last-child td": {
                      borderBottom: "none",
                    },
                  }}>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1e293b",
                      padding: "16px",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    {row?.name ?? ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#64748b",
                      padding: "16px",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    {row?.description}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#0f172a",
                      padding: "16px",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    {numberWithSpaces(row?.price ?? 0)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#64748b",
                      padding: "16px",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    {row?.currency?.toUpperCase()}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "13px",
                      color: "#64748b",
                      padding: "16px",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    {format(new Date(), "dd MMM yyyy")}
                    <br />
                    <Typography variant="caption" sx={{color: "#94a3b8"}}>
                      {format(new Date(), "HH:mm")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "400px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      fontSize: "18px",
                      color: "#64748b",
                    }}>
                    {searchQuery ? (
                      <>
                        No fares found for "{searchQuery}"
                        <Box sx={{marginTop: "12px"}}>
                          <BackupTableIcon
                            style={{
                              width: "50px",
                              height: "50px",
                              color: "#94a3b8",
                            }}
                          />
                        </Box>
                      </>
                    ) : (
                      <>
                        No fares are found.
                        <Box sx={{marginTop: "12px"}}>
                          <BackupTableIcon
                            style={{
                              width: "50px",
                              height: "50px",
                              color: "#94a3b8",
                            }}
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box
          sx={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
            backgroundColor: "#ffffff",
          }}>
          <Typography variant="body2" sx={{color: "#64748b"}}>
            Showing {offset + 1} to {Math.min(offset + limit, totalCount)} of{" "}
            {totalCount} fares
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "8px",
                fontWeight: 500,
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#2563eb",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default FaresPage;
