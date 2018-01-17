import { connect } from 'react-redux';
import { loginFacebook, login } from '../../redux/actions';

const mapStateToProps = state => ({
  dataAuth: state.user.dataAuth,
  facebookAuth: state.user.facebookAuth,
  isRequestingData: state.user.isRequestingData,
  isLogin: state.user.isLogin,
  loginErrorMsg: state.user.loginErrorMsg,
});

const mapDispatchToProps = dispatch => ({
  loginFacebook: (facebookId, accessToken, email, userName) => dispatch(
    loginFacebook(facebookId, accessToken, email, userName)
  ),
  login: (user, pass) => dispatch(login(user, pass)),
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}




