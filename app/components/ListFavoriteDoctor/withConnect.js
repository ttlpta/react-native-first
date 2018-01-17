import { connect } from 'react-redux';
import { listFavDoctor, shareMedical, cancelMedical, acceptMedical, denyMedical } from 'app/redux/actions';

const mapStateToProps = state => ({
  dataAuth : state.user.dataAuth,

  isGettingDataDoctor : state.listFavorite.listFavDoctor.isGettingData,
  
  dataDoctor : state.listFavorite.listFavDoctor.data,

  isSharing : state.listFavorite.shareMedical.isSharing,

  isCanceling : state.listFavorite.cancelMedical.isCanceling,
  
  isAccepting : state.listFavorite.acceptMedical.isAccepting,

  isDenying : state.listFavorite.denyMedical.isDenying,
});

const mapDispatchToProps = dispatch => ({
  listFavDoctor : (user_code) => dispatch(listFavDoctor(user_code)),
  shareMedical : (dw_id, user_code, doctor_code) => dispatch(shareMedical(dw_id, user_code, doctor_code)),
  cancelMedical : (dw_id, user_code, doctor_code) => dispatch(cancelMedical(dw_id, user_code, doctor_code)),
  acceptMedical : (dw_id, user_code, doctor_code) => dispatch(acceptMedical(dw_id, user_code, doctor_code)),
  denyMedical : (dw_id, user_code, doctor_code) => dispatch(denyMedical(dw_id, user_code, doctor_code)),
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}