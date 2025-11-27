import { CopyAll } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import React from 'react';


const AllowList = () => {
  return (
    <Box sx={{width: '250px', padding: '15px'}}>
      <Box p={2} sx={{ border: '1px solid #e5e9eb', backgroundColor: '#F6F8F9', borderRadius: 'md'}}>
        <Typography variant="h6" fontSize="16px">
          Allowlisting
        </Typography>
        <Typography>
          Please allow us to connect to your database by allowing our IP addresses:
        </Typography>

        <Grid mt={1} container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <Grid style={{paddingTop: '0px'}} item xs={12} key={item}>
              <Typography >
                21.651.6513651.51
                <Button>
                  <CopyAll />
                </Button>
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default AllowList;
