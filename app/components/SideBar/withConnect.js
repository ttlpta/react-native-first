import { connect } from 'react-redux';

const mapStateToProps = state => ({
  dataAuth : state.user.dataAuth,
  facebookAuth : state.user.facebookAuth,
});

const mapDispatchToProps = dispatch => ({
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}