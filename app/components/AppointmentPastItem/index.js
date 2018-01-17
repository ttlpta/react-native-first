/**
 * @providesModule TeleMedicine.Components.Items.AppointmentPastItem
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
import { NavigationActions } from 'react-navigation';
import ShadowView from 'react-native-shadow-view';
import LinearGradient from 'react-native-linear-gradient';

import * as app from 'app/constants/app';
import * as gui from 'app/constants/gui';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';
import * as asyncdata from 'app/data/asyncdata';

import NiceImage from 'app/components/NiceImage';

import {
  ICON_CAMERA, ICON_MESSAGE, ICON_UNPAID, ICON_AGREE2, ICON_CANCEL_RED, ICON_AGREE2_RED
  , ICON_REAL_DOCTOR_DEFAULT, ICON_PAID
} from 'app/constants';
import { APPOINTMENT } from '../../constants/code';

const CHECK_STATUS_MAPPING = {
  done: 'Đã khám',
  cancelled: 'Huỷ bỏ',
  wait: 'Chờ khám',
};

const PAYMENT_STATUS_MAPPING = {
  done: 'Đã thanh toán',
  cancelled: 'Đã hủy',
  wait: 'Đang chờ',
};

// const navigateAction = NavigationActions.navigate({
//   routeName: 'Register',
//   params: {},

//   // navigate can have a nested navigate action that will be run inside the child router
//   action: NavigationActions.navigate({ routeName: 'Register' }),
// });

/**
 * AppointmentPastItem for displaying an appointment that was done.
 */
class AppointmentPastItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  static propTypes = {
    data: PropTypes.object,
    showAvatar: PropTypes.bool,
    onViewHistoryVideo: PropTypes.func,
    onViewHistoryChat: PropTypes.func,
  };

  static defaultProps = {
    showAvatar: true,
  };

  onMessage = () => {
    console.info('click');
    this.props.onMessage();
    // NavigationActions.navigate({ routeName: 'Message' });
    // this.props.navigation.dispatch(navigateAction)
  }

  /// Events ///

  onViewHistoryVideo = () => {
    const func = this.props.onViewHistoryVideo;
    if (func) {
      func(this.state.data);
    }
  }

  onViewHistoryChat = () => {
    const func = this.props.onViewHistoryChat;
    if (func) {
      func(this.state.data);
    }
  }

  /// Render ///

  componentWillMount() {
  }

  renderBody() {
    return (
      <View style={styles.bodyContainer}>
        {this.renderLeft()}
        {this.renderRight()}
      </View>
    );
  }

  /// Left view ///

  renderLeft() {
    const { booking_status } = this.state.data;
    const isCancel = (APPOINTMENT[booking_status] === 'PATIENT_CANCEL');
    return (
      <View style={styles.leftContainer}>
        {this.renderAvatar()}
        {
          isCancel &&
          <TouchableOpacity style={styles.resultContainer}>
            <LinearGradient colors={['#FBC700', '#EAA30A']} style={styles.linearGradient}>
              <Text style={styles.resultContainerTxt}>{I18n.t('result')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        }
      </View>
    );
  }

  /// Left view - Avatar ///

  renderAvatar() {
    const { doctorAvatar } = this.state.data;

    if (typeof (doctorAvatar) !== 'undefined') {
      if (this.props.showAvatar) {
        return (
          <ShadowView style={styles.avatarContainer}>
            <NiceImage
              style={styles.avatarImage}
              defaultSource={{ uri: doctorAvatar }}
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
            defaultSource={ICON_REAL_DOCTOR_DEFAULT}
          />
        </ShadowView>
      );
    }
  }

  /// Left view - Payment info ///

  renderPaymentInfo() {
    const { booking_status } = this.state.data;
    const isCancel = (APPOINTMENT[booking_status] === 'PATIENT_CANCEL');
    return (
      <View style={styles.paymentContainer}>
        {isCancel &&
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.paymentStatusContainer}>
              <Image style={styles.paymentStatusIconVideo} source={ICON_CAMERA} />
              <Text style={styles.paymentPriceCurrency}>{'20:00'}</Text>
            </View>
            <TouchableOpacity onPress={this.onMessage} >
              <View style={styles.paymentStatusContainer}>
                <Image style={styles.paymentStatusIconMessage} source={ICON_MESSAGE} />
                <Text style={styles.paymentStatusText}>{'Chat'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
      </View>
    );
  }

  /// Right view ///

  renderRight() {
    return (
      <View style={styles.rightContainer}>
        {this.renderStatus()}
        {this.renderTitleView()}
        {this.renderPaymentInfo()}
        {/* {this.renderLog()} */}
        {/* {this.renderAppointmentDatetime()} */}
        {/* {this.renderHistoryVideoChat()}  */}
      </View>
    );
  }

  renderStatus() {
    const { booking_status, amount, schedule_start_time, ccycd } = this.state.data;
    const isCancel = (APPOINTMENT[booking_status] === 'PATIENT_CANCEL');
    return (
      <View style={styles.headerStatusContainer}>
        <View style={(isCancel) ? styles.headerStatus : styles.headerCancelStatus}>
          <Text
            style={(isCancel) ? styles.headerStatusTxt : styles.headerStatusCancelTxt}
          >
            {(isCancel) ? `-${amount} ${ccycd}` : I18n.t('appointmentPastItem.canceledExamination')}
          </Text>
        </View>
        <View style={styles.headerStatusTime}>
          <Text style={styles.headerStatusTimeTxt}> {schedule_start_time} </Text>
        </View>
      </View>
    );
  }

  renderLog() {
    return (
      <View style={styles.logContainer}>
        <View style={styles.datetimeBox}>
          <View style={(this.state.data.isCancel) ? styles.datetimeSuccessBoxTop : styles.datetimeRedBoxTop}>
            <Text style={styles.datetimeBoxTopTxt}>14:00</Text>
          </View>
          <View style={styles.datetimeBoxBottom}>
            <Text style={(this.state.data.isCancel) ? styles.datetimeBoxBottomTxtGreen : styles.datetimeBoxBottomTxtRed}>
              <Image source={(this.state.data.isCancel) ? ICON_AGREE2 : ICON_CANCEL_RED} style={styles.icon} />
              {(!this.state.data.isCancel) ?
                I18n.t('appointmentPastItem.cancelled') : I18n.t('appointmentPastItem.done')}
            </Text>
          </View>
        </View>
        <View style={styles.datetimeBox}>
          <View style={(this.state.data.isCancel) ? styles.datetimeSuccessBoxTop : styles.datetimeRedBoxTop}>
            <Text style={styles.datetimeBoxTopTxt}>150,000 <Text style={styles.paymentPriceCurrency}>VNĐ</Text>
            </Text>

          </View>
          <View style={styles.datetimeBoxBottom}>
            <Text style={(this.state.data.isCancel) ? styles.datetimeBoxBottomTxtGreen : styles.datetimeBoxBottomTxtRed}>
              <Image source={(this.state.data.isCancel) ? ICON_AGREE2 : ICON_AGREE2_RED} style={styles.icon} />
              {(!this.state.data.isCancel) ?
                I18n.t('appointmentPastItem.cancelledPay') : I18n.t('appointmentPastItem.donePay')}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  /// Right view - Title view ///

  renderTitleView() {
    return (
      <View style={styles.rightContainerRow}>
        {this.renderTitle()}
      </View>
    );
  }

  renderTitle() {
    const { doctor_code, doctor_name, clinic_name } = this.state.data;
    return (
      <View>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.titleSmallText}
        >
          {clinic_name}
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
    const { datetime } = this.state.data;
    const parsedDate = datautils.parseDateTime(datetime, asyncdata.SERVER_DATE_TIME_PATTERN);

    return (
      <View style={styles.rightContainerRow}>
        <View style={styles.datetimeContainer}>
          {this.renderAppointmentStatus()}
          {this.renderAppointmentTime(parsedDate)}
          {this.renderAppointmentDate(parsedDate)}
        </View>
      </View>
    );
  }

  renderAppointmentStatus() {
    const { checkStatus } = this.state.data;
    const text = CHECK_STATUS_MAPPING[checkStatus] || checkStatus;

    return (
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{text}</Text>
      </View>
    );
  }

  renderAppointmentTime(datetime) {
    const time = datautils.formatDateTime(datetime, gui.DISPLAY_TIME_PATTERN);
    return (
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{time}</Text>
      </View>
    );
  }

  renderAppointmentDate(datetime) {
    const weekday = datautils.getWeekDayVIShort(datetime);
    const date = datautils.formatDateTime(datetime, gui.DISPLAY_DATE_PATTERN);

    return (
      <Text style={styles.dateText}>{weekday}{'\n'}{date}</Text>
    );
  }

  /// Right view - History video/chat ///

  renderHistoryVideoChat() {
    return (
      <View style={styles.rightContainerRow}>
        {this.renderHistoryVideo()}
        {this.renderHistoryChat()}
      </View>
    );
  }

  renderHistoryVideo() {
    return (
      <TouchableOpacity onPress={this.onViewHistoryVideo}>
        <View style={styles.historyItemContainer}>
          <Image style={styles.historyItemIcon} source={ICON_VIEW_VIDEO} />
          <Text style={styles.historyItemText}>Xem lại Video</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderHistoryChat() {
    return (
      <TouchableOpacity onPress={this.onViewHistoryChat}>
        <View style={styles.historyItemContainer}>
          <Image style={styles.historyItemIcon} source={ICON_VIEW_CHAT} />
          <Text style={styles.historyItemText}>Lịch sử chat</Text>
        </View>
      </TouchableOpacity>
    );
  }

  /// Main Render ///

  render() {
    return (
      <View style={{ ...styles.rootContainer, ...this.props.style }}>
        {this.renderBody()}
      </View>
    );
  }
}

const styles = {
  resultContainer: {
    marginTop: 10,
  },

  resultContainerTxt: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.75)',
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerStatusTime: {
    position: 'absolute',
    right: 15,
    top: 15
  },
  headerStatusTimeTxt: {
    color: '#fff'
  },
  headerStatusContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 10,
  },
  headerStatus: {
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#fff',
    borderRadius: 100 / 2,
    borderWidth: 1,
  },
  headerCancelStatus: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#fff',
    borderRadius: 100 / 2,
    borderWidth: 1,
  },
  headerStatusTxt: {
    color: '#fff',
    fontWeight: 'bold'
  },
  headerStatusCancelTxt: {
    color: '#fff',
    // fontWeight: 'bold'
    // backgroundColor: 'red'
  },
  logContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datetimeBox: {
    borderColor: '#fff',
    borderWidth: 1,
    flexDirection: 'column',
    borderRadius: 3,
    marginRight: 5
  },
  datetimeSuccessBoxTop: {
    backgroundColor: '#379524',
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  datetimeRedBoxTop: {
    backgroundColor: '#E80E0E',
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  datetimeBoxTopTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'center',
  },
  datetimeBoxBottom: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  datetimeBoxBottomTxtGreen: {
    fontWeight: '200',
    fontSize: 14,
    color: '#379524',
    textAlign: 'center',
    justifyContent: 'center',
  },
  datetimeBoxBottomTxtRed: {
    fontWeight: '200',
    fontSize: 14,
    color: '#E80E0E',
    textAlign: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 14,
    height: 14,
    marginTop: 2,
  },
  rootContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  /// Body view ///

  bodyContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'flex-start',
    flex: 1
  },

  /// Body view - Left view ///

  leftContainer: {
    marginRight: Platform.select({
      ios: 7,
      android: 0,
    }),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    flex: 1,
  },

  /// Body view - Left view - Avatar view ///

  avatarContainer: {
    width: 94,
    height: 94,
    borderWidth: 2,
    borderRadius: 47,
    borderColor: 'rgb(255, 255, 255)',
    // shadow
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.7,
    shadowColor: 'rgb(0, 255, 0)',
  },

  avatarImage: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 45,
  },

  /// Body view - Left view - Payment info ///

  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
    // marginLeft: 10,
    flex: 1
  },

  paymentPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  paymentPriceCurrency: {
    color: '#fff',
    fontFamily: 'Roboto-Regular',
    fontSize: 14
  },

  paymentStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 100 / 2
  },

  paymentStatusIconVideo: {
    width: 19,
    height: 11,
    resizeMode: 'contain',
    marginRight: 6
  },

  paymentStatusIconMessage: {
    width: 17,
    height: 14,
    resizeMode: 'contain',
    marginRight: 6
  },

  paymentStatusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: '#fff',
    fontFamily: 'Roboto-Regular',

  },

  /// Body view - Right view ///

  rightContainer: {
    flexDirection: 'column',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    // backgroundColor: '#fff',
    flex: 3,
    marginLeft: 10,
    // position: 'relative',
    // top: -15
  },

  rightContainerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  /// Body view - Right view - Title view ///

  titleSmallText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 1.0)',
  },

  titleBigText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#FFD638',
  },

  /// Body view - Right view - Date time view ///

  datetimeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },

  /// Body view - Right view - Date time view - status ///

  statusContainer: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
  },

  statusText: {
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 14,
    color: '#236713',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  /// Body view - Right view - Date time view - Time ///

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

  /// Body view - Right view - Date time view - Date ///

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

  /// Body view - Right view - History Video/Chat ///

  historyItemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 10,
  },

  historyItemIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 5,
  },

  historyItemText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
};

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(AppointmentPastItem);
