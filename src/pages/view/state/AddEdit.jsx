import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Button, Grid, Typography, FormControlLabel, Checkbox,
  MenuItem, Select, FormControl, InputLabel, Switch
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  country: Yup.string().required('Country is required'),
  name: Yup.string().required('State name is required'),
  desc: Yup.string().required('Description is required'),
  isActive: Yup.boolean().required('Status is required'),
  recommend: Yup.boolean(), // ✅ new field
});

const AddEdit = ({ open, onClose, onSubmit, editData, countries }) => {
  const isEdit = Boolean(editData && editData._id);
  const defaultIndia = countries.find((c) => c.name?.toLowerCase() === 'india');

  const initialValues = {
    country: isEdit
      ? editData?.country?._id
      : defaultIndia?._id || countries[0]?._id || '',
    name: editData?.name || '',
    desc: editData?.desc || '',
    isActive: editData?.isActive !== undefined ? editData.isActive : true,
    recommend: editData?.recommend || false, // ✅ default false
  };

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit State' : 'Add New State'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Country */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Country *</InputLabel>
                    <Field
                      as={Select}
                      name="country"
                      label="Country *"
                      disabled={defaultIndia?._id === initialValues.country}
                      error={touched.country && Boolean(errors.country)}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country._id} value={country._id}>
                          {country?.name}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.country && errors.country && (
                      <Typography color="error" variant="caption">
                        {errors.country}
                      </Typography>
                    )}
                    {defaultIndia?._id === initialValues.country && (
                      <Typography variant="caption" sx={{ color: 'gray' }}>
                        Places is set to India by default and cannot be changed.
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* State Name */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="name"
                    label="State Name *"
                    placeholder="State Name"
                    fullWidth
                    variant="outlined"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="desc"
                    placeholder="Description"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    error={touched.desc && Boolean(errors.desc)}
                    helperText={touched.desc && errors.desc}
                  />
                </Grid>

                {/* ✅ Recommended Switch */}
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.recommend}
                        onChange={(e) => setFieldValue('recommend', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Recommended"
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={onClose} variant="outlined">Cancel</Button>
              <Button type="submit" variant="contained" sx={{ ml: 2 }}>
                {isEdit ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddEdit;
