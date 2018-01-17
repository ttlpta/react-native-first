import * as types from '../types';

const defaultClinicState = {
  detailClinic: {},
  doctors: [],
  isRequestingListClinic : false,
  listClinics: [],
  isRequestingListDoctor: false,
  getListDoctorFail: false,
  isBookingClinic : false,
  isBookingSuccess : false,
  isRejecting : false,
  bookingClinicErrorMsg : '',
  isRejectAppointmentSuccess : false,
};

export default function clinic(state = defaultClinicState, action) {
  
  switch (action.type) {
    case types.GET_LIST_CLINIC: 
      state = { ...state, isRequestingListClinic : true };
      break;

    case types.GET_LIST_CLINIC + '_SUCCESS': 
      state = { ...state, isRequestingListClinic : false, listClinics : action.payload.data.data };
      break;
      
    case types.GET_LIST_CLINIC + '_FAIL': 
      state = { ...state, isRequestingListClinic : false };
      break;

    case types.CLINIC_GET_DETAIL_CLINIC:
      state = { ...state, isGettingDetailClinic: true };
      break;

    case types.CLINIC_GET_DETAIL_CLINIC + '_SUCCESS':
      state = {
        ...state,
        detailClinic: action.payload.data.data ,
        isGettingDetailClinic: false,
        getDetailClinicSuccess: true,
      };
      break;

    case types.CLINIC_GET_DETAIL_CLINIC + '_FAIL':
      state = {
        ...state, isGettingDetailClinic: false, getDetailClinicSuccess: false,
      };
      break;

    case types.BOOKING_CLINIC:
      state = { ...state, isBookingClinic: true };
      break;

    case types.BOOKING_CLINIC+ '_SUCCESS':
      state = { ...state, isBookingClinic: false, isBookingSuccess : true };
      break;

    case types.BOOKING_CLINIC+ '_FAIL':
      state = { ...state, isBookingClinic: false, isBookingSuccess : false, bookingClinicErrorMsg : action.error.response.data.error.message };
      break;

    case types.REJECT_APPOINTMENT: 
      state = { ...state, isRejecting : true };
      break;

    case types.REJECT_APPOINTMENT + '_SUCCESS':
      state = { ...state, isRejecting: false, isRejectAppointmentSuccess : true };
      break;

    case types.REJECT_APPOINTMENT + '_FAIL':
      state = { ...state, isRejecting: false, isRejectAppointmentSuccess : false };
      break;
  }
  return state;
}

export function doctorOfClinic(state = defaultClinicState, action) {
  switch (action.type) {
    case types.CLINIC_GET_DOCTOR_OF_CLINIC:
      state = {
        ...state, isRequestingListDoctor: true,
      };
      break;

    case `${types.CLINIC_GET_DOCTOR_OF_CLINIC}_SUCCESS`:
      state = {
        ...state,
        doctors: action.payload.data.data,
        isRequestingListDoctor: false,
      };
      break;

    case `${types.CLINIC_GET_DOCTOR_OF_CLINIC}_FAIL`:
      state = {
        ...state, isRequestingListDoctor: false, getListDoctorFail: true,
      };
      break;
  }
  return state;
}
