import { connect } from 'react-redux';
import { getMedicalHistory } from 'app/redux/actions';

const mapStateToProps = state => ({
  dataAuth : state.user.dataAuth,
  medicalHistory: state.booking.medicalHistory.dataMedicalHistory,
  isRequestingData: state.booking.medicalHistory.isRequestingData,
  getDataFail: state.booking.medicalHistory.getDataFail,

});

const mapDispatchToProps = dispatch => ({
  getMedicalHistory : userCode => dispatch(getMedicalHistory(userCode)),
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
