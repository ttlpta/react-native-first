import { connect } from 'react-redux';
import { getDetailDoctor, bookingDoctor } from 'app/redux/actions';

const mapStateToProps = state => ({
  info : state.doctor.info,
  isGettingDetail : state.doctor.isGettingDetail,
  isBookingSuccess : state.doctor.isBookingSuccess,
  isBookingDoctor : state.doctor.isBookingDoctor,
  bookingErrorMsg : state.doctor.bookingErrorMsg,
});

const mapDispatchToProps = dispatch => ({
  getDetailDoctor : (id) => dispatch(getDetailDoctor(id)),
  bookingDoctor : (data) => dispatch(bookingDoctor(data)),
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}