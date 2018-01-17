import * as types from '../types';

const defaultUserState = { 
  listFavDoctor : { isGettingData : false, data:{} },
  listFavClinic : { isGettingData : false, data:{} },
  shareMedical : { isSharing : false, sharing : false},
  cancelMedical : { isCanceling : false, canceling : false},
  acceptMedical : { isAccepting : false, accepting : false},
  denyMedical : { isDenying : false, denying : false},
};
 
export default function listFavorite(state = defaultUserState, action) {
  switch (action.type) {
// list favorite doctor

    case types.LIST_FAVORITE_DOCTOR:
      state = { ...state, listFavDoctor : { isGettingData : true } };
      break;

    case types.LIST_FAVORITE_DOCTOR + '_SUCCESS' :
      state = { ...state, listFavDoctor : { isGettingData : false, data : action.payload.data.data } };
      break;
    case types.LIST_FAVORITE_DOCTOR + '_FAIL' :
      state = { ...state, listFavDoctor : { isGettingData : false } };
      break;

// list favorite clinic

    case types.LIST_FAVORITE_CLINIC:
      state = { ...state, listFavClinic : { isGettingData : true } };
      break;

    case types.LIST_FAVORITE_CLINIC + '_SUCCESS' :
      state = { ...state, listFavClinic : { isGettingData : false, data : action.payload.data.data } };
      break;
    case types.LIST_FAVORITE_CLINIC + '_FAIL' :
      state = { ...state, listFavClinic : { isGettingData : false } };
      break;

// user share doctor

    case types.SHARE_MEDICAL_DOCTOR : 
      state = { ...state, shareMedical : { isSharing : true}};
      break;

    case types.SHARE_MEDICAL_DOCTOR + '_SUCCESS' : 
      state = { ...state, shareMedical : { isSharing : false, sharing : true}};
      break;

    case types.SHARE_MEDICAL_DOCTOR + '_FAIL' : 
      state = { ...state, shareMedical : { isSharing : false, sharing : false}};
      break;

// user cancel share doctor

    case types.CANCEL_MEDICAL_DOCTOR : 
      state = { ...state, cancelMedical : { isCanceling : true}};
      break;

    case types.CANCEL_MEDICAL_DOCTOR + '_SUCCESS' : 
      state = { ...state, cancelMedical : { isCanceling : false, canceling : true}};
      break;

    case types.CANCEL_MEDICAL_DOCTOR + '_FAIL' : 
      state = { ...state, cancelMedical : { isCanceling : false, canceling : false}};
      break;

// user accept share doctor

    case types.ACCEPT_MEDICAL_DOCTOR : 
      state = { ...state, acceptMedical : { isAccepting : true}};
      break;

    case types.ACCEPT_MEDICAL_DOCTOR + '_SUCCESS' : 
      state = { ...state, acceptMedical : { isAccepting : false, accepting : true}};
      break;

    case types.ACCEPT_MEDICAL_DOCTOR + '_FAIL' : 
      state = { ...state, acceptMedical : { isAccepting : false, accepting : false}};
      break;

// user deny share doctor

    case types.DENY_MEDICAL_DOCTOR : 
      state = { ...state, denyMedical : { isDenying : true}};
      break;

    case types.DENY_MEDICAL_DOCTOR + '_SUCCESS' : 
      state = { ...state, denyMedical : { isDenying : false, denying : true}};
      break;

    case types.DENY_MEDICAL_DOCTOR + '_FAIL' : 
      state = { ...state, denyMedical : { isDenying : false, denying : false}};
      break;
  }

  return state;
}
