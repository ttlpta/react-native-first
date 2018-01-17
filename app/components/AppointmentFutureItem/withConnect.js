import { connect } from 'react-redux';
import { getDetailClinic , bookingClinic, getDoctorOfClinic } from '../../redux/actions';

const mapStateToProps = state => ({
  
});

const mapDispatchToProps = dispatch => ({
  
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
