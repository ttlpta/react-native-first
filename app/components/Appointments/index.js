/**
 * @providesModule TeleMedicine.Components.Screens.Appointments
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import {
  StyleSheet, View, ScrollView, Dimensions, Text, TextInput, Image,
  TouchableHighlight, TouchableOpacity, Alert, Platform,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { Logger } from '@onaclover/react-native-utils';
import LinearGradient from 'react-native-linear-gradient';
import NiceImage from 'app/components/NiceImage';
import ShadowView from 'react-native-shadow-view';
import DropdownAlert from 'react-native-dropdownalert';

import * as app from 'app/constants/app';
import * as gui from 'app/constants/gui';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';
import * as asyncdata from 'app/data/asyncdata';

import withConnect from './withConnect';

import LeftCenterRight from 'app/components/LeftCenterRight';
import TabBar from 'app/components/TabBar';
import AppointmentList from 'app/components/AppointmentList';
import AppointmentPastItem from 'app/components/AppointmentPastItem';
import AppointmentFutureItem from 'app/components/AppointmentFutureItem';

import { BG_IMAGE, ICON_GOBACK, ICON_CALENDAR, ICON_DOCTOR_DEFAULT, ICON_SMALL_PHONE } from 'app/constants';
/**
 * Appointment list view.
 */
class Appointments extends React.PureComponent {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      userid: this.props.userid || '*',
    };
    this._tabRefs = {
      root: null,
      future: null,
      past: null,
    };
  }

  static propTypes = {
  };

  static defaultProps = {
  };

  /// Getters ///

  get allTabs() {
    return [this._tabRefs.future, this._tabRefs.past];
  }

  get activeTabIndex() {
    return this._tabRefs.root.state.currentPage;
  }

  get activeTab() {
    return this.allTabs[this.activeTabIndex];
  }

  /// Events ///

  onMenu = () => {
    this.props.navigation.navigate('DrawerOpen');
  }

  onGoBack = () => {
    this.props.navigation.goBack();
  }

  onCalling = () => {
    this.props.navigation.navigate('Calling');
  }

  onChangeResultTab = info => {
    if (info.i != info.from) {
      this.doFetchData();
    }
  }

  onFetchData = async (ref, onFetchDone) => {
    const { userid } = this.state;
    const dataSize = ref.dataSize;
    if (userid && userid.length > 0) {
      // TODO: send userid to server and get some result
      Logger.debug(`Appointments.onFetchData, userid=${userid}`);

      // Simualte an async call (should be replaced by actual business call)
      await sysutils.sleep(1000);
      const result = asyncdata.getAppointmentData(ref.dataType);
      onFetchDone(result, ref.dataSize);

      // Simulate the case there is no more data
      const hasMore = datautils.randomBool();
      ref.shouldFetchData = hasMore;
    } else {
      onFetchDone([], ref.dataSize);
    }
  }

  /// Functions ///

  clearAllData = () => {
    this.allTabs.forEach(function (item) {
      if (item) {
        item.onClearData();
        // Enable fetching data
        item.shouldFetchData = true;
      }
    });
  }

  doFetchData = async (text = null) => {
    this.clearAllData();

    const userid = text || this.state.userid;
    Logger.debug(`Appointments.doFetchData, userid=${userid}`);

    if (userid && userid.length > 0) {
      this.activeTab.onFetchData();
    }
  }

  renderTopFirst() {
    return (
      <View style={styles.topContainer}>
        <View style={styles.topLeftContainer}>
          <ShadowView style={styles.avatarContainer}>
            <NiceImage
              style={styles.avatarImage}
              defaultSource={ICON_DOCTOR_DEFAULT}
              source={ICON_DOCTOR_DEFAULT}
            />
          </ShadowView>
          <TouchableOpacity style={styles.cancelContainer}>
            <Text style={styles.cancelContainerTxt}>{I18n.t('waiting')}...</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.topRightContainer}>
          <View style={styles.topRightContainerRow}>
            <View>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={styles.titleSmallText}
              >
                Bác sĩ chuyên khoa I
              </Text>
              <Text
                ellipsizeMode='middle'
                numberOfLines={1}
                style={styles.titleBigText}
              >
                Nguyễn Văn Nam
              </Text>
            </View>
          </View>
          <View style={styles.topRightContainerRow}>
            <View style={styles.datetimeContainer}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>9:00</Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>Tư vấn{'\n'} Online</Text>
              </View>
              <Text style={styles.dateText}>Thứ 4{'\n'}25/06/2017</Text>
            </View>
          </View>
          <View>
          <TouchableOpacity onPress={ this.onCalling } style={{ flexDirection: 'row' }}>
            <LinearGradient colors={['#FBC700', '#EAA30A']} style={styles.linearGradient}>
                <Image source={ ICON_SMALL_PHONE } style={{ width: 16, height: 16 }}/>
                <Text style={ styles.buttonText } >
                  {I18n.t('joinTheMeeting')}
                </Text>
            </LinearGradient>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  /// Header View ///

  renderHeader() {
    return (
      <LeftCenterRight
        style={styles.headerContainer}
        left={this.renderGoBack()}
        body={this.renderHeaderTitle()}
      />
    );
  }

  renderHeaderTitle() {
    return (
      <View style={styles.headerTitleContainer}>
        <Image style={styles.headerTitleIcon} source={ICON_CALENDAR} />
        <Text style={styles.headerTitleText}>{I18n.t('appointment.header')}</Text>
      </View>
    );
  }

  renderGoBack() {
    return (
      <TouchableOpacity onPress={this.onGoBack}>
        <Image style={styles.goBackIcon} source={ICON_GOBACK} />
      </TouchableOpacity>
    );
  }

  renderMenu() {
    return (
      <TouchableOpacity onPress={this.onMenu}>
        <Image style={styles.menuIcon} source={ICON_MENU} />
      </TouchableOpacity>
    );
  }

  /// Body View ///

  renderBody() {
    const tabsData = [{
      heading: I18n.t('appointment.heading1'),
      dataType: 'future',
    }, {
      heading: I18n.t('appointment.heading2'),
      dataType: 'past',
    }];

    return (
      <View style={styles.bodyContainer}>
        <ScrollableTabView
          renderTabBar={() => <TabBar />}
          ref={item => this._tabRefs.root = item}
          style={styles.tabsContainer}
          onChangeTab={this.onChangeResultTab}
          tabBarPosition="top"
          initialPage={0}
        >
          {tabsData.map((item, index) => {
            return this.renderTab(item, index);
          })}
        </ScrollableTabView>
      </View>
    );
  }

  onMessage = () => {
    console.info('click');
    this.props.navigation.navigate('Message');
    // NavigationActions.navigate({ routeName: 'Message' });
    // this.props.navigation.dispatch(navigateAction)
  }

  rendeFirstItem =  (item ) => {
    if (item.dataType === 'future') {
      // await sysutils.sleep(1000);
      return (this.renderTopFirst());
    } else {
      return null;
    }
  }

  renderTab(item, index) {
    return (
      <ScrollView
        key={item.dataType}
        style={styles.tabContainer}
        tabLabel={item.heading}
      >
        {
          this.rendeFirstItem(item)
        }
        <AppointmentList
          ref={tab => this._tabRefs[item.dataType] = tab}
          data={[]}
          dataType={item.dataType}
          onFetchData={this.onFetchData}
          onMessage={this.onMessage}
          alertWithType={ (type, title, msg) => this.dropdown.alertWithType(type, title, msg) }
        />
      </ScrollView>
    );
  }

  /// Main render ///

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={BG_IMAGE}
          style={styles.rootBgImage}
        />
        <View style={styles.rootContainer}>
          {this.renderHeader()}
          {this.renderBody()}
        </View>
        <DropdownAlert
          ref={(ref) => this.dropdown = ref}
        />
      </View>
    );
  }
}

/** Screen styles */
const styles = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  rootBgImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 10,
    backgroundColor: 'transparent'
  },

  /// Header view ///

  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 10,

  },

  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitleText: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  headerTitleIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 7,
  },

  menuIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 10,
  },

  goBackIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },

  /// Body view ///

  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  /// Body view - Search result tabs ///

  tabsContainer: {
  },

  tabContainer: {
  },
  topContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)'
  },

  /// Top View - Left view ///

  topLeftContainer: {
    // marginRight: Platform.select({
    //   ios: 7,
    //   android: 15,
    // }),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 5
  },

  /// Top View - Left view - Avatar view ///

  avatarContainer: {
    width: 104,
    height: 104,
    borderWidth: 2,
    borderRadius: 52,
    borderColor: 'rgb(255, 255, 255)',
    // shadow
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.7,
    shadowColor: 'rgb(0, 255, 0)',
  },

  avatarImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 50,
  },

  /// Top View - Right view ///

  topRightContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 10
  },

  topRightContainerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  /// Top View - Right view - Title view ///

  titleSmallText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 1.0)',
  },

  titleBigText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#FFD638',
  },

  /// Top View - Right view - Date time view ///

  datetimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    top: -15
  },

  /// Top View - Right view - Date time view - status ///

  statusContainer: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1.0)',
  },

  statusText: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 1.0)',
    textAlign: 'center',
    textAlignVertical: 'center', // Android only
  },

  /// Top View - Right view - Date time view - Time ///

  timeContainer: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1.0)',
  },

  timeText: {
    paddingLeft: 7,
    paddingRight: 7,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 1.0)',
    textAlignVertical: 'center', // Android only
  },

  /// Top View - Right view - Date time view - Date ///

  dateContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  dateText: {
    fontSize: 14,
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  cancelContainer: {
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 13,
    marginTop: 10
  },

  cancelContainerTxt: {
    fontSize: 16,
    color: '#fff',
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 15,
    // fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: 'rgba(0, 0, 0, 0.8)',
    backgroundColor: 'transparent',
  },
};

export default withConnect(Appointments);
