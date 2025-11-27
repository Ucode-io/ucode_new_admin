import React, {useState, useMemo, useEffect} from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Pagination,
} from "@mui/material";
import {useQuery} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import {format} from "date-fns";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import billingService from "../../services/billingService";
import companyService from "../../services/companyService";
import {showAlert} from "../../store/alert/alert.thunk";
import {numberWithSpaces} from "../../utils/formatNumbers";
import {useForm} from "react-hook-form";
import HFSelect from "../../components/FormElements/HFSelect";
import HFSearchSelect from "../../components/FormElements/HFSearchSelect";
import HFTextField from "../../components/FormElements/HFTextField";

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

function TransactionsPage() {
  const dispatch = useDispatch();
  const project = useSelector((state) => state?.company?.projectItem);
  const userId = useSelector((state) => state?.auth?.userInfo?.id);

  const {data: transactions, refetch} = useQuery(
    ["GET_TRANSACTION_LIST", project],
    () => {
      return billingService.getTransactionList({
        all: true,
      });
    },
    {
      select: (res) => res?.transactions ?? [],
    }
  );

  const [loading, setLoading] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 15;

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      company_id: "",
      project_id: "",
      amount: "",
      description: "",
    },
  });

  const selectedCompanyId = watch("company_id");
  const [companySearchText, setCompanySearchText] = useState("");

  const {data: companiesData} = useQuery(
    ["GET_COMPANIES_LIST", companySearchText],
    () => {
      return companyService.getCompaniesList({
        search: companySearchText || undefined,
      });
    }
  );

  const companies = Array.isArray(companiesData)
    ? companiesData
    : (companiesData?.data ?? companiesData?.companies ?? []);

  const {data: projects = [], isLoading: projectsLoading} = useQuery(
    ["GET_COMPANY_PROJECTS", selectedCompanyId],
    () => companyService.getCompanyData(selectedCompanyId),
    {
      enabled: !!selectedCompanyId,
      select: (res) => res?.projects ?? [],
    }
  );

  const companyOptions = useMemo(() => {
    return companies?.map((company) => ({
      value: company.id,
      label: company.name,
    }));
  }, [companies]);

  const projectOptions = useMemo(() => {
    return projects?.map((project) => ({
      value: project.project_id,
      label: project.title || project.name,
    }));
  }, [projects]);

  useEffect(() => {
    if (selectedCompanyId) {
      setValue("project_id", "");
    }
  }, [selectedCompanyId, setValue]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    const computedData = {
      ...data,
      amount: Number(data.amount),
      creator_id: userId,
      creator_type: "system-user",
      currency_id: "0803582e-29d6-42fe-86ac-b4287b8fa929",
      payment_status: "accepted",
    };
    billingService
      .createTransaction(computedData)
      .then(() => {
        refetch();
        dispatch(showAlert("Transaction created successfully!", "success"));
        handleCloseModal();
      })
      .catch((error) => {
        dispatch(showAlert("Error creating transaction", "error"));
      });
    if (!data.company_id || !data.project_id) {
      dispatch(showAlert("Please select both company and project", "error"));
      return;
    }
  };

  const handleStatusUpdate = (values, status) => {
    const data = {
      id: values?.id,
      payment_status: status,
      acceptor_id: userId ?? "",
    };
    setLoading((prev) => ({...prev, [`${values.id}-${status}`]: true}));
    billingService
      .paymentStatusUpdate(data)
      .then(() => {
        refetch();
        const message =
          status === "accepted"
            ? "The Transaction is accepted!"
            : "The Transaction is cancelled!";
        const type = status === "accepted" ? "success" : "error";
        dispatch(showAlert(message, type));
      })
      .finally(() => {
        setLoading((prev) => ({...prev, [`${values.id}-${status}`]: false}));
      });
  };

  const filteredTransactions = useMemo(() => {
    if (!debouncedSearchQuery) return transactions;
    return transactions?.filter((transaction) =>
      transaction?.project_name
        ?.toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase())
    );
  }, [transactions, debouncedSearchQuery]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredTransactions?.slice(startIndex, endIndex) || [];
  }, [filteredTransactions, page, limit]);

  const totalCount = filteredTransactions?.length || 0;
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}>
        <Box></Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{
            backgroundColor: "#2563eb",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            padding: "12px 24px",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            "&:hover": {
              backgroundColor: "#1d4ed8",
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.4)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          }}>
          Add Transaction
        </Button>
      </Box>

      <Box sx={{marginBottom: "20px"}}>
        <TextField
          fullWidth
          placeholder="Search by project name..."
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
          height: "calc(100vh - 310px)",
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
                  borderRight: "1px solid #D5D7DA",
                  borderBottom: "1px solid #D5D7DA",
                }}>
                Project
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  borderRight: "1px solid #D5D7DA",
                  borderBottom: "1px solid #D5D7DA",
                  letterSpacing: "0.5px",
                }}>
                Amount
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  borderRight: "1px solid #D5D7DA",
                  borderBottom: "1px solid #D5D7DA",
                  letterSpacing: "0.5px",
                }}>
                Currency
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  borderRight: "1px solid #D5D7DA",
                  borderBottom: "1px solid #D5D7DA",
                  letterSpacing: "0.5px",
                }}>
                Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  borderRight: "1px solid #D5D7DA",
                  borderBottom: "1px solid #D5D7DA",
                  letterSpacing: "0.5px",
                }}>
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  borderRight: "1px solid #D5D7DA",
                  borderBottom: "1px solid #D5D7DA",
                  letterSpacing: "0.5px",
                }}>
                Fare
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  borderRight: "1px solid #D5D7DA",
                  borderBottom: "1px solid #D5D7DA",
                  letterSpacing: "0.5px",
                }}>
                Type
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #D5D7DA",
                  letterSpacing: "0.5px",
                }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Boolean(paginatedTransactions?.length) ? (
              paginatedTransactions?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
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
                      borderRight: "1px solid #D5D7DA",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    {row?.project_name ?? "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#0f172a",
                      padding: "16px",
                      borderRight: "1px solid #D5D7DA",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    {numberWithSpaces(row?.amount)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#64748b",
                      padding: "16px",
                      textAlign: "center",
                      borderRight: "1px solid #D5D7DA",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    <Chip
                      label={row?.currency?.code || "N/A"}
                      size="small"
                      sx={{
                        backgroundColor: "#e0e7ff",
                        color: "#4338ca",
                        fontWeight: 600,
                        fontSize: "12px",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "13px",
                      color: "#64748b",
                      padding: "16px",
                      borderRight: "1px solid #D5D7DA",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    {format(new Date(row?.created_at), "dd MMM yyyy")}
                    <br />
                    <Typography variant="caption" sx={{color: "#94a3b8"}}>
                      {format(new Date(row?.created_at), "HH:mm")}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "16px",
                      textAlign: "center",
                      borderRight: "1px solid #D5D7DA",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    {row?.payment_status === "accepted" ? (
                      <Chip
                        icon={
                          <CheckCircleIcon sx={{fontSize: "16px !important"}} />
                        }
                        label="Paid"
                        size="small"
                        sx={{
                          backgroundColor: "#dcfce7",
                          color: "#166534",
                          fontWeight: 600,
                          fontSize: "12px",
                          "& .MuiChip-icon": {
                            color: "#16a34a",
                          },
                        }}
                      />
                    ) : row?.payment_status === "cancelled" ? (
                      <Chip
                        icon={<CancelIcon sx={{fontSize: "16px !important"}} />}
                        label="Cancelled"
                        size="small"
                        sx={{
                          backgroundColor: "#fee2e2",
                          color: "#991b1b",
                          fontWeight: 600,
                          fontSize: "12px",
                          "& .MuiChip-icon": {
                            color: "#dc2626",
                          },
                        }}
                      />
                    ) : (
                      <Chip
                        icon={
                          <PendingIcon sx={{fontSize: "16px !important"}} />
                        }
                        label="Pending"
                        size="small"
                        sx={{
                          backgroundColor: "#fef3c7",
                          color: "#92400e",
                          fontWeight: 600,
                          fontSize: "12px",
                          "& .MuiChip-icon": {
                            color: "#f59e0b",
                          },
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#64748b",
                      padding: "16px",
                      textAlign: "center",
                      borderRight: "1px solid #D5D7DA",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    {row?.fare?.name || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "16px",
                      textAlign: "center",
                      borderRight: "1px solid #D5D7DA",
                      borderBottom: "1px solid #D5D7DA",
                    }}>
                    <Chip
                      label={row?.transaction_type || "N/A"}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "#cbd5e1",
                        color: "#475569",
                        fontSize: "12px",
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{padding: "16px", borderBottom: "1px solid #D5D7DA"}}>
                    {row?.payment_status === "pending" ? (
                      <Box
                        sx={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                        }}>
                        <Tooltip title="Cancel Transaction">
                          <IconButton
                            onClick={() => handleStatusUpdate(row, "cancelled")}
                            disabled={loading[`${row.id}-cancelled`]}
                            sx={{
                              color: "#ef4444",
                              backgroundColor: "#fee2e2",
                              "&:hover": {
                                backgroundColor: "#fecaca",
                              },
                              width: "36px",
                              height: "36px",
                            }}>
                            {loading[`${row.id}-cancelled`] ? (
                              <CircularProgress
                                size={18}
                                sx={{color: "#ef4444"}}
                              />
                            ) : (
                              <CancelIcon sx={{fontSize: "18px"}} />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Accept Transaction">
                          <IconButton
                            onClick={() => handleStatusUpdate(row, "accepted")}
                            disabled={loading[`${row.id}-accepted`]}
                            sx={{
                              color: "#10b981",
                              backgroundColor: "#dcfce7",
                              "&:hover": {
                                backgroundColor: "#bbf7d0",
                              },
                              width: "36px",
                              height: "36px",
                            }}>
                            {loading[`${row.id}-accepted`] ? (
                              <CircularProgress
                                size={18}
                                sx={{color: "#10b981"}}
                              />
                            ) : (
                              <CheckCircleIcon sx={{fontSize: "18px"}} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Tooltip title="View Details">
                        <IconButton
                          sx={{
                            color: "#64748b",
                            "&:hover": {
                              backgroundColor: "#f1f5f9",
                              color: "#2563eb",
                            },
                          }}></IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
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
                        No transactions found for "{searchQuery}"
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
                        No transactions are found.
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
            {totalCount} transactions
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

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "8px",
          },
        }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle
            sx={{
              fontWeight: 700,
              fontSize: "24px",
              color: "#1e293b",
              paddingBottom: "8px",
            }}>
            Add New Transaction
          </DialogTitle>
          <DialogContent sx={{paddingTop: "16px"}}>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                marginBottom: "24px",
              }}>
              Fill in the details to create a new transaction
            </Typography>

            <Box sx={{marginBottom: "24px"}}>
              <HFSearchSelect
                height="48px"
                control={control}
                name="company_id"
                label="Company"
                placeholder="Select a company"
                options={companyOptions}
                required={true}
                isClearable={false}
                searchPlaceholder="Search companies..."
                fetchOptions={(params) => {
                  setCompanySearchText(params.searchText || "");
                }}
              />
            </Box>

            <Box sx={{marginBottom: "24px"}}>
              <HFSelect
                height="48px"
                control={control}
                name="project_id"
                placeholder={
                  selectedCompanyId
                    ? projectsLoading
                      ? "Loading projects..."
                      : "Select a project"
                    : "Select a company first"
                }
                options={projectOptions}
                required={true}
                disabled={!selectedCompanyId || projectsLoading}
                isClearable={false}
              />
            </Box>

            <Box sx={{marginBottom: "24px"}}>
              <HFTextField
                inputHeight="40px"
                control={control}
                name="amount"
                placeholder="Enter amount"
                type="number"
                required={true}
                fullWidth
              />
            </Box>

            <Box sx={{marginBottom: "24px"}}>
              <HFSelect
                height="48px"
                control={control}
                name="transaction_type"
                placeholder={
                  selectedCompanyId
                    ? projectsLoading
                      ? "Loading projects..."
                      : "Select a project"
                    : "Select a company first"
                }
                options={[
                  {
                    label: "Top up",
                    value: "topup",
                  },
                  {
                    label: "Subscription",
                    value: "Subscription",
                  },
                ]}
                required={true}
                disabled={!selectedCompanyId || projectsLoading}
                isClearable={false}
              />
            </Box>

            <Box sx={{marginBottom: "24px"}}>
              <HFSelect
                height="48px"
                defaultValue={"Bank"}
                control={control}
                name="payment_type"
                placeholder={
                  selectedCompanyId
                    ? projectsLoading
                      ? "Loading projects..."
                      : "Select a project"
                    : "Select a company first"
                }
                options={[
                  {
                    label: "Bank",
                    value: "Bank",
                  },
                  {
                    label: "Payme",
                    value: "Payme",
                  },
                  {
                    label: "Stripe",
                    value: "Stripe",
                  },
                ]}
                required={true}
                disabled={!selectedCompanyId || projectsLoading}
                isClearable={false}
              />
            </Box>

            <Box>
              <HFTextField
                inputHeight="40px"
                control={control}
                name="comment"
                placeholder="Enter transaction comment"
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{padding: "16px 24px"}}>
            <Button
              onClick={handleCloseModal}
              type="button"
              variant="outlined"
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                padding: "8px 20px",
                color: "#64748b",
                borderColor: "#e2e8f0",
                "&:hover": {
                  borderColor: "#cbd5e1",
                  backgroundColor: "#f8fafc",
                },
              }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                padding: "8px 20px",
                backgroundColor: "#2563eb",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
                },
                "&:disabled": {
                  backgroundColor: "#cbd5e1",
                  color: "#94a3b8",
                },
              }}>
              Create Transaction
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default TransactionsPage;
