import { connect } from 'react-redux';

const mapStateToProps = state => ({
  language: state.language.defaultlanguage,
});

const mapDispatchToProps = dispatch => {};

export default function withConnect(Component) {
  return connect(mapStateToProps)(Component);
}
