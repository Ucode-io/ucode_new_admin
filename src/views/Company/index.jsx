import React, {useState, useEffect} from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Pagination,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import {useQuery} from "react-query";
import {useSelector} from "react-redux";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import SearchIcon from "@mui/icons-material/Search";
import {useNavigate} from "react-router-dom";
import companyService from "../../services/companyService";

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

function CompanyPage() {
  const navigate = useNavigate();
  const project = useSelector((state) => state?.company?.projectItem);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 15;
  const offset = (page - 1) * limit;

  // Debounce search query with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {data: companiesData, refetch} = useQuery(
    ["GET_COMPANIES_LIST", project, page, offset, limit, debouncedSearchQuery],
    () => {
      return companyService.getCompaniesList({
        limit,
        offset,
        search: debouncedSearchQuery || undefined,
      });
    },
    {
      keepPreviousData: true,
    }
  );

  const companies = companiesData?.companies ?? [];
  const totalCount = companiesData?.count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  useEffect(() => {
    if (searchQuery) {
      setPage(1);
    }
  }, [debouncedSearchQuery]);

  return (
    <Box
      id={"billingTable"}
      sx={{
        padding: "80px 24px 24px 24px",
        backgroundColor: "#f8fafc",
        height: "calc(100vh - 464px)",
      }}>
      <Box sx={{marginBottom: "20px"}}>
        <TextField
          fullWidth
          placeholder="Search companies by name..."
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
          height: "calc(100vh - 250px)",
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
                Company name
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Boolean(companies?.length) ? (
              companies?.map((row, index) => (
                <TableRow
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
                    onClick={() =>
                      navigate(`/main/company/${row?.id}/${row?.name}`)
                    }
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1e293b",
                      padding: "16px",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    {row?.name}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>
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
                        No companies found for "{searchQuery}"
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
                        No companies are found.
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
            {totalCount} companies
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

export default CompanyPage;
