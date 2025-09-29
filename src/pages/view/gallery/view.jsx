import React from 'react';
import {
  Drawer,
  Typography,
  Box,
  IconButton,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { viewDrawerStyles } from '../../../assets/style/commen';

const View = ({ open, onClose, data }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { sm: '50%', md: '30%' }
        },
      }}
    >
      <Box sx={viewDrawerStyles.mainBox}>
        <Box sx={viewDrawerStyles.head}>
          <IconButton onClick={onClose} sx={viewDrawerStyles.closeButton}>
            <CloseIcon />
          </IconButton>
          <Grid sx={viewDrawerStyles.headContent}>
            <Typography sx={viewDrawerStyles.drawerTitle}>Gallery Details</Typography>
          </Grid>
        </Box>

        {data && data.image ? (
          <Grid container sx={viewDrawerStyles.dataContainer} mt={2}>
            <Grid item xs={12}>
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Image</strong></Typography>
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={data.image}
                      alt={`Gallery Image`}
                      style={{ maxWidth: '200px', maxHeight: '160px', borderRadius: '4px', marginTop: '4px' }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box mb={2} style={{ display: 'flex' }}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}><strong>Created At</strong></Typography>
                  <Typography sx={viewDrawerStyles.value}>
                    {data.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography>No data available</Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default View;