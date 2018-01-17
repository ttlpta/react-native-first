import * as types from '../types';

const defaultState = { 
  listDoctor: [],
  isRequestingListDoctor : false,
  isBookingDoctor : false,
  isBookingSuccess : false,
  isGettingDetail: false,
  info :{},
};

export default function doctor(state = defaultState, action) {

  switch (action.type) {
    case types.GET_LIST_DOCTOR:
      state = { ...state, isRequestingListDoctor : true };
      break;

    case types.GET_LIST_DOCTOR + '_SUCCESS':
      state = { ...state, isRequestingListDoctor : false, listDoctor: action.payload.data.data };
      break;

    case types.GET_LIST_DOCTOR + '_FAIL' :
      state = { ...state, isRequestingListDoctor : false };
      break;

      case types.BOOKING_DOCTOR:
      state = {...state, isBookingDoctor : true};
      break;

    case types.BOOKING_DOCTOR + '_SUCCESS':
      state = { ...state, isBookingDoctor : false, isBookingSuccess: true };
      break;

    case types.BOOKING_DOCTOR + '_FAIL' :
      state = { ...state, isBookingDoctor : false, bookingErrorMsg: action.error.response.data.error.message };
      break;

    case types.DETAIL_DOCTOR:
      state = { ...state, isGettingDetail : true}
      break;

    case types.DETAIL_DOCTOR + '_SUCCESS' :
      state = { ...state, isGettingDetail : false, info : action.payload.data.data}
      break;

    case types.DETAIL_DOCTOR + '_FAIL' :
      state = { ...state, isGettingDetail : false}
      break;
  }

  return state;
}