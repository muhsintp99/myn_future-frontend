import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addGallery,
  deleteGallery,
  getGalleries,
  getGalleryById,
  updateGallery
} from '../../container/gallery/slice';
import {
  Typography,
  Box,
  useMediaQuery,
  Button,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { pageStyles } from '../../../assets/style/commen';
import View from './view';
import AddEdit from './AddEdit';
import DeleteModel from '../../../utils/defult/DeleteModel';
import { PlusCircleOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const Index = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const dispatch = useDispatch();
  const { galleries, galleryCount, selectedGallery, loading, error } = useSelector((state) => state.gallery || { galleries: [], galleryCount: 0, selectedGallery: {}, loading: false, error: null });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const title = 'Galleries';

  useEffect(() => {
    dispatch(getGalleries());
  }, [dispatch]);

  const handleView = (row) => {
    dispatch(getGalleryById(row._id));
    setIsDrawerOpen(true);
  };

  const handleNewClick = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setOpenDialog(true);
  };

  const handleDelete = (row) => {
    setDeleteData(row);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = (data) => {
    if (data && data._id) {
      dispatch(deleteGallery(data._id));
      setOpenDeleteDialog(false);
      setDeleteData(null);
    }
  };

  const handleSubmitForm = (values) => {
    if (editData && editData._id) {
      dispatch(updateGallery({ id: editData._id, image: values.image }));
    } else {
      dispatch(addGallery({ images: values.images }));
    }
    setOpenDialog(false);
    setEditData(null);
  };

  const rows = useMemo(() => {
    const validGalleries = Array.isArray(galleries) ? galleries : [];
    if (!Array.isArray(galleries)) {
      console.warn('Redux state.galleries is not an array:', galleries);
    }
    return validGalleries.map((item, index) => ({
      ...item,
      id: index + 1 || item._id || '',
    }));
  }, [galleries]);

  const memoizedEditData = useMemo(() => editData, [editData]);

  return (
    <Box sx={pageStyles.mainBox}>
      <Typography variant="h4" sx={pageStyles.title}>{title}</Typography>
      <Typography component="p" sx={pageStyles.countList}>
        <span style={{ color: '#234155', fontWeight: 600 }}>{galleryCount} {title}</span> are listed below
      </Typography>

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={pageStyles.newButtonBox}>
        <Button
          variant="contained"
          sx={pageStyles.newButton}
          fullWidth={isMobile}
          onClick={handleNewClick}
        >
          <PlusCircleOutlined style={pageStyles.newButtonIcon} />
          New
        </Button>
      </Box>

      {loading && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading galleries...
        </Typography>
      )}

      {!loading && rows.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          No galleries found.
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        {rows.map((row) => (
          <Box
            key={row._id}
            sx={{
              position: 'relative',
              width: { xs: '100%', sm: '200px' },
              height: '160px',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid #ccc'
            }}
          >
            {row.image && row.image !== '/public/defult/noimage.png' ? (
              <img
                src={row.image}
                alt={`Gallery Image ${row.id}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <Typography>No Image</Typography>
            )}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                p: 0.5
              }}
            >
              <IconButton size="small" onClick={() => handleView(row)}>
                <EyeOutlined style={pageStyles.viewIcon}/>
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(row)}>
                <DeleteOutlined style={pageStyles.deleteIcon}/>
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      <AddEdit
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditData(null);
        }}
        onSubmit={handleSubmitForm}
        editData={memoizedEditData}
      />

      <View
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={selectedGallery}
      />

      <DeleteModel
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setDeleteData(null);
        }}
        data={deleteData}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default Index;