import PropTypes from 'prop-types';
import React from 'react';
import I18n from 'react-native-i18n';
import {
  Platform, StyleSheet, View, ScrollView, Dimensions, Text, TextInput,
  Image, ActivityIndicator, TouchableHighlight, TouchableOpacity, FlatList
} from 'react-native';

import { connect } from 'react-redux';

import ClinicInfoItem from 'app/components/ClinicInfoItem';
import DoctorInfoItem from 'app/components/DoctorInfoItem';


/**
 * Represents a list of clinics and doctors.
 */
class ClinicDoctorList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      shouldFetchData: this.props.shouldFetchData,
      fetchingData: false,
    };
    this._listRef = null;
    this._isMounted = false;
  }

  // static propTypes = {
  //   data: PropTypes.array,
  //   dataType: PropTypes.oneOf(['mix', 'clinic', 'doctor']),
  //   onChangeItemFavorite: PropTypes.func,
  //   onClickItem: PropTypes.func,
  //   onFetchData: PropTypes.func,
  //   showAvatar: PropTypes.bool,
  //   showFavorite: PropTypes.bool,
  //   showAvailTime: PropTypes.bool,
  // };

  static defaultProps = {
    // data: [],
    dataType: 'mix',
    shouldFetchData: true,
  };

  /// Getters/Setters ///

  get dataType() {
    return this.props.dataType;
  }

  get dataSize() {
    return this.state.data.length;
  }

  get isBusy() {
    return this.state.fetchingData;
  }

  get isEmpty() {
    return this.dataSize === 0;
  }

  get shouldFetchData() {
    return this.state.shouldFetchData;
  }

  set shouldFetchData(value) {
    this.setState({ shouldFetchData: value });
  }

  setData = newData => {
    // Update item keys, then set new data
    this.updateItemKeys(newData);
    this.setState({ data: newData || [] });
  }

  appendData = newData => {
    if (newData.length > 0) {
      const currData = this.state.data;
      const dataSize = currData.length;

      currData.push(...newData);

      // Update item keys, then set new data
      this.updateItemKeys(currData, dataSize);
      this.setState({ data: currData });
    }
  }

  mergeData = (newData, fromIndex) => {
    let currData = this.state.data;
    if (fromIndex < currData.length) {
      currData = currData.slice(0, fromIndex);
    } else if (fromIndex == currData.length) {
      currData = currData.slice(0);
    } else {
      currData = newData;
    }

    // Update item keys, then set new data
    this.updateItemKeys(currData, fromIndex);
    this.setState({ data: currData });
  }

  updateItemKeys(data, fromIndex = 0) {
    for (let idx = fromIndex; idx < data.length; idx += 1) {
      data[idx].key = idx;
    }
  }

  componentDidMount() {
    this._isMounted = true;
    // Load data if empty
    if (this.isEmpty) {
      this.onFetchData();
    }
  }

  componentWillReceiveProps() {
    this._isMounted = true;
    // Load data if empty
    if (this.isEmpty) {
      this.onFetchData();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onFetchData = () => {
    const func = this.props.onFetchData;
    this.setState({ fetchingData: true });
    func(this, this.onFetchDataDone);
  }

  onFetchDataDone = (newData, fromIndex) => {

    this.setState({ fetchingData: false });
    this.mergeData(newData, fromIndex);
  }

  onClearData = () => {
    if (this._isMounted) {
      this.setState({ fetchingData: false, data: [] });
    }
  }

  onEndReached = () => {
    if (!this.isEmpty) {
      this.onFetchData();
    }
  }

  /// Render ///

  renderHeader = () => {
    // TODO: we may implement "pull to refresh" here
    return null;
  }

  renderFooter = () => {
    if (this.state.fetchingData) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator animating />
          <Text style={styles.footerText}>Loading...</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  renderItem(item) {

    if (this.props.dataType === 'doctor') {
      return (
        <DoctorInfoItem
          style={styles.doctorItemContainer}
          data={item}
          showAvaiableTime={this.props.showAvaiableTime}
          navigation={this.props.navigation}
          allowClickDoctor={this.props.allowClickDoctor}
          onClickItem={this.props.onClickItem}
          onChangeFavorite={this.props.onChangeItemFavorite}
        />
      );
    } else {
      return (
        <ClinicInfoItem
          style={styles.clinicItemContainer}
          data={item}
          navigation={this.props.navigation}
          onClickItem={this.props.onClickItem}
          allowClick
          allowClickTitle
          onChangeFavorite={this.props.onChangeItemFavorite}
        />
      );
    }
  }

  render() {
    const dataAPI =
      ((this.props.dataType === 'doctor') ?
        this.props.listDoctor : this.props.listClinic) || this.props.data;
    return (
      <FlatList
        style={styles.rootContainer}
        data={dataAPI}
        renderItem={({ item }) => this.renderItem(item)}
        keyExtractor={(item, index) => 'item-' + index}
        removeClippedSubviews={false}
      />
    );
  }
}

const mapStatetoProps = (state) => {
  return state;
}

export default connect(mapStatetoProps)(ClinicDoctorList);

const styles = {
  rootContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },

  container: {
  },

  doctorItemContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },

  clinicItemContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },

  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },

  headerText: {
    color: 'rgb(255, 255, 255)',
    marginLeft: 10,
  },

  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },

  footerText: {
    color: 'rgb(255, 255, 255)',
    marginLeft: 10,
  },
};
