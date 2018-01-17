import { connect } from 'react-redux';
import { listFavDoctor, listFavClinic } from 'app/redux/actions';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}