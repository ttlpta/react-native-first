import { connect } from 'react-redux';
import { getDetailClinic , bookingClinic, getDoctorOfClinic } from '../../redux/actions';

const mapStateToProps = state => ({
  isBookingClinic: state.clinic.isBookingClinic,
  isBookingSuccess: state.clinic.isBookingSuccess,
  doctors: state.doctorOfClinic.doctors,
  profilePatient: state.user.profilePatient,
  bookingClinicErrorMsg: state.clinic.bookingClinicErrorMsg,
  currentUser: state.user.dataAuth,
  isRequestingListDoctor: state.clinic.isRequestingListDoctor,
  getListDoctorFail: state.clinic.getListDoctorFail,
});

const mapDispatchToProps = dispatch => ({
  getDetailClinic: clinicID => dispatch(getDetailClinic(clinicID)),
  bookingClinic : data => dispatch(bookingClinic(data)),
  getDoctorOfClinic: clinicID => dispatch(getDoctorOfClinic(clinicID)),
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
