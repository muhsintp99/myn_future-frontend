import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';

// Validation schema for multiple images
const validationSchema = Yup.array()
  .of(
    Yup.mixed()
      .test('fileType', 'Only image files (JPEG, PNG, GIF) are allowed', (value) => {
        if (!value) return true;
        return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      })
      .test('fileSize', 'Each image must be 5MB or less', (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024; // 5MB
      })
  )
  .min(1, 'At least one image is required')
  .max(10, 'Maximum 10 images allowed');

const AddEdit = ({ open, onClose, onSubmit, editData }) => {
  const isEdit = Boolean(editData && editData._id);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (isEdit && editData?.image) {
      setPreviewImages([editData.image]);
      setImageFiles([]); // In edit mode, new files start empty
    } else {
      setPreviewImages([]);
      setImageFiles([]);
    }
  }, [editData, isEdit]);

  const handleRemoveImage = (index, setFieldValue) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setFieldValue('images', imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (isEdit) {
      onSubmit({ image: values.images[0] });
    } else {
      onSubmit({ images: values.images });
    }
    setSubmitting(false);
    setPreviewImages([]);
    setImageFiles([]);
    resetForm();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Gallery Image' : 'Add New Gallery Images'}</DialogTitle>
      <Formik
        initialValues={{ images: [] }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Image Upload */}
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Upload {isEdit ? 'Image' : 'Images (Max 10, JPEG/PNG/GIF, 5MB each)'}
                    </Typography>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      multiple={!isEdit}
                      onChange={(event) => {
                        const files = Array.from(event.currentTarget.files);
                        if (isEdit && files.length > 1) {
                          alert('Only one image allowed in edit mode');
                          return;
                        }
                        if (!isEdit && files.length + imageFiles.length > 10) {
                          alert('Maximum 10 images allowed');
                          return;
                        }
                        setImageFiles((prev) => [...prev, ...files]);
                        setFieldValue('images', [...imageFiles, ...files]);
                        const previews = files.map((file) => {
                          return new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(file);
                          });
                        });
                        Promise.all(previews).then((results) => {
                          setPreviewImages((prev) => isEdit ? results : [...prev, ...results]);
                        });
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                    {touched.images && errors.images && (
                      <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                        {typeof errors.images === 'string' ? errors.images : 'Invalid image selection'}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Show Preview Images */}
                {previewImages.length > 0 && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Preview ({previewImages.length} {previewImages.length === 1 ? 'image' : 'images'}):
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {previewImages.map((src, index) => (
                          <Box key={index} sx={{ position: 'relative' }}>
                            <img
                              src={src}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: 100,
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: 4,
                                border: '1px solid #ccc'
                              }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
                              }}
                              onClick={() => handleRemoveImage(index, setFieldValue)}
                            >
                              <CloseIcon fontSize="small" color="error" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => {
                  onClose();
                  setPreviewImages([]);
                  setImageFiles([]);
                  setFieldValue('images', []);
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !values.images.length}
                sx={{ ml: 2 }}
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEdit;