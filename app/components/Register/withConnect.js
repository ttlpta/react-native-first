import { connect } from 'react-redux';
import { register, loginFacebook } from 'app/redux/actions';

const mapStateToProps = state => ({
  isRequestingData: state.user.register.isRegisting,
  isRegister: state.user.register.isRegister,
  registerErrorMsg: state.user.register.registerErrorMsg,
  facebookAuth: state.user.facebookAuth,
  isRequestingDataLogin: state.user.isRequestingData,
  isLogin: state.user.isLogin,
  loginErrorMsg: state.user.loginErrorMsg,
});

const mapDispatchToProps = dispatch => ({
  loginFacebook: (facebookId, accessToken, email, userName) => dispatch(
    loginFacebook(facebookId, accessToken, email, userName)
  ),
  register: (phone, pass, repass, refcode) => dispatch(register(phone, pass, repass, refcode)),
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
