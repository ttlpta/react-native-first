import { connect } from 'react-redux';
import { searchMapView } from 'app/redux/actions';

const mapStateToProps = state => ({
  dumpData : state.map.markerLocation
});

const mapDispatchToProps = dispatch => ({
  onSearch: (txt) => dispatch(searchMapView(txt)),
});

export default function withConnect(Component) {
  return connect(mapStateToProps, mapDispatchToProps)(Component);
}
