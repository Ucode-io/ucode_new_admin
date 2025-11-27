import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import {useSelector} from "react-redux";
import {Fragment} from "react";

const FaresPricesItem = () => {
  const {id, name} = useParams();
  const navigate = useNavigate();
  const faresItem = useSelector((state) =>
    state?.fares?.fares.find((el) => el?.id === id)
  );

  return (
    <Box sx={{padding: "64px 0 0 0"}}>
      <Box sx={{padding: "20px", display: "flex", alignItems: "center"}}>
        <Breadcrumbs
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="breadcrumb">
          <Link
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            underline="hover"
            color="inherit"
            href="/">
            <HomeIcon style={{width: "24px"}} />
          </Link>
          <Link underline="hover" color="inherit" href="/main/fares">
            Fares
          </Link>
          <Typography sx={{color: "text.primary"}}>Plan: {name}</Typography>
        </Breadcrumbs>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {faresItem?.fare_item_prices?.length ? (
              faresItem?.fare_item_prices?.map((section) => (
                <Fragment key={section.title}>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          padding: "8px 0",
                          fontSize: "14px",
                        }}>
                        {section?.fare_item?.name}
                      </Typography>
                    </TableCell>

                    <TableCell colSpan={2}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          padding: "8px 0",
                          fontSize: "14px",
                        }}>
                        {section?.value}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))
            ) : (
              <Box
                sx={{
                  height: "calc(100vh - 128px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexDirection: "column",
                }}>
                No info available
                <Button
                  onClick={() => navigate(-1)}
                  sx={{marginTop: "12px"}}
                  variant="outlined">
                  Return to fares
                </Button>
              </Box>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FaresPricesItem;
