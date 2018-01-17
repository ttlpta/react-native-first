/**
 * @providesModule TeleMedicine.Components.Items.AppointmentFutureItem
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import {
  Platform, StyleSheet, View, ScrollView, Dimensions, Text, TextInput,
  Image, ActivityIndicator, TouchableHighlight, TouchableOpacity,
} from 'react-native';
import ShadowView from 'react-native-shadow-view';
import LinearGradient from 'react-native-linear-gradient';
import NiceImage from 'app/components/NiceImage';

import * as app from 'app/constants/app';
import * as gui from 'app/constants/gui';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';
import * as asyncdata from 'app/data/asyncdata';
import withConnect from './withConnect';


const ICON_DOCTOR_DEFAULT = require('app/assets/images/icon_doctor.png');
const ICON_VIEW_VIDEO = require('app/assets/images/icon_view_video.png');
const ICON_VIEW_CHAT = require('app/assets/images/icon_view_chat.png');
const ICON_PAID = require('app/assets/images/icon_checked.png');
const ICON_UNPAID = require('app/assets/images/icon_incomplete.png');

const CHECK_TYPE_MAPPING_VI = {
  online: 'Tư vấn\nOnline',
  direct: 'Khám\ntrực tiếp',
};
const CHECK_TYPE_MAPPING_EN = {
  online: 'Consultant\nOnline',
  direct: 'Examination\nDirect',
};


/**
 * AppointmentFutureItem for displaying an appointment that was done.
 */
class AppointmentFutureItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }

  static propTypes = {
    data: PropTypes.object,
    showAvatar: PropTypes.bool,
  };

  static defaultProps = {
    showAvatar: true,
  };

  /// Events ///

  /// Render ///

  renderTop() {
    return (
      <View style={styles.topContainer}>
        {this.renderLeft()}
        {this.renderRight()}
      </View>
    );
  }

  onCancelBooking = () => {
    this.props.onCancelBooking();
  }

  /// Left view ///

  renderLeft() {
    return (
      <View style={styles.topLeftContainer}>
        {this.renderAvatar()}
        <TouchableOpacity style={styles.cancelContainer} onPress={() => this.onCancelBooking()} >
          <Text style={styles.cancelContainerTxt}>{I18n.t('AppointmentFutureItem.cancelled')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /// Left view - Avatar ///

  renderAvatar() {
    const { doctor_avatar } = this.state.data;

    if (typeof (doctor_vatar) !== 'undefined') {
      if (this.props.showAvatar) {
        return (
          <ShadowView style={styles.avatarContainer}>
            <NiceImage
              style={styles.avatarImage}
              defaultSource={ICON_DOCTOR_DEFAULT}
              source={{uri : doctor_avatar}}
            />
          </ShadowView>
        );
      } else {
        return null;
      }
    } else {
      return (
        <ShadowView style={styles.avatarContainer}>
          <NiceImage
            style={styles.avatarImage}
            defaultSource={ICON_DOCTOR_DEFAULT}
            source={{uri : doctor_avatar}}
          />
        </ShadowView>
      );
    }
  }

  /// Right view ///

  renderRight() {
    return (
      <View style={styles.topRightContainer}>
        {this.renderTitleView()}
        {this.renderAppointmentDatetime()}
        {/* {(Math.random() > 0.5) ? this.renderReminder() : this.renderCheckout()} */}
        { this.renderCheckout() }
      </View>
    );
  }

  /// Right view - Title view ///

  renderTitleView() {
    return (
      <View style={styles.topRightContainerRow}>
        {this.renderTitle()}
      </View>
    );
  }

  renderTitle() {
    const { doctor_code, doctor_name } = this.state.data;
    return (
      <View>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.titleSmallText}
        >
          {doctor_code}
        </Text>
        <Text
          ellipsizeMode='middle'
          numberOfLines={1}
          style={styles.titleBigText}
        >
          {doctor_name}
        </Text>
      </View>
    );
  }

  /// Right view - Appointment DateTime view ///

  renderAppointmentDatetime() {
    // const { datetime } = this.state.data;
    // const parsedDate = datautils.parseDateTime(datetime, asyncdata.SERVER_DATE_TIME_PATTERN);

    return (
      <View style={styles.topRightContainerRow}>
        <View style={styles.datetimeContainer}>
          {this.renderAppointmentTime()}
          {this.renderAppointmentStatus()}
          {this.renderAppointmentDate()}
        </View>
      </View>
    );
  }

  renderAppointmentStatus() {
    // const { checkType } = this.state.data;
    // const text = (this.props.mylanguage == 'vi' ? CHECK_TYPE_MAPPING_VI[checkType] : CHECK_TYPE_MAPPING_EN[checkType]) || checkType;

    return (
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{'Tư vấn\nOnline'}</Text>
      </View>
    );
  }

  renderAppointmentTime() {
    // const time = datautils.formatDateTime(datetime, gui.DISPLAY_TIME_PATTERN);
    const { schedule_start_time } = this.state.data;
    return (
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{ schedule_start_time }</Text>
      </View>
    );
  }

  renderAppointmentDate() {
    const { booking_date } = this.state.data;
    // const weekday = datautils.getWeekDayVIShort(datetime);
    // const date = datautils.formatDateTime(datetime, gui.DISPLAY_DATE_PATTERN);

    return (
      // <Text style={styles.dateText}>{weekday}{'\n'}{date}</Text>
      <Text style={styles.dateText}>{booking_date}</Text>
    );
  }

  /// Bottom view ///

  renderBottom() {
    return (
      <View style={styles.bottomContainer}>
        {this.renderReminder()}
      </View>
    );
  }

  renderReminder() {
    // const { datetime } = this.state.data;
    // const parsedDate = datautils.parseDateTime(datetime, app.SERVER_DATE_TIME_PATTERN);
    // const diff = datautils.dayHourMinDiff(parsedDate, asyncdata.getServerDateTime());

    // let label = null;
    // if (diff[0] > 0) {
    //   label = `${I18n.t('AppointmentFutureItem.timeleft')} ${diff[0]} ${I18n.t('AppointmentFutureItem.day')} ${diff[1]} ${I18n.t('AppointmentFutureItem.hour')} ${diff[2]} ${I18n.t('AppointmentFutureItem.minute')}`;
    // } else if (diff[1] > 0) {
    //   label = `${I18n.t('AppointmentFutureItem.timeleft')}  ${diff[1]} ${I18n.t('AppointmentFutureItem.hour')} ${diff[2]} ${I18n.t('AppointmentFutureItem.minute')}`;
    // } else if (diff[2] > 0) {
    //   label = `${I18n.t('AppointmentFutureItem.timeleft')}  ${diff[2]} ${I18n.t('AppointmentFutureItem.minute')}`;
    // } else {
    //   label = I18n.t('AppointmentFutureItem.letGo');
    // }

    return (
      <View style={styles.reminderContainer}>
        <Text style={styles.reminderText}>{'Cuộc hẹn sắp diễn ra'}</Text>
      </View>
    );
  }

  renderCheckout() {
    const { amount } = this.state.data;
    return (
      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutBtnTxt}>{I18n.t('checkout')}</Text>
        </TouchableOpacity>
        <View style={styles.priceTag}>
          <Text style={styles.priceTagBold}>{amount}</Text>
          <Text style={styles.priceTagCurency}> vnd</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={{ ...styles.rootContainer, ...this.props.style }}>
        {this.renderTop()}
        {/* {this.renderBottom()} */}
      </View>
    );
  }
}

const styles = {
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  checkoutBtn: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#fff'
  },
  checkoutBtnTxt: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3BA51E'
  },
  priceTagBold: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 18
  },
  priceTagCurency: {
    fontSize: 14,
    backgroundColor: 'transparent',
    color: '#fff',
  },
  priceTag: {
    flexDirection: 'row',
    marginLeft: 10
  },
  rowContainer: {
    flexDirection: 'row'
  },
  rootContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  /// Top View ///

  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  /// Top View - Left view ///

  topLeftContainer: {
    flex: 1,
    marginRight: Platform.select({
      ios: 7,
      android: 15,
    }),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: Platform.select({
      ios: 10,
      android: 0,
    }),
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

  /// Bottom View ///

  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 0,
  },

  reminderContainer: {
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingLeft: 20,
    flexDirection: 'row',
    paddingRight: 20,
  },

  cancelContainer: {
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 0, 0, 1.0)',
    paddingHorizontal: Platform.select({
      ios: 19,
      android: 12,
    }),
    flexDirection: 'row',
    marginTop: 10,
  },

  cancelContainerTxt: {
    fontSize: 16,
    color: '#fff',
  },

  reminderText: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontWeight: '400',

  },
  cancelBtn: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontWeight: '400',
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
    fontSize: 18,
    // fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
};

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(AppointmentFutureItem);
