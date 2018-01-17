import { connect } from 'react-redux';
import { getListDoctor, getListClinic } from '../../redux/actions';

const mapStateToProps = state => ({
  listDoctor : state.doctor.listDoctor, 
  isRequestingListDoctor : state.doctor.isRequestingListDoctor, 
  isRequestingListClinic : state.clinic.isRequestingListClinic, 
  listClinic : state.clinic.listClinics, 
});

const mapDispatchToProps = dispatch => ({
  getListDoctor: () => dispatch(getListDoctor()),
  getListClinic: () => dispatch(getListClinic()),
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
