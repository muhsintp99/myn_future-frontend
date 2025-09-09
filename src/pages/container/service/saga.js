import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../container/api';
import config from '../../../config';
import * as actions from './slice';

// Get All Services
function* getServicesSaga() {
  try {
    const params = {
      api: `${config.configApi}/services`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    yield put(actions.getServicesSuccess({ data: response.data, total: response.total }));
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch services';
    yield put(actions.getServicesFail(errorMessage));
    toast.error(errorMessage);
  }
}

// Get Service by ID
function* getServiceByIdSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/services/${action.payload}`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    yield put(actions.getServiceByIdSuccess(response));
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch service';
    yield put(actions.getServiceByIdFail(errorMessage));
    toast.error(errorMessage);
  }
}

// Add Service
function* addServiceSaga(action) {
  try {
    const { title } = action.payload;
    const body = { title };

    const params = {
      api: `${config.configApi}/services`,
      method: 'POST',
      body,
      authorization: true,
    };

    const response = yield call(commonApi, params);
    yield put(actions.addServiceSuccess(response));
    yield put(actions.getServices()); // Refresh list
    toast.success('Service added successfully');
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Failed to add service';
    yield put(actions.addServiceFail(errorMessage));
    toast.error(errorMessage);
  }
}

// Update Service
function* updateServiceSaga(action) {
  try {
    const { id, data } = action.payload;
    const body = {};
    if (data.title) body.title = data.title;

    const params = {
      api: `${config.configApi}/services/${id}`,
      method: 'PUT',
      body,
      authorization: true,
    };

    const response = yield call(commonApi, params);
    yield put(actions.updateServiceSuccess(response));
    yield put(actions.getServices());
    toast.success('Service updated successfully');
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Failed to update service';
    yield put(actions.updateServiceFail(errorMessage));
    toast.error(errorMessage);
  }
}

// Hard Delete
function* hardDeleteServiceSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/services/${action.payload}`,
      method: 'DELETE',
      authorization: true,
    };
    yield call(commonApi, params);
    yield put(actions.hardDeleteServiceSuccess(action.payload));
    yield put(actions.getServices());
    toast.success('Service permanently deleted');
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Failed to delete service';
    yield put(actions.hardDeleteServiceFail(errorMessage));
    toast.error(errorMessage);
  }
}

export default function* serviceWatcherSaga() {
  yield takeEvery('services/getServices', getServicesSaga);
  yield takeEvery('services/getServiceById', getServiceByIdSaga);
  yield takeEvery('services/addService', addServiceSaga);
  yield takeEvery('services/updateService', updateServiceSaga);
  yield takeEvery('services/hardDeleteService', hardDeleteServiceSaga);
}
