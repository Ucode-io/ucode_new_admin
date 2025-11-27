import BackupTableIcon from "@mui/icons-material/BackupTable";
import HomeIcon from "@mui/icons-material/Home";
import {
  Box,
  Breadcrumbs,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import React, {useState} from "react";
import {useQuery} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import billingService from "../../services/billingService";
import companyService from "../../services/companyService";
import {showAlert} from "../../store/alert/alert.thunk";
import {numberWithSpaces} from "../../utils/formatNumbers";
import DatePicker from "react-datepicker";
import {format, parse, parseISO} from "date-fns";

function CompanyDetailPage() {
  const {id, name} = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    projectId: null,
    date: null,
  });
  const project = useSelector((state) => state?.company?.projectItem);
  const userId = useSelector((state) => state?.auth?.userId);

  const {data: projects, refetch} = useQuery(
    ["GET_TRANSACTION_LIST", project],
    () => {
      return companyService.getCompanyData(id);
    },
    {
      select: (res) => res?.projects ?? [],
    }
  );

  const [loading, setLoading] = useState({});

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

  const handleDateChange = (projectId, date) => {
    setDatePickerOpen(false);
    setConfirmModal({
      open: true,
      projectId,
      date,
    });
  };

  const handleConfirmDateChange = () => {
    const {projectId, date} = confirmModal;
    const formattedDate = format(date, "yyyy-MM-dd");

    billingService
      .makeDateProject({
        project_id: projectId,
        end_date: formattedDate,
      })
      .then(() => {
        refetch();
        dispatch(
          showAlert(
            "The project date has been updated successfully!",
            "success"
          )
        );
        setStartDate(date);
        setConfirmModal({open: false, projectId: null, date: null});
      })
      .catch((error) => {
        console.error("Error updating project date:", error);
        dispatch(
          showAlert(
            "Failed to update the project date. Please try again.",
            "error"
          )
        );
        setConfirmModal({open: false, projectId: null, date: null});
      });
  };

  const handleCancelDateChange = () => {
    setConfirmModal({open: false, projectId: null, date: null});
  };

  console.log("startDate=======>", projects);
  return (
    <Box id={"billingTable"} sx={{padding: "64px 0px 0 0px"}}>
      <Box sx={{padding: "20px"}}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            underline="hover"
            color="inherit"
            href="/main/dashboard">
            <HomeIcon />
          </Link>
          <Link underline="hover" color="inherit" href="/main/company">
            Companies
          </Link>
          <Typography sx={{color: "text.primary"}}>{name}</Typography>
        </Breadcrumbs>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 1,
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
          height: "calc(100vh - 64px)",
        }}>
        <Table stickyHeader sx={{position: "relative"}}>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: "bold", fontSize: "14px"}}>
                Project name
              </TableCell>
              <TableCell sx={{fontWeight: "bold", fontSize: "14px"}}>
                Fare
              </TableCell>
              <TableCell sx={{fontWeight: "bold", fontSize: "14px"}}>
                Status
              </TableCell>
              <TableCell sx={{fontWeight: "bold", fontSize: "14px"}}>
                Balance
              </TableCell>
              <TableCell sx={{fontWeight: "bold", fontSize: "14px"}}>
                Credit limit
              </TableCell>
              <TableCell sx={{fontWeight: "bold", fontSize: "14px"}}>
                Project Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Boolean(projects?.length) ? (
              projects?.map((row, index) => (
                <TableRow
                  onClick={() => navigate(`/main/company/${row?.id}`)}
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": {backgroundColor: "#f9f9f9"},
                  }}>
                  <TableCell sx={{fontSize: "14px"}}>{row?.title}</TableCell>
                  <TableCell sx={{fontSize: "14px"}}>
                    {row?.fare?.name ?? ""}
                  </TableCell>
                  <TableCell sx={{fontSize: "14px"}}>
                    {row?.status ?? ""}
                  </TableCell>
                  <TableCell sx={{fontSize: "14px"}}>
                    {numberWithSpaces(row?.balance ?? 0)}
                  </TableCell>

                  <TableCell width={"200px"}>
                    {numberWithSpaces(row?.credit_limit ?? 0)}
                  </TableCell>
                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                    sx={{fontSize: "14px"}}>
                    <DatePicker
                      selected={
                        startDate ||
                        parse(row?.expire_date, "yyyy-MM-dd", new Date())
                      }
                      open={datePickerOpen}
                      onInputClick={() => setDatePickerOpen(true)}
                      onClickOutside={() => setDatePickerOpen(false)}
                      onChange={(date) => {
                        handleDateChange(row?.project_id, date);
                      }}
                      dateFormat="MMM dd, yyyy"
                      customInput={
                        <input
                          style={{
                            border: "none",
                            outline: "none",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            cursor: "pointer",
                            padding: "8px 12px",
                            backgroundColor: "transparent",
                            color: "rgba(0, 0, 0, 0.87)",
                            width: "100%",
                          }}
                        />
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "400px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  fontSize: "20px",
                }}>
                No transactions are found.
                <Box sx={{marginTop: "12px"}}>
                  <BackupTableIcon style={{width: "50px", height: "50px"}} />
                </Box>
              </Box>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={confirmModal.open}
        onClose={handleCancelDateChange}
        maxWidth="sm"
        fullWidth>
        <DialogTitle sx={{fontWeight: "bold"}}>
          Confirm Project Extension
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{paddingTop: "8px"}}>
            Your project will be extended until{" "}
            <strong>
              {confirmModal.date
                ? format(confirmModal.date, "MMMM dd, yyyy")
                : " "}
            </strong>
          </Typography>
          <Typography variant="body1" sx={{paddingTop: "8px"}}>
            Are you sure you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions sx={{padding: "16px 24px"}}>
          <Button
            onClick={handleCancelDateChange}
            variant="outlined"
            color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDateChange}
            variant="contained"
            color="primary"
            autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CompanyDetailPage;
