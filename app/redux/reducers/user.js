import * as types from '../types';

const defaultUserState = {
  dataAuth: { user_name: '', access_token: '', user_code: '', avartar_url:'' },
  facebookAuth: { facebookId: '', email: '', user_name: '', user_code: '', access_token: '', avartar_url:'' },
  profilePatient: {},
  isRequestingData: false,
  isSavingProfileData: false,
  isSavedProfileSuccess: false,
  isRequestingAccProfileData: false,
  isLogin: false,
  loginErrorMsg: '',
  saveProfileErrorMsg: '',
  register: { isRegisting: false, isRegister: false, registerErrorMsg: '' },
};

export default function user(state = defaultUserState, action) {
  switch (action.type) {
    case types.SAVE_PROFILE:
      state = { ...state, isSavingProfileData: true };
      break;

    case types.SAVE_PROFILE + '_SUCCESS':
      state = { ...state, dataAuth: action.payload.data.data, isSavedProfileSuccess: true, isSavingProfileData: false };
      break;

    case types.SAVE_PROFILE + '_FAIL':
      state = { ...state, isSavingProfileData: false, saveProfileErrorMsg: action.error.response.data.error.message };
      break; 
      
    case types.LOGIN:
      state = { ...state, isRequestingData: true };
      break;

    case types.LOGOUT:
      state = defaultUserState;
      break;

    case types.LOGIN + '_SUCCESS':
      state = {
        ...state,
        dataAuth: action.payload.data.data,
        isRequestingData: false,
        isLogin: true
      };
      break;

    case types.LOGIN + '_FAIL':
      state = { ...state, isRequestingData: false, loginErrorMsg: action.error.response.data.error.message };
      break;

    case types.LOGIN_FACEBOOK:
      state = { ...state, isRequestingData: true };
      break;

    case types.LOGIN_FACEBOOK + '_SUCCESS':
      state =
        {
          ...state,
          isRequestingData: false,
          isLogin: true,
          facebookAuth: action.payload.data.data,
        };
      break;
    case types.LOGIN_FACEBOOK + '_FAIL':
      state = { ...state, isRequestingData: false, loginErrorMsg: action.error.response.data.error.message };
      break;

  // register

    case types.REGISTER:
      state = { ...state, register: { isRegisting: true } };
      break;

    case types.REGISTER + '_SUCCESS':
      state = { ...state, register: { isRegisting: false, isRegister: true } };
      break;

    case types.REGISTER + '_FAIL':
      state = { ...state, register: { isRegisting: false, isRegister: false, registerErrorMsg: action.error.response.data.error.message } };
      break;
  // profile patient

    case types.PROFILE_PATIENT:
      state = { ...state, isRequestingAccProfileData: true };
      break;

    case types.PROFILE_PATIENT + '_SUCCESS':
      state = { ...state, profilePatient: action.payload.data.data, isRequestingAccProfileData: false };
      break;

    case types.PROFILE_PATIENT + '_FAIL':
      state = { ...state, isRequestingAccProfileData: false };
      break; 
  }
  return state;
}
