import * as types from '../types';

const defaultAppointmentState = {
  listAppointmentFuture: [],
  listAppointmentPast: [],
  isRequestingData: false,
  getDataFail: false,
};

export default function appointment(state = defaultAppointmentState, action) {
  switch (action.type) {
    case types.APPOINTMENTS_GET_LIST_FUTURE:
      state = { ...state, isRequestingData: true };
      break;

    case types.APPOINTMENTS_GET_LIST_FUTURE + '_SUCCESS':
      state = {
        ...state,
        listAppointmentFuture: action.payload.data.data,
        isRequestingData: false,
      };
      break;

    case types.APPOINTMENTS_GET_LIST_FUTURE + '_FAIL':
      
      state = {
        ...state, isRequestingData: false, getDataFail: true,
      };
      break;

    case types.APPOINTMENTS_GET_LIST_PAST:
      
      state = { ...state, isRequestingData: true };
      break;

    case types.APPOINTMENTS_GET_LIST_PAST + '_SUCCESS':
      state = {
        ...state,
        listAppointmentPast: action.payload.data.data,
        isRequestingData: false,
      };
      break;
      
    case types.APPOINTMENTS_GET_LIST_PAST + '_FAIL':
      state = {
        ...state, isRequestingPastData: false, getDataFail: true,
      };
      break;
  }
  return state;
}
