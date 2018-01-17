import { connect } from 'react-redux';
import {
  getListAppointmentFuture, getListAppointmentPast, rejectAppointment
} from '../../redux/actions';

const mapStateToProps = state => ({
  listAppointmentFuture: state.appointments.listAppointmentFuture,
  listAppointmentPast: state.appointments.listAppointmentPast,
  isRejecting: state.clinic.isRejecting,
  isRejectAppointmentSuccess: state.clinic.isRejectAppointmentSuccess,
  profilePatient: state.user.profilePatient,  
  isRequestingData: state.appointments.isRequestingData,  
});

const mapDispatchToProps = dispatch => ({
  getListAppointmentFuture: userCode => dispatch(
    getListAppointmentFuture(userCode)
  ),
  getListAppointmentPast: (userCode, bookingDate) => dispatch(
    getListAppointmentPast(userCode, bookingDate)
  ),
  rejectAppointment: appointmentId => dispatch(rejectAppointment(appointmentId)),

});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}

