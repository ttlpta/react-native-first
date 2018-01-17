import * as types from '../types';

const defaultUserState = {
  booking: { isGettingData: false, dataBooking: {} },
  medicalHistory: { isRequestingData: false, getDataFail: false, dataMedicalHistory: [] },
};

export default function user(state = defaultUserState, action) {
  switch (action.type) {
    // hen kham

    case types.LIST_HEN_KHAM:
      state = { ...state, booking: { isGettingData: true } };
      break;

    case types.LIST_HEN_KHAM + '_SUCCESS':
      state = { ...state, booking: { isGettingData: false, dataBooking: action.payload.data.data } };
      break;

    case types.LIST_HEN_KHAM + '_FAIL':
      state = { ...state, booking: { isGettingData: false } };
      break;

    // Medical history  
    case types.MEDICAL_HISTORY:
      state = { ...state, medicalHistory: { ...state.medicalHistory, isRequestingData: true } };
      break;

    case types.MEDICAL_HISTORY + '_SUCCESS':
      state = {
        ...state, medicalHistory:
        {
          ...state.medicalHistory,
          isRequestingData: false,
          dataMedicalHistory: action.payload.data.data,
        },
      };
      break;

    case types.MEDICAL_HISTORY + '_FAIL':
      state = {
        ...state, medicalHistory:
          { ...state.medicalHistory, isRequestingData: false, getDataFail: true },
      };
      break;
  }

  return state;
}
