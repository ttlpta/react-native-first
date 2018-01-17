import { connect } from 'react-redux';

const mapStateToProps = state => ({
});

export default function withConnect(Component) {
  return connect(mapStateToProps)(Component);
}
