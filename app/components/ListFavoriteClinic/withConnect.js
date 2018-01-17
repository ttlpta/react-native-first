import { connect } from 'react-redux';
import { listFavClinic } from 'app/redux/actions';

const mapStateToProps = state => ({
  dataAuth : state.user.dataAuth,

  isGettingDataDoctor : state.listFavorite.listFavDoctor.isGettingData,
  dataClinic : state.listFavorite.listFavClinic.data,
});

const mapDispatchToProps = dispatch => ({
  listFavClinic : (user_code) => dispatch(listFavClinic(user_code)),
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}