import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import FormatDate from '../../../utils/defult/FormatDate';

const DetailRow = ({ label, value, isMobile }) => (
  <TableRow>
    <TableCell
      component="th"
      scope="row"
      sx={{
        fontWeight: 'bold',
        width: isMobile ? '35%' : '25%',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      {label}
    </TableCell>
    <TableCell sx={{ wordBreak: 'break-word' }}>{value || 'N/A'}</TableCell>
  </TableRow>
);

const View = ({ open, onClose, data }) => {
  const { loading, error } = useSelector((state) => state.enquiries);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="view-enquiry-dialog-title"
      PaperProps={{
        sx: {
          margin: isMobile ? 1 : 3,
          maxHeight: '90vh',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle id="view-enquiry-dialog-title">
        Enquiry Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: isMobile ? 2 : 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : data ? (
          <Box>
            {/* Quick Info Card */}
            <Card sx={{ mb: 3, backgroundColor: theme.palette.grey[50] }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Enquiry No
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {data.enqNo || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="h6">
                      {data.fName || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Phone
                    </Typography>
                    <Typography
                      component="a"
                      href={data.mobile ? `tel:${data.mobile}` : '#'}
                      variant="h6"
                      sx={{
                        color: data.mobile ? 'primary.main' : 'text.primary',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: data.mobile ? 'underline' : 'none' },
                      }}
                    >
                      {data.mobile || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Email
                    </Typography>
                    <Typography
                      component="a"
                      href={data.email ? `mailto:${data.email}` : '#'}
                      variant="h6"
                      sx={{
                        color: data.email ? 'primary.main' : 'text.primary',
                        wordBreak: 'break-word',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: data.email ? 'underline' : 'none' },
                      }}
                    >
                      {data.email || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Divider sx={{ mb: 2 }} />

            {/* Detailed Table */}
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableBody>
                  <DetailRow label="Location" value={data.location} isMobile={isMobile} />
                  <DetailRow
                    label="Lead Quality"
                    value={<Chip label={data.leadQuality || 'N/A'} color="info" />}
                    isMobile={isMobile}
                  />
                  <DetailRow label="Category" value={data.category} isMobile={isMobile} />

                  {/* ✅ Show Populated Course Title & School Name */}
                  <DetailRow
                    label="Course"
                    value={data.course?.title || 'N/A'}
                    isMobile={isMobile}
                  />
                  <DetailRow
                    label="College / School"
                    value={data.school?.name || 'N/A'}
                    isMobile={isMobile}
                  />

                  <DetailRow label="Enquiry Description" value={data.enqDescp} isMobile={isMobile} />
                  <DetailRow label="Remarks" value={data.remarks} isMobile={isMobile} />
                  <DetailRow
                    label="Status"
                    value={<Chip label={data.status || 'N/A'} color={data.status === 'active' ? 'success' : 'default'} />}
                    isMobile={isMobile}
                  />
                  
                  <DetailRow label="Time" value={FormatDate(data.createdAt)} isMobile={isMobile} />
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography>No data available</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default View;