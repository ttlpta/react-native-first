import { connect } from 'react-redux';
import { getAccessToken } from 'app/redux/actions';

const mapStateToProps = state => ({
  accessToken : state.user.accessToken,
  isGettingToken : state.user.isGettingToken,
  gettingTokenSuccess : state.user.gettingTokenSuccess
});

const mapDispatchToProps = dispatch => ({
  getAccessToken : () => dispatch(getAccessToken()),
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
