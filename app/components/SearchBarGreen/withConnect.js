import { connect } from 'react-redux';

const mapStateToProps = state => ({
  mylanguage: state.language.defaultlanguage
});

const mapDispatchToProps = dispatch => ({
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
