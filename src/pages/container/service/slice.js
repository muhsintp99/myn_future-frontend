import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  services: [],
  selectedService: null,
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    getServices: (state) => { state.loading = true; },
    getServicesSuccess: (state, { payload }) => {
      state.loading = false;
      state.services = payload.data || [];
    },
    getServicesFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    getServiceById: (state) => { state.loading = true; },
    getServiceByIdSuccess: (state, { payload }) => {
      state.loading = false;
      state.selectedService = payload;
    },
    getServiceByIdFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    addService: (state) => { state.loading = true; },
    addServiceSuccess: (state, { payload }) => {
      state.loading = false;
      state.services.unshift(payload);
    },
    addServiceFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    updateService: (state) => { state.loading = true; },
    updateServiceSuccess: (state, { payload }) => {
      state.loading = false;
      state.services = state.services.map((s) =>
        s._id === payload._id ? payload : s
      );
      if (state.selectedService?._id === payload._id) {
        state.selectedService = payload;
      }
    },
    updateServiceFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    hardDeleteService: (state) => { state.loading = true; },
    hardDeleteServiceSuccess: (state, { payload }) => {
      state.loading = false;
      state.services = state.services.filter((s) => s._id !== payload);
    },
    hardDeleteServiceFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const {
  getServices, getServicesSuccess, getServicesFail,
  getServiceById, getServiceByIdSuccess, getServiceByIdFail,
  addService, addServiceSuccess, addServiceFail,
  updateService, updateServiceSuccess, updateServiceFail,
  hardDeleteService, hardDeleteServiceSuccess, hardDeleteServiceFail,
} = serviceSlice.actions;

export default serviceSlice.reducer;
