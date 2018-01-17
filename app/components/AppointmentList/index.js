import PropTypes from 'prop-types';
import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import {
  Alert, StyleSheet, View, ScrollView, Dimensions, Text, TextInput,
  Image, ActivityIndicator, TouchableHighlight, TouchableOpacity, Platform, FlatList, Modal,
} from 'react-native';
import { Logger } from '@onaclover/react-native-utils';
import Loading from 'app/components/Loading';
import {
  List,
} from 'native-base';
import _ from 'lodash';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from 'app/components/ScrollableTabBar';


import * as app from 'app/constants/app';
import * as gui from 'app/constants/gui';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';
import * as asyncdata from 'app/data/asyncdata';

import AppointmentPastItem from 'app/components/AppointmentPastItem';
import AppointmentFutureItem from 'app/components/AppointmentFutureItem';
import withConnect from './withConnect';



class AppointmentList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      shouldFetchData: this.props.shouldFetchData,
      fetchingData: false,
      activeDate: 1,
      rejectAppointmentId: null,
      checkoutSuccessModalVisible: false,
      avatarUrl: '',
    };
    this._listRef = null;
    this._isMounted = false;
    this._tabRefs = {
      root: null,
    };
  }

  // static propTypes = {
  //   data: PropTypes.array,
  //   dataType: PropTypes.oneOf(['past', 'future']),
  //   onFetchData: PropTypes.array,
  // };
  componentWillMount() {
    const { getListAppointmentFuture, getListAppointmentPast } = this.props;
    getListAppointmentFuture(this.props.profilePatient.user_code);
    getListAppointmentPast(this.props.profilePatient.user_code, '202706');
    const { listAppointmentFuture, listAppointmentPast } = this.props;
    const dataAPI = this.props.dataType === 'future' ? listAppointmentFuture : listAppointmentPast;
    this.setState({ data: dataAPI });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isRejecting && !nextProps.isRejecting) {
      if (nextProps.isRejectAppointmentSuccess) {
        const data = _.filter(this.state.data,
          item => item.booking_id !== this.state.rejectAppointmentId);
        this.setState({ data });
        this.props.getListAppointmentFuture(this.props.profilePatient.user_code);
        this.props.getListAppointmentPast(this.props.profilePatient.user_code, '202706');
        this.props.alertWithType('success', 'Từ chối thành công', '');
      } else {
        this.props.alertWithType('error', 'Từ chối thất bại', '');
      }
    }

    const { listAppointmentFuture, listAppointmentPast } = this.props;
    this.setState({ data: this.dataType === 'future' ? listAppointmentFuture : listAppointmentPast });
  }

  static defaultProps = {
    dataType: 'future',
    shouldFetchData: true,
  };


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

  /// Functions ///

  printInfo = () => {
    Logger.debug(`Appointment list data type = ${this.dataType}`);
    Logger.debug(`Appointment list size = ${this.dataSize}`);
    Logger.debug(`Appointment list is busy = ${this.isBusy}`);
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
    // Merge data
    if (fromIndex < currData.length) {
      currData = currData.slice(0, fromIndex);
      currData.push(...newData);
    } else if (fromIndex == currData.length) {
      currData = currData.slice(0);
      currData.push(...newData);
    } else {
      // Error!!!
      throw new Error('Invalid merging data');
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

    if (this.isEmpty) {
      this.onFetchData();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onFetchData = () => {
    const result = asyncdata.getAppointmentData(this.dataType);

    return result;
    // this.setState({ fetchingData: false, data: result });
  }

  onFetchDataDone = (newData, fromIndex) => {
    if (this._isMounted && this.isBusy) {
      this.setState({ fetchingData: false });
      this.mergeData(newData, fromIndex);
    }
    this.printInfo();
  }

  // onClearData = () => {
  //   if (this._isMounted) {
  //     this.setState({ fetchingData: false, data: [] });
  //   }
  // }

  onEndReached = () => {
    if (!this.isEmpty) {
      this.onFetchData();
    }
  }

  onCancelBooking = (item, index) => {
    this.setState({
      ...this.state,
      rejectAppointmentId: item.booking_id,
      checkoutSuccessModalVisible: true,
      avatarUrl: '',
    });
  }

  onPressCancelBooking = () => {
    this.props.rejectAppointment(this.state.rejectAppointmentId);
    this.setState({
      ...this.state,
      checkoutSuccessModalVisible: false,
    });
  }

  /// Render ///
  renderHeader = () => {
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

  onMessage = () => {
    this.props.onMessage();
  }

  onChangeAvailTimeTab = info => {
    if (info.i != info.from) {
      // TODO: !
    }
  }

  renderAvailTimeTabs() {
    // const availTime = this.state.data.availTime || [];
    const doctorData = asyncdata.getDoctorItem();
    const availTime = doctorData.availTime;
    return (
      <View style={styles.tabsViewContainer}>
        <ScrollableTabView
          key="availTime"
          renderTabBar={() => <ScrollableTabBar />}
          ref={root => this._tabRefs.root = root}
          locked
          style={styles.tabsContainer}
          onChangeTab={this.onChangeAvailTimeTab}
          tabBarPosition="top"
        >
          {availTime.map((item, index) => {
            return this.renderAvailTimeTab(item, index);
          })}
        </ScrollableTabView>
      </View>
    );
  }

  renderAvailTimeTab(item, index) {
    const parsedDate = datautils.parseDateTime(item.date, asyncdata.SERVER_DATE_PATTERN);
    const serverDate = asyncdata.getServerDateTime();

    let tabLabel = null;
    if (datautils.dateEqual(parsedDate, serverDate)) {
      // Today
      tabLabel = I18n.t('DetailDoctor.today');
    } else if (datautils.dateEqual(parsedDate, datautils.getTomorrowOf(serverDate))) {
      // Tomorrow
      tabLabel = I18n.t('DetailDoctor.tomorrow');
    } else {
      const weekday = datautils.getWeekDayVIShort(parsedDate);
      const date = datautils.formatDateTime(parsedDate, gui.DISPLAY_DATE_PATTERN);
      tabLabel = weekday + '\n' + date;
    }

    return (
      <View
        style={styles.tabContainer}
        key={index}
        tabLabel={tabLabel}
      >
        {/* {this.renderAvailTimeButtons(item.data)} */}
      </View>
    );
  }

  // #ModalConfirm

  closeCheckoutSuccessModal = () => {
    this.setState({ ...this.state, checkoutSuccessModalVisible: false });
  }

  renderConfirmRejectModal() {
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.state.checkoutSuccessModalVisible}
      >
        <TouchableHighlight onPress={() => this.closeCheckoutSuccessModal()} style={temp.modalFavouriteMask}>
          <TouchableOpacity activeOpacity={1} onPress={() => false} style={temp.containerSmallModal}>
            <View style={temp.containerModalHeader}>
              <Image style={temp.successIcon} source={require('app/assets/images/icon_doctor.png')} />
              <Text style={temp.yellowLabel}>{I18n.t('DetailDoctor.confirm')}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={temp.buttonConfirm} onPress={() => this.closeCheckoutSuccessModal()}>
                  <Text style={styles.textButtonConfirm}>{I18n.t('DetailDoctor.buttonNo')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...temp.buttonConfirm,
                    backgroundColor: '#FF3B30',
                    borderColor: 'transparent',
                    marginLeft: 30,
                  }}
                  onPress={() => this.onPressCancelBooking()}
                >
                  <Text style={{ ...styles.textButtonConfirm, color: '#fff' }}>
                    {I18n.t('DetailDoctor.buttonYes')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableHighlight>
      </Modal>
    );
  }

  // #renderItem
  renderItem(item, index) {
    if (this.dataType === 'future') {
      return (
        <AppointmentFutureItem
          style={styles.futureItemContainer}
          data={item}
          key={index}
          onCancelBooking={() => this.onCancelBooking(item, index)}
          onClickItem={this.props.onClickItem}
        />
      );
    } else {
      return (
        <AppointmentPastItem
          style={styles.pastItemContainer}
          data={item}
          key={index}
          onClickItem={this.props.onClickItem}
          onMessage={this.onMessage}

        />
      );
    }
  }

  setActiveScrollDate = (date) => {
    this.setState({ ...this.state, activeDate: date });
  }
  /// Main Render ///

  render() {
    return (
      <View style={styles.bodyContainer}>
        {/* {
          this.props.dataType == 'past' &&
          this.renderAvailTimeTabs()
        } */}
        <FlatList
          ref={item => this._listRef = item}
          style={styles.rootContainer}
          data={this.state.data}
          keyExtractor={(item, index) => item.booking_id}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          onEndReached={this.onEndReached}
        />
        <Loading isVisible={this.props.isRequestingData} />
        {this.renderConfirmRejectModal()}
      </View>
    );
  }
}

const styles = {
  bodyContainer: {
    flexDirection: 'column',
    paddingBottom: 20
    // flex: 1,
  },
  scrollBar: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    // borderBottomColor: 'red',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    // flex: 1
  },
  scrollBarItemContainer: {
    paddingVertical: 20,
    paddingHorizontal: 7,
    justifyContent: 'center',
    // borderBottomColor: '#fff',
    // borderBottomWidth: 2,
    marginRight: 5,
  },
  scrollBarItemContainerActive: {
    paddingVertical: 20,
    paddingHorizontal: 7,
    justifyContent: 'center',
    marginRight: 5,
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
    ...Platform.select({
      ios: {
        backgroundColor: 'transparent',
        shadowColor: '#6FCF97',
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
    }),
  },
  scrollBarTxtTop: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 14,
    textAlign: 'center',
  },
  scrollBarTxtBottom: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollBarTxtTopActive: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  scrollBarTxtBottomActive: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rootContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    // flex: 1
  },

  container: {
  },

  futureItemContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },

  pastItemContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
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
  tabsViewContainer: {
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingTop: 7,
  },
};
const temp = {
  bgModalSmall: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width - 25,
    height: Dimensions.get('window').height - 350,
  },
  modalFavouriteMask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerSmallModal: {
    paddingTop: 30,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    width: Dimensions.get('window').width - 25,
    height: Dimensions.get('window').height - 450,
    borderRadius: 10,
  },
  yellowLabel: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 21,
    paddingBottom: 10,
    textAlign: 'center',
    padding: 20,
  },
  grayLabel: {
    fontSize: 14,
    fontWeight: '100',
    paddingBottom: 5,
    color: '#4F4F4F'
  },
  containerModalHeader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  buttonConfirm: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 3,
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  textButtonConfirm: {
    fontSize: 16,
    color: '#828282',
  },
};


export default withConnect(AppointmentList);
