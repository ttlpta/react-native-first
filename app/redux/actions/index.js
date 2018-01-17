import * as types from '../types';
import * as code from '../../constants/code.js';

export const searchMapView = (txt) => ({
  type: 'SEARCH_MAP_VIEW',
  searchTxt: txt
});

export const getAccessToken = () => {
  const payload = {
    request: {
      url: '/user/gettoken',
    },
  };

  const type = 'CALLING_GET_ACCESS_TOKEN';

  return dispatch => dispatch({ type, payload });
};

export const loginFacebook = (facebookId, accessToken, email, userName) => {
  const payload = {
    request: {
      method: 'post',
      url: '/auth/login/facebook.json',
      data: {
        access_token: accessToken,
        facebook_id: facebookId,
        email,
        user_type: 0,
        user_name: userName,
      },
    },
  };
  const type = types.LOGIN_FACEBOOK;
  return dispatch => dispatch({ type, payload });
};

export const login = (user, pass) => {
  const payload = {
    request: {
      method: 'post',
      url: '/auth/user.json',
      data: {
        phone_no: user,
        password: pass,
      },
    },
  };

  const type = types.LOGIN;

  return dispatch => dispatch({ type, payload });
}

export const register = (phone_no, pass, re_pass, ref_code) => {
  const payload = {
    request: {
      method: 'post',
      url: '/register/user.json',
      data: {
        phone_no: phone_no,
        password: pass,
        re_password: re_pass,
        ref_code: ref_code
      }
    }
  };

  const type = types.REGISTER;

  return dispatch => dispatch({ type, payload });
}

export const getListDoctor = () => {
  const payload = {
    request : {
      url : '/doctor.json?limit=10&offset=0',
    },
  };

  const type = types.GET_LIST_DOCTOR;

  return dispatch => dispatch({ type, payload });
}

export const bookingDoctor = (data) => {
  const payload = {
    request : {
      method : 'post',
      url : '/booking/doctor.json',
      data
    }
  };

  const type = types.BOOKING_DOCTOR;

  return dispatch => dispatch({ type,payload });
};

export const getDetailDoctor = id => {
  const payload = {
    request: {
      method: 'get',
      url: `/doctor/${id}.json`,
    },
  };

  const type = types.DETAIL_DOCTOR;

  return dispatch => dispatch({ type, payload });
};

export const logout = (user, pass) => {

  const type = types.LOGOUT;

  return dispatch => dispatch({ type });
};

export const listFavDoctor = (user_code) => {
  const payload = {
    request : {
      method : 'post',
      url : '/user/wishlist.json',
      data : {
        user_code : 'VN01USE00000008',
        get_type : 1
      }
    }
  };

  const type = types.LIST_FAVORITE_DOCTOR;

  return dispatch => dispatch({ type, payload });
}

export const listFavClinic = (user_code) => {
  const payload = {
    request : {
      method : 'post',
      url : '/user/wishlist.json',
      data : {
        user_code : 'VN01USE00000008',
        get_type : 2
      }
    }
  };

  const type = types.LIST_FAVORITE_CLINIC;

  return dispatch => dispatch({ type, payload });
}

export const getDetailClinic = clinicID => {
  const payload = {
    request: {
      url: `/clinic/${clinicID}.json`,
    },
  };
  const type = types.CLINIC_GET_DETAIL_CLINIC;

  return dispatch => dispatch({ type, payload });
};

export const bookingClinic = (data) => {
  const payload = {
    request : {
      method : 'post',
      url : '/booking/clinic.json',
      data
    }
  };

  const type = types.BOOKING_CLINIC;

  return dispatch => dispatch({ type,payload });
}

export const getDoctorOfClinic = clinicID => {
  const payload = {
    request: {
      url: `/doctors/${clinicID}.json`,
    },
  };
  const type = types.CLINIC_GET_DOCTOR_OF_CLINIC;
  return dispatch => dispatch({ type, payload });
};

export const getListAppointmentFuture = userCode => {
  const payload = {
    request: {
      url: `/booking.json?filter[user_code]=${userCode}&filter[booking_status]=0`,
    },
  };
  const type = types.APPOINTMENTS_GET_LIST_FUTURE;
  return dispatch => dispatch({ type, payload });
};

export const getListAppointmentPast = (userCode,bookingDate) => {
  const payload = {
    request: {
      url: `/booking/history.json?filter[user_code]=${userCode}&filter[booking_date]=${bookingDate}`,
    },
  };
  const type = types.APPOINTMENTS_GET_LIST_PAST;
  return dispatch => dispatch({ type, payload });
};

export const rejectAppointment = appointmentId => {
  const payload = {
    request: {
      method : 'put',
      url: `/booking/reject/${appointmentId}.json`,
    },
  };

  const type = types.REJECT_APPOINTMENT;

  return dispatch => dispatch({ type, payload });
};

export const shareMedical = (dwId, user_code, doctor_code) => {
  const payload = {
    request: {
      method : 'put',
      url: '/user/wishlist/share/' + dwId + '.json',
      data : {
        user_code : 'VN01USE00000008',
        doctor_code: doctor_code,
        share_action : code.SHARE_MEDICAL
      }
    },
  };

  const type = types.SHARE_MEDICAL_DOCTOR;

  return dispatch => dispatch({ type, payload });
};

export const cancelMedical = (dwId, user_code, doctor_code) => {
  const payload = {
    request: {
      method : 'put',
      url: '/user/wishlist/share/' + dwId + '.json',
      data : {
        user_code : 'VN01USE00000008',
        doctor_code: doctor_code,
        share_action : code.CANCEL_MEDICAL
      }
    },
  };

  const type = types.CANCEL_MEDICAL_DOCTOR;

  return dispatch => dispatch({ type, payload });
};

export const acceptMedical = (dwId, user_code, doctor_code) => {
  const payload = {
    request: {
      method : 'put',
      url: '/user/wishlist/share/' + dwId + '.json',
      data : {
        user_code : 'VN01USE00000008',
        doctor_code: doctor_code,
        share_action : code.ACCEPT_MEDICAL
      }
    },
  };

  const type = types.ACCEPT_MEDICAL_DOCTOR;

  return dispatch => dispatch({ type, payload });
};

export const denyMedical = (dwId, user_code, doctor_code) => {
  const payload = {
    request: {
      method : 'put',
      url: '/user/wishlist/share/' + dwId + '.json',
      data : {
        user_code : 'VN01USE00000008',
        doctor_code: doctor_code,
        share_action : code.DENY_MEDICAL,
      },
    },
  };

  const type = types.DENY_MEDICAL_DOCTOR;

  return dispatch => dispatch({ type, payload });
};

export const getListClinic = () => {
  const payload = {
    request : {
      url : '/clinic.json?limit=10&offset=0',
    },
  };

  const type = types.GET_LIST_CLINIC;

  return dispatch => dispatch({ type, payload });
};

export const getProfilePatient = userCode => {
  const payload = {
    request : {
      url : `/user/info.json?filter[user_code]=${userCode}`,
    },
  };

  const type = types.PROFILE_PATIENT;

  return dispatch => dispatch({ type, payload });
};

export const saveProfile = data => {
  const payload = {
    request : {
      url : '/user/info.json',
      method : 'put',
      data: { ...data, address : data.address1 },
    },
  };

  const type = types.SAVE_PROFILE;
  
  return dispatch => dispatch({ type, payload });
};

export const getMedicalHistory = userCode => {
  const payload = {
    request : {
      url : `/booking/user/history.json?filter[user_code]=${userCode}&filter[booking_date]`,
    },
  };

  const type = types.MEDICAL_HISTORY;

  return dispatch => dispatch({ type, payload });
};
