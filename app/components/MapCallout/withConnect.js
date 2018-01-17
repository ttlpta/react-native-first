import { connect } from 'react-redux';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
