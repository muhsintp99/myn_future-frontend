import React from 'react';
import { Drawer, Typography, Box, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { viewDrawerStyles } from '../../../assets/style/commen';
import { format } from 'date-fns';

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

const View = ({ open, onClose, data }) => {
  const safeData = data && typeof data === 'object' ? data : {};

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { sm: '50%', md: '30%' } } }}
    >
      <Box sx={viewDrawerStyles.mainBox}>
        <Box sx={viewDrawerStyles.head}>
          <IconButton onClick={onClose} sx={viewDrawerStyles.closeButton}>
            <CloseIcon />
          </IconButton>
          <Grid sx={viewDrawerStyles.headContent}>
            <Typography sx={viewDrawerStyles.drawerTitle}>
              Place Details
            </Typography>
          </Grid>
        </Box>

        {Object.keys(safeData).length > 0 ? (
          <Grid container sx={viewDrawerStyles.dataContainer} mt={2}>
            {/* Left Side */}
            <Grid item xs={12} md={6}>
              <Box mb={2} sx={viewDrawerStyles.dataItem}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}>
                    <strong>Place Name</strong>
                  </Typography>
                  <Typography sx={viewDrawerStyles.value}>
                    {capitalize(safeData.name)}
                  </Typography>
                </Box>
              </Box>

              <Box mb={2} sx={viewDrawerStyles.dataItem}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}>
                    <strong>Country</strong>
                  </Typography>
                  <Typography sx={viewDrawerStyles.value}>
                    {capitalize(safeData.country?.name) || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box mb={2} sx={viewDrawerStyles.dataItem}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}>
                    <strong>Recommended</strong>
                  </Typography>
                  <Typography sx={viewDrawerStyles.value}>
                    {safeData.recommend ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Side */}
            <Grid item xs={12} md={6}>
              <Box mb={2} sx={viewDrawerStyles.dataItem}>
                <ArrowRightIcon fontSize="small" />
                <Box>
                  <Typography sx={viewDrawerStyles.label}>
                    <strong>Created At</strong>
                  </Typography>
                  <Typography sx={viewDrawerStyles.value}>
                    {safeData.createdAt
                      ? format(new Date(safeData.createdAt), 'MM/dd/yyyy')
                      : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography sx={{ p: 2 }}>No data available</Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default View;
