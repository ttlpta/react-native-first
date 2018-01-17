import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';

import {
  StyleSheet, View, ScrollView, Dimensions, Alert,
  TouchableHighlight, TouchableOpacity, Linking, PickerIOS,
  Text, TextInput, Image, Switch, Modal, Input
} from 'react-native';
import ShadowView from 'react-native-shadow-view';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DropdownAlert from 'react-native-dropdownalert';
import DatePicker from 'react-native-datepicker';

import { Logger } from '@onaclover/react-native-utils';

import LinearGradient from 'react-native-linear-gradient';
import ModalPicker from 'react-native-modal-picker';
import { Thumbnail } from 'native-base';

import * as app from 'app/constants/app';
import * as gui from 'app/constants/gui';
import { priceFormat } from 'app/utils';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';
import * as asyncdata from 'app/data/asyncdata';

import * as utils from 'app/utils';
import withConnect from './withConnect';

import LeftCenterRight from 'app/components/LeftCenterRight';
import NiceImage from 'app/components/NiceImage';
import SearchBar from 'app/components/SearchBar';
import ScrollableTabBar from 'app/components/ScrollableTabBar';
import DescView from 'app/components/DescView';
import ClinicDoctorList from 'app/components/ClinicDoctorList';
import ClinicDoctorBaseItem from 'app/components/ClinicDoctorBaseItem';
import Loading from 'app/components/Loading';

const ICON_BG = require('app/assets/images/screen_bg.png');
const ICON_MENU = require('app/assets/images/icon_menu.png');
const ICON_GOBACK = require('app/assets/images/back.png');
const ICON_DOCTOR_DEFAULT = require('app/assets/images/icon_doctor.png');
const ICON_SIDE_BUTTON_BG = require('app/assets/images/icon_side_item_bg.png');
const ICON_BOOKING = require('app/assets/images/icon_booking.png');
const ICON_FAV_ON = require('app/assets/images/icon_favorite_on.png');
const ICON_FAV_OFF = require('app/assets/images/icon_favorite_off.png');
const ICON_ECOMEDIC = require('app/assets/images/icon_ecomedic.png');
const ICON_CHECKED = require('app/assets/images/icon_checked.png');

import { ICON_STAR_ACTIVE, ICON_STAR_INACTIVE } from 'app/constants';
/**
 * Detailed Doctor screen.
 */
class DetailDoctor extends React.PureComponent {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      healthCheckOnline: false,
      favouriteModalVisible: false,
      optionService: 'Tư vấn online',
      checkoutModalVisible: false,
      checkoutSuccessModalVisible: false,
      activeStar: [true, true, true, true, true],
      doctor_code: "D-2",
      doctor_name: "Khánh Lê",
      user_code: "VN01USE0000008",
      booking_date: this.getToday(),
      schedule_start: null,
      service_id: "online",
      service_label: I18n.t('DetailDoctor.consultantOnline'),
      date: this.getToday('y-m-d'),
    };
    this._tabRefs = {
      root: null,
    };
  }

  static propTypes = {
    data: PropTypes.object,
  };

  static defaultProps = {
    data: asyncdata.getDoctorItem(),
  };

  componentWillMount() {
    const { checkoutModalVisible, schedule_start } = this.props.navigation.state.params;

    this.setState({ 
      data: this.props.navigation.state.params, 
      checkoutModalVisible, 
      schedule_start,
      optionServicePrice : (!_.isUndefined(schedule_start)) ? schedule_start.services[0].service_price : '',
      service_name : (!_.isUndefined(schedule_start)) ? schedule_start.services[0].service_name : '',
      ccycd : (!_.isUndefined(schedule_start)) ? schedule_start.services[0].ccycd : '',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isBookingDoctor && !nextProps.isBookingDoctor) {
      this.setState({ checkoutModalVisible: false });
      if (nextProps.isBookingSuccess) {
        this.setState({ checkoutSuccessModalVisible: true });
      } else {
        this.dropdown.alertWithType('error', 'Đặt lịch hẹn thất bại', nextProps.bookingErrorMsg);
      }
    }
  }


  get allTabs() {
    return [];
  }

  get activeTabIndex() {
    return this._tabRefs.root.state.currentPage;
  }

  get activeTab() {
    return this.allTabs[this.activeTabIndex];
  }


  onMenu = () => {
    this.props.navigation.navigate('DrawerOpen');
  }

  onGoBack = () => {
    this.props.navigation.goBack();
  }

  onClickBooking = () => {
    Logger.debug(`DetailDoctor.onClickBooking`);
  }

  onChangeFavorite = () => {
    const { favorite } = this.state.data;

    this.setState({ ...this.state, data: { ...this.state.data, favorite: !favorite } });
  }

  openRankingPopup = () => {
    this.setState({ ...this.state, favouriteModalVisible: true });
  }

  onViewDescOnEcoWebsite = () => {
    Linking.openURL(this.state.data.seo_url);
  }

  onSelectHealthCheckOnline = () => {
    if (!this.state.healthCheckOnline) {
      this.setState({ healthCheckOnline: true });
    }
  }

  onSelectHealthCheckDirect = () => {
    if (this.state.healthCheckOnline) {
      this.setState({ healthCheckOnline: false });
    }
  }

  getToday(format = 'ymd') {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd
    }

    if (mm < 10) {
      mm = '0' + mm
    }

    const date = (format == 'ymd') ? `${yyyy}${mm}${dd}` : yyyy + '-' + mm + '-' + dd;
    return date;
  }

  onChangeAvailTimeTab = info => {
    if (info.i != info.from) {
      // TODO: !
    }
  }

  onSelectAvailTime = (value, index) => {
    this.setState({ checkoutModalVisible: true, schedule_start: value });
  }

  /// Header View ///

  renderHeader() {
    return (
      <LeftCenterRight
        style={styles.headerContainer}
        left={this.renderGoBack()}
      />
    );
  }

  renderMenu() {
    return (
      <TouchableOpacity onPress={this.onMenu}>
        <Image style={styles.menuIcon} source={ICON_MENU} />
      </TouchableOpacity>
    );
  }

  renderGoBack() {
    return (
      <TouchableOpacity onPress={this.onGoBack}>
        <Image style={styles.goBackIcon} source={ICON_GOBACK} />
      </TouchableOpacity>
    );
  }

  /// Body View ///

  renderBody() {
    return (
      <View style={styles.bodyContainer}>
        <ScrollView>
          {this.renderFavouriteModal()}
          {this.renderCheckoutModal()}
          {this.renderCheckoutSuccessModal()}
          {this.renderAvatarView()}
          {this.renderTitleView()}
          {this.renderDescView()}
          {/* {this.renderOptionsView()} */}
          {this.renderAvailTimeTabs()}
        </ScrollView>
      </View>
    );
  }

  changeActiveStar = (num) => {
    const actives = _.range(num).map(() => true);
    const inactives = _.range(5 - num).map(() => false);
    const activeStar = [...actives, ...inactives];

    this.setState({ ...this.state, activeStar });
  }

  renderFavouriteModal() {
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.state.favouriteModalVisible}
      >
        <TouchableHighlight onPress={() => this.closeFavourireModal()} style={temp.modalFavouriteMask}>
          <TouchableOpacity activeOpacity={1} onPress={() => false} style={temp.containerModal}>
            <Image style={temp.bgModal} source={require('./../../assets/images/bg-modal-fauvorite.png')} />
            <View style={temp.containerModalStar}>
              {
                this.state.activeStar.map((activeStarBoolean, index) => {
                  return (
                    <TouchableOpacity
                      key={'activeStar' + index}
                      style={{ paddingHorizontal: 3 }}
                      onPress={() => this.changeActiveStar(index + 1)}
                    >
                      <Image style={temp.starImage} source={(activeStarBoolean) ? ICON_STAR_ACTIVE : ICON_STAR_INACTIVE} />
                    </TouchableOpacity>
                  )
                })
              }
            </View>
            <View style={temp.containerModalHeader}>
              <Text style={temp.redLabel}>{I18n.t('DetailDoctor.rank')}</Text>
              <Text style={temp.guide}>{I18n.t('DetailDoctor.touchStar')}</Text>
            </View>
            <TextInput
              style={temp.commentInput}
              placeholder={I18n.t('DetailDoctor.phComment')}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              textAlignVertical={'top'}
              onSubmitEditing={() => console.log('Thanh cong')}
            />
            <LinearGradient
              colors={['#ffffff', '#FBEBAF',]}
              style={temp.sendButton}
            >
              <Image source={require('./../../assets/images/paper_air_plane_icon.png')} style={temp.iconSend} />
              <Text style={temp.sendButtonTxt}>
                {I18n.t('DetailDoctor.send')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </TouchableHighlight>
      </Modal>
    );
  }

  onSelectServiceType = option => {
    this.setState({ optionServicePrice: option.value });
    this.setState({ service_name: option.label });
    this.setState({ ccycd: option.ccycd });
  }

  setBookingDate = (date) => {
    const formatBookingDate = date.replace(new RegExp('-', 'g'), '');

    this.setState({ date, booking_date: formatBookingDate });
  }
  
  renderCheckoutModal() {
    const { speciality } = this.state.data;
    const specialityStr = _.isArray(speciality) ? speciality.join(', ') : speciality;
    const { schedule_start } = this.state;
    const dataDropdown = [];
    if (!_.isUndefined(schedule_start)) {
      _.forEach(schedule_start.services, (value, key) => {
        dataDropdown.push({ key, label: value.service_name, value: value.service_price, ccycd : value.ccycd });
      });
    }
    

    return (
      schedule_start && 
      <Modal
        animationType={'fade'}
        transparent
        visible={this.state.checkoutModalVisible}
      >
        <TouchableHighlight onPress={() => this.closeCheckoutModal()} style={temp.modalFavouriteMask}>
          <TouchableOpacity activeOpacity={1} onPress={() => false} style={temp.containerModal}>
            <Image style={temp.bgModal} source={require('./../../assets/images/bg-modal-fauvorite.png')} />
            <View style={temp.containerModalHeader}>
              <Thumbnail large source={ICON_DOCTOR_DEFAULT} />
              <Text style={temp.nameDoctor}>{ this.state.data.doctor_name }</Text>
              <Text style={temp.greenLabel}>{ specialityStr }</Text>
            </View>
            <View style={temp.containerModalCalendar}>
              <View style={temp.containerModalCalendarItem}>
                <Text style={temp.greenDot}>&#9679; </Text>
                <Text style={temp.txtSmall}>{I18n.t('DetailDoctor.service')} </Text>
                <ModalPicker
                  cancelText={'Trở về'}
                  cancelTextStyle={{fontWeight: '600', color: 'rgba(0,118,255,0.9)'}}
                  data={dataDropdown}
                  onChange={option => { this.onSelectServiceType(option) }}
                  style={temp.pickerType}>
                  <View style={{ flexDirection : 'row' }}>
                    <Text style={temp.txtPicker}>{ this.state.service_name }</Text>
                  </View>
                </ModalPicker>
                <Text style={temp.txtPickerArrowDown}>&#9660;</Text>
              </View>
              <View style={temp.containerModalCalendarItem}>
                <Text style={temp.greenDot}>&#9679; </Text>
                <Text style={[temp.txtSmall]}>{I18n.t('DetailDoctor.hour')} </Text>
                <Text style={temp.txtBold}>{this.state.schedule_start.hour}</Text>
              </View>
              <View style={temp.containerModalCalendarItem}>
                <Text style={temp.greenDot}>&#9679; </Text>
                <Text style={temp.txtSmall}>{I18n.t('DetailDoctor.dateTime')} </Text>
                <DatePicker
                  style={{ flex: 4, padding: 0, position: 'relative', bottom: 12, right: 25 }}
                  mode="date"
                  date={this.state.date}
                  showIcon={false}
                  placeholder={this.state.date}
                  format="YYYY-MM-DD"
                  minDate={this.getToday('y-m-d')}
                  confirmBtnText="Chọn ngày"
                  cancelBtnText="Huỷ"
                  customStyles={{
                    dateInput: {
                      padding: 0,
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                    },
                    dateText: { color: '#000', fontWeight: 'bold' }
                  }}
                  onDateChange={(date) => this.setBookingDate(date)}
                />
                <Text style={temp.txtPickerArrowDown}>&#9660;</Text>
              </View>
              <View style={temp.containerModalCalendarItem}>
                <Text style={temp.greenDot}>&#9679; </Text>
                <Text style={temp.txtSmall}>{I18n.t('DetailDoctor.consultantFee')} </Text>
                <Text style={temp.txtBold}>{ priceFormat(this.state.optionServicePrice) } 
                &nbsp;&nbsp;<Text style={styles.currency}>{ schedule_start.services[0].ccycd }</Text>
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => this.openCheckoutSuccessModal()}>
              <LinearGradient
                colors={['#ffffff', '#FBEBAF',]}
                style={temp.sendButton}
              >
                <Image source={require('./../../assets/images/checkoutnIcon.png')} style={temp.iconSend} />
                <Text style={temp.sendButtonTxt}>
                  &nbsp;&nbsp;{I18n.t('DetailDoctor.payAppointment')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableHighlight>
      </Modal>
    );
  }

  _onPress = () => {
    this.closeCheckoutSuccessModal();
    this.props.navigation.navigate('Appointments');
  }

  renderCheckoutSuccessModal() {
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.state.checkoutSuccessModalVisible}
      >
        <TouchableHighlight onPress={() => this.closeCheckoutSuccessModal()} style={temp.modalFavouriteMask}>
          <TouchableOpacity activeOpacity={1} onPress={() => false} style={temp.containerSmallModal}>
            <Image style={temp.bgModalSmall} source={require('./../../assets/images/bg-modal-favourite-small.png')} />
            <View style={temp.containerModalHeader}>
              <Image style={temp.successIcon} source={require('./../../assets/images/success-icon.png')} />
              <Text style={temp.yellowLabel}>{I18n.t('DetailDoctor.complete')}</Text>
              <Text style={temp.grayLabel}>{I18n.t('DetailDoctor.paySuccess')}</Text>
            </View>
            <LinearGradient
              colors={['#ffffff', '#FBEBAF',]}
              style={temp.sendButton}
            >
              <Image source={require('./../../assets/images/calendar.png')} style={temp.iconSend} />
              <Text style={temp.sendButtonTxt} onPress={this._onPress}>
                &nbsp;&nbsp;{I18n.t('DetailDoctor.viewAppointment')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </TouchableHighlight>
      </Modal>
    );
  }

  closeFavourireModal = () => {
    this.setState({ ...this.state, favouriteModalVisible: false });
  }

  closeCheckoutModal = () => {
    this.setState({ ...this.state, checkoutModalVisible: false });
  }

  openCheckoutSuccessModal = () => {
    const bookingData = {
      doctor_code: this.state.doctor_code,
      doctor_name: this.state.data.doctor_name,
      user_code: this.state.user_code,
      booking_date: this.state.booking_date,
      schedule_start: this.state.schedule_start.hour,
      service_name: this.state.service_name,
      service_price: this.state.optionServicePrice,
      ccycd : this.state.ccycd
    };
    this.props.bookingDoctor(bookingData);
    
  }

  closeCheckoutSuccessModal = () => {
    this.setState({ ...this.state, checkoutSuccessModalVisible: false });
  }

  /// Body View - Title view ///

  renderTitleView() {
    const { speciality, doctor_name } = this.state.data;
    const formatSpeciality = _.isArray(speciality) ? speciality.join(', ') : speciality;
    return (
      <View
        key="title"
        style={styles.titleContainer}
      >
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.titleText}
        >
          {formatSpeciality}
        </Text>
        <Text
          ellipsizeMode="middle"
          numberOfLines={1}
          style={styles.nameText}
        >
          {doctor_name}
        </Text>
      </View>
    );
  }

  /// Body View - Avatar view ///

  renderAvatarView() {
    return (
      <View
        key="avatar"
        style={styles.avatarViewContainer}
      >
        {this.renderSideItemLeft()}
        {this.renderAvatar()}
        {this.renderSideItemRight()}
      </View>
    );
  }

  renderAvatar() {
    const { avatar_url } = this.state.data;
    return (
      <ShadowView style={styles.avatarContainer}>
        <NiceImage
          style={styles.avatarImage}
          defaultSource={ICON_DOCTOR_DEFAULT}
          source={{ uri : avatar_url }}
        />
      </ShadowView>
    );
  }

  renderSideItemLeft() {
    return (
      <View style={styles.sideItemContainer}>
        <TouchableOpacity onPress={this.onClickBooking}>
          <View style={styles.sideIconOuterContainer}>
            <Image
              style={styles.sideIconInner}
              source={ICON_SIDE_BUTTON_BG}
            >
              <Image
                style={styles.sideContainer}
                source={ICON_BOOKING}
              />
            </Image>
          </View>
        </TouchableOpacity>
        {this.renderPriceDetail()}
      </View>
    );
  }

  renderPriceDetail() {
    // const price = this.state.data.price_list + " VNĐ" + I18n.t('DetailDoctor.turnExamination');
    // Emphasizes any number in the price string
    const { price_list } = this.state.data;
    const priceOfDoctor = _.find(price_list, price =>
      (typeof (price.duration) !== 'undefined' ? price.type === 'C' : price.type === 'D')
    );
    return (
      <View style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'transparent', flexDirection: 'row' }}>
          {this.renderPrice(utils.priceFormat(priceOfDoctor.price))}
          <Text style={temp.posPriceText} > {priceOfDoctor.ccy}</Text>
        </View>
        <Text style={temp.posPriceText}>{I18n.t('DetailDoctor.turnExamination')}</Text>
      </View>

    );
  }
  renderPrice(price) {
    return (
      <Text
        ellipsizeMode="tail"
        numberOfLines={2}
        style={temp.posPriceText}
      >
        {price}
      </Text>
    );
  }

  renderSideItemRight() {
    return (
      <View style={styles.sideItemContainer}>
        <TouchableOpacity onPress={this.onChangeFavorite}>
          <View style={styles.sideIconOuterContainer}>
            <Image
              style={styles.sideIconInner}
              source={ICON_SIDE_BUTTON_BG}
            >
              <Image
                style={styles.sideContainer}
                source={ICON_FAV_ON}
              />
            </Image>
          </View>
        </TouchableOpacity>
        <Text
          style={styles.sideItemText}
          ellipsizeMode="tail"
          numberOfLines={2}
        >
          {I18n.t('DetailDoctor.saveFavouritePlace')}
        </Text>
      </View>
    );
  }

  /// Body View - Description view ///

  renderDescView() {
    const { data } = this.state;
    return (
      <View
        key="desc"
        style={styles.descViewContainer}
      >
        <View style={styles.descTopContainer} />
        <View style={styles.descMainContainer}>
          <DescView
            style={styles.descTextContainer}
            numberOfLines={5}
            textAlign='left'
            showMoreItem={this.renderShowLessMoreButton(true)}
            showLessItem={this.renderShowLessMoreButton(false)}
          >
            <Text style={styles.descText}>{data.description}</Text>
          </DescView>
          {this.renderViewOnEcoWebsiteButton()}
        </View>
      </View >
    );
  }

  renderShowLessMoreButton(showMore) {
    return showMore ?
      <Text style={styles.descShowMoreText}>{I18n.t('DetailDoctor.expand')} &#9660;</Text> :
      <Text style={styles.descShowMoreText}>{I18n.t('DetailDoctor.collapse')} &#9650;</Text>;
  }

  renderViewOnEcoWebsiteButton() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.viewOnEcoWebsiteContainer}>
          <TouchableOpacity onPress={this.onViewDescOnEcoWebsite}>
            <View style={styles.viewOnEcoWebsiteInnerContainer}>
              <Text style={styles.viewOnEcoWebsiteText}>{I18n.t('DetailDoctor.viewAbove')}</Text>
              <Image style={styles.viewOnEcoWebsiteIcon} source={ICON_ECOMEDIC} />
              <Text style={styles.viewOnEcoWebsiteText}>{I18n.t('DetailDoctor.ecomedic')} &#10095;</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /// Body View - Options view ///

  renderOptionsView() {
    return (
      <View
        key="options"
        style={styles.optionsContainer}
      >
        {this.renderHealthCheckButton(true)}
        {this.renderHealthCheckButton(false)}
      </View>
    );
  }

  renderHealthCheckButton(checkOnline) {
    const isActive = this.state.healthCheckOnline === checkOnline;
    const textStyle = isActive ?
      styles.optionHeathCheckActiveText : styles.optionHeathCheckText;
    const containerStyle = isActive ?
      styles.optionHeathCheckActiveContainer : styles.optionHeathCheckContainer;

    const checkIcon = isActive ?
      <Image style={styles.optionHeathCheckIcon} source={ICON_CHECKED} /> :
      null;

    const text = checkOnline ?
      <Text style={textStyle}>{I18n.t('DetailDoctor.consultantOnline')}</Text> :
      <Text style={textStyle}>{I18n.t('DetailDoctor.consultantDirect')}</Text>;

    const callback = checkOnline ? this.onSelectHealthCheckOnline :
      this.onSelectHealthCheckDirect;

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={callback}
      >
        {checkIcon}{text}
      </TouchableOpacity>
    );
  }

  /// Body View - Avail time tabs ///

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
        {this.renderAvailTimeButtons(item.data)}
      </View>
    );
  }

  renderAvailTimeButtons(data) {
    const items = [];
    for (let idx = 0; idx < data.length; idx += 1) {
      const value = data[idx];
      items.push(
        <Text
          style={styles.availTimeText}
          key={idx}
          onPress={() => {
            this.onSelectAvailTime(value, idx)
          }}
        >
          {value}
        </Text>
      );
    }
    return (
      <View style={styles.availTimeContainer}>
        {items}
      </View>
    );
  }

  /// Main render ///

  render() {
    return (
      <Image
        source={ICON_BG}
        style={styles.rootBgImage}
      >
        <View style={styles.rootContainer}>
          {this.renderHeader()}
          {this.renderBody()}
          <DropdownAlert
            ref={(ref) => this.dropdown = ref}
          />
        </View>
        <Loading isVisible={this.props.isGettingDetail} />
      </Image>
    );
  }
}

/** Screen styles */
const styles = {
  currency: {
    fontSize: 14,
    fontWeight: '200',
  },
  rootBgImage: {
    flex: 1,
    resizeMode: 'cover',
    width: null,
    height: null,
  },

  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 10,
  },

  /// Header view ///

  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
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

  /// Body view - Avatar view ///

  avatarViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 0,
    paddingBottom: 5,
  },

  avatarContainer: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'rgb(255, 255, 255)',
    // shadow
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    shadowOpacity: 0.7,
    shadowColor: 'rgb(0, 255, 0)',
  },

  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    resizeMode: 'cover',
  },

  sideItemContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 90,
    paddingTop: 20,
  },

  sideIconOuterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  sideIconInnerContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
  },

  sideIconInner: {
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 58,
    height: 58,
    resizeMode: 'contain',
  },

  sideContainer: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  sideItemText: {
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 5,
  },

  /// Body view - Title view ///

  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
  },

  titleText: {
    fontSize: 14,
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  nameText: {
    fontSize: 17,
    color: 'rgb(255, 214, 56)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  /// Body view - Description view ///

  descViewContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    width: Dimensions.get('window').width,
    marginBottom: 20,
  },

  // Drawing triangle
  descTopContainer: {
    width: 26,
    height: 13,
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderBottomWidth: 13,
    borderLeftColor: 'rgba(0, 0, 0, 0)',
    borderRightColor: 'rgba(0, 0, 0, 0)',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
  },

  descMainContainer: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: 7,
    borderRadius: 8,
  },

  descTextContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  descText: {
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 14,
    textAlign: 'center',
  },

  descShowMoreText: {
    color: 'rgba(255, 214, 56, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 14,
    textAlign: 'center',
  },

  viewOnEcoWebsiteContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 7,
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 15
  },

  viewOnEcoWebsiteInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  viewOnEcoWebsiteText: {
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 14,
  },

  viewOnEcoWebsiteIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 5,
    marginRight: 5,
  },


  /// Body view - Options view ///

  optionsContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  optionHeathCheckActiveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    paddingLeft: 15,
    paddingRight: 15,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  optionHeathCheckContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    paddingLeft: 15,
    paddingRight: 15,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },

  optionHeathCheckActiveText: {
    color: 'rgba(255, 255, 255, 1.0)',
    fontSize: 15,
  },

  optionHeathCheckText: {
    color: 'rgba(19, 83, 11, 1.0)',
    fontSize: 15,
  },

  optionHeathCheckIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 7,
  },

  /// Body view - Avail time tabs view ///

  tabsViewContainer: {
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingTop: 7,
  },

  tabsContainer: {
  },

  tabContainer: {
  },

  availTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },

  availTimeText: {
    width: 60,
    marginRight: 10,
    marginTop: 10,
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: 17,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'rgba(255, 255, 255, 1.0)',
    textAlign: 'center',
  }
};

const temp = {
  txtPickerArrowDown: {
    color: '#000',
    fontSize: 10,
    position: 'relative',
    left: 5,
    top: 3
  },
  txtPicker: {
    color: '#000'
  },
  pickerType: {
    flex: 4,
    borderWidth: 0,
  },
  headerLine: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#4EB931',
    height: Dimensions.get('window').height - 500,
    position: 'absolute',
    top: 27,
    left: 25,
  },
  bgModal: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width - 45,
    height: Dimensions.get('window').height - 160,
  },
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
  // checkoutListBg : {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   flex: 1,
  //   marginHorizontal: 10
  // },
  containerModal: {
    paddingTop: 30,
    paddingHorizontal: 15,
    // backgroundColor: '#fff',
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width - 45,
    height: Dimensions.get('window').height - 160,
  },
  containerSmallModal: {
    paddingTop: 30,
    paddingHorizontal: 15,
    // backgroundColor: '#fff',
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width - 25,
    height: Dimensions.get('window').height - 350,
  },
  containerModalCalendar: {
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
    backgroundColor: '#E9F8E5',
    padding: 20,

  },
  containerModalCalendarItem: {
    flexDirection: 'row',
    marginVertical: 10,
    flex: 1
  },
  txtBold: {
    fontWeight: 'bold',
    flex: 4,
    zIndex: 999
  },
  txtSmall: {
    fontSize: 13,
    flex: 2,
    color: '#4F4F4F'
  },
  redLabel: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 21,
    paddingBottom: 10,
  },
  greenLabel: {
    color: '#4EB931',
    fontWeight: 'bold',
    fontSize: 21,
    paddingBottom: 10,
  },
  greenDot: {
    color: '#4EB931',
    flex: 1,
  },
  yellowLabel: {
    color: '#F2C94C',
    fontWeight: 'bold',
    fontSize: 21,
    paddingBottom: 10,
  },
  guide: {
    fontSize: 15,
    fontWeight: '100',
    paddingBottom: 18,
  },
  nameDoctor: {
    fontSize: 13,
    fontWeight: '100',
    paddingBottom: 5,
  },
  grayLabel: {
    fontSize: 14,
    fontWeight: '100',
    paddingBottom: 5,
    color: '#4F4F4F'
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    flex: 1,
    padding: 5,
  },
  containerModalHeader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerModalStar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'center'
  },
  starImage: {
    height: 50,
    width: 50,
  },
  sendButton: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // backgroundColor: '#FFD638',
    // backgroundColor: 'transparent',
    marginBottom: 10,
    marginTop: 50,
    paddingTop: 5
  },
  sendButtonTxt: {
    color: '#4EBA31',
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: 'transparent'
  },
  closeBtn: {
    position: 'absolute',
    top: -18,
    right: -8,
  },
  closeImage: {
    height: 15,
    width: 15,
  },
  iconSend: {
    height: 25,
    width: 25,
  },
  successIcon: {
    width: 110,
    height: 110
  },
  posPriceText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 1.0)',
    fontWeight: '100',
  },
};

export default withConnect(DetailDoctor);
