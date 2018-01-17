/**
 * @providesModule TeleMedicine.Components.Screens.DetailClinic
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import {
  StyleSheet, View, ScrollView, Dimensions, Alert,
  TouchableHighlight, TouchableOpacity,
  Text, TextInput, Image, Switch, Modal, Picker, Platform,
} from 'react-native';
import { Logger } from '@onaclover/react-native-utils';
import LinearGradient from 'react-native-linear-gradient';


import * as app from 'app/constants/app';
import * as gui from 'app/constants/gui';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';
import * as asyncdata from 'app/data/asyncdata';
import NiceImage from 'app/components/NiceImage';
import ModalPicker from 'react-native-modal-picker';
import DropdownAlert from 'react-native-dropdownalert';

import LeftCenterRight from 'app/components/LeftCenterRight';
import DescView from 'app/components/DescView';
import PhotosView from 'app/components/PhotosView';
import ClinicInfoItem from 'app/components/ClinicInfoItem';
import ClinicDoctorList from 'app/components/ClinicDoctorList';
import Loading from 'app/components/Loading';
import withConnect from './withConnect';


const ICON_BG = require('app/assets/images/screen_bg.png');
const ICON_MENU = require('app/assets/images/icon_menu.png');
const ICON_GOBACK = require('app/assets/images/icon_back.png');
const ICON_FAV_ON = require('app/assets/images/icon_favorite_on.png');
const ICON_FAV_OFF = require('app/assets/images/icon_favorite_off.png');
const ICON_DOWN = require('app/assets/images/icon_down.png');
const ICON_UP = require('app/assets/images/icon_up.png');
const ICON_CLINIC_BG = require('app/assets/images/clinic_photo_bg.png');
const ICON_LOADING = require('app/assets/images/photo_loading.gif');

import { ICON_CLINIC, ICON_LOCATION } from 'app/constants'

/**
 * Detailed Clinic screen.
 */
class DetailClinic extends React.PureComponent {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    console.info(props);
    super(props);
    this.state = {
      data: {},
      showDoctorList: true,
      checkoutModalVisible: false,
      checkoutSuccessModalVisible: false,
      nameLabel: '',
      bookingData: {
        clinic_code: '',
        clinic_name: '',
        user_code: '',
        booking_date: this.getToday(),
        schedule_start: '',
        service_id: '',
        speciality: '',
      },
      optionService: 'Tư vấn online',
      optionPackage: 'Gói 30 phút',
      optionDepartment: 'Khoa nhi',
    };
    this._doctorListRef = null;
  }

  static propTypes = {
    data: PropTypes.object,
  };

  static defaultProps = {
    // TODO: need to remove this
    data: asyncdata.getClinicItem(),
  };


  componentWillReceiveProps(nextProps) {
    if (this.props.isBookingClinic && !nextProps.isBookingClinic) {
      this.setState({ checkoutModalVisible: false });
      if (nextProps.isBookingSuccess) {
        this.setState({ checkoutSuccessModalVisible: true });
      } else {
        this.dropdown.alertWithType('error', 'Đặt lịch khám thất bại', nextProps.bookingClinicErrorMsg);
      }
    }
  }

  componentWillMount() {
    this.setState({ data: this.props.navigation.state.params.data });
  }
  componentDidMount() {
    this.props.getDoctorOfClinic(this.props.navigation.state.params.data.clinic_id);
    const { clinic_code, clinic_name } = this.props.navigation.state.params.data;
    this.setState({
      ...this.state,
      bookingData: {
        ...this.state.bookingData,
        clinic_code,
        clinic_name,
        user_code: this.props.currentUser.user_code,
      },
    });
  }

  /// Events ///

  onMenu = () => {
    this.props.navigation.navigate('DrawerOpen');
  }

  onGoBack = () => {
    this.props.navigation.goBack();
  }

  onFetchDoctorData = async (ref, onFetchDone) => {
    const clinicId = this.state.data.id;
    const dataSize = ref.dataSize;

    // Simualte an async call (should be replaced by actual business call)
    await sysutils.sleep(1000);

    const result = asyncdata.getDoctorsOfClinic(clinicId);
    onFetchDone(result, ref.dataSize);


    // Simulate the case there is no more data
    const hasMore = datautils.randomBool();
    ref.shouldFetchData = hasMore;
  }

  onClickDoctorItem = async (ref) => {
    this.props.navigation.navigate('DetailDoctor', { data: ref.state.data });
  }

  onChangeClinicFavorite = async (ref, onChangeDone) => {
    const { favorite } = this.state.data;
    Logger.debug(`DetailClinic.onChangeClinicFavorite, favorite=${favorite}`);

    // Simualte an async call (should be replaced by actual business call)
    await sysutils.sleep(500);
    this.setState({ data: { ...this.state.data, favorite: !favorite } },
      () => { onChangeDone(this.state.data.favorite) });
  }

  onToggleDoctorList = () => {
    this.setState({ showDoctorList: !this.state.showDoctorList });
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

    return (format == 'ymd') ? `${yyyy}${mm}${dd}` : yyyy + '-' + mm + '-' + dd;
  }

  /// Body View ///

  renderBody() {
    return (
      <View style={styles.bodyContainer}>
        <ScrollView>
          {this.renderCheckoutModal()}
          {this.renderPhotosView()}
          {this.renderInfoView()}
          {this.renderDescView()}
          {this.renderDoctorsView()}
        </ScrollView>
      </View>
    );
  }

  /// Body View - Photos view ///

  renderPhotosView() {
    const { image_url } = this.state.data;
    const arrImages = image_url || [];
    return (
      <View style={styles.photosViewContainer}>
        <View style={styles.photosViewBgContainer}>
          <Image style={styles.photosViewBgImage} source={ICON_CLINIC_BG} />
        </View>
        <PhotosView
          photos={arrImages}
          height={220}
          loop
          loader={
            <Image
              style={styles.photosViewLoaderImage}
              source={ICON_LOADING}
            />
          }
        />
        <LeftCenterRight
          style={styles.headerContainer}
          left={this.renderGoBack()}
        />
      </View>
    );
  }

  /// Body View - Back/Menu Buttons ///

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

  /// Body View - Info view ///

  renderInfoView() {
    return (
      <ClinicInfoItem
        key='info'
        style={styles.clinicInfoContainer}
        data={this.state.data}
        showAvatar
        onBooking={nameLabel => this.onBooking(nameLabel)}
        showFavorite
        showAvailTime={true}
        allowClick={false}
        allowClickTitle={false}
        onChangeFavorite={this.onChangeClinicFavorite}
      />
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
        </View>
      </View >
    );
  }

  renderShowLessMoreButton(showMore) {
    const text = showMore ?
      <Text style={styles.descShowMoreText}>{I18n.t('DetailClinic.viewMore')} &#9660;</Text> :
      <Text style={styles.descShowMoreText}>{I18n.t('DetailClinic.collapse')} &#9650;</Text>;

    return text;
  }

  /// Body View - Doctors view ///

  renderDoctorsView() {
    const { doctors } = this.props;
    return (
      <View
        key="doctors"
        style={styles.doctorsContainer}
      >
        {this.renderDoctorsTitle()}
        {this.renderDoctorsList()}
      </View>
    );
  }

  renderDoctorsTitle() {
    const iconUpDown = this.state.showDoctorList ? ICON_DOWN : ICON_UP;
    return (
      <View>
        <TouchableOpacity onPress={this.onToggleDoctorList}>
          <View style={styles.doctorsTitleContainer}>
            <Text style={styles.doctorsTitleLeftText}>
              {I18n.t('DetailClinic.doctorClinic')}
            </Text>
            <Image
              style={styles.doctorsTitleRightIcon}
              source={iconUpDown}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  onBooking = nameLabel => {
    this.setState({
      checkoutModalVisible: true,
      nameLabel,
      bookingData: { ...this.state.bookingData, schedule_start: nameLabel },
    });
  }

  _onPress = () => {
    this.closeCheckoutSuccessModal();
    this.props.navigation.navigate('Appointments');
  }

  renderDoctorsList() {
    const { doctors } = this.props;
    if (this.state.showDoctorList) {
      return (
        <ClinicDoctorList
          ref={item => this._doctorListRef = item}
          data={doctors}
          dataType='doctor'
          allowClickDoctor={false}
          showAvaiableTime={false}
          onFetchData={this.onFetchDoctorData}
          onClickItem={this.onClickDoctorItem}
          navigation={this.props.navigation}
        />
      );
    } else {
      return (
        <Text style={styles.doctorsListLabelText}>
          {I18n.t('DetailClinic.listHided')}
        </Text>
      );
    }
  }

  openCheckoutSuccessModal = () => {
    // console.log(this.state.bookingData);
    this.props.bookingClinic(this.state.bookingData);
    // this.setState({ ...this.state, checkoutModalVisible: false, checkoutSuccessModalVisible: true });
  }

  closeCheckoutModal = () => {
    this.setState({ checkoutModalVisible: false });
  }

  closeCheckoutSuccessModal = () => {
    this.setState({ checkoutSuccessModalVisible: false });
  }
  // _onPress = () => {
  //   this.closeCheckoutSuccessModal();
  //   this.props.navigation.navigate('Appointments');
  // }

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
              style={temp.sendButton1}
            >
              <Image source={require('./../../assets/images/calendar.png')} style={temp.iconSend} />
              <TouchableOpacity onPress={this._onPress}>
                <Text style={temp.sendButtonTxt}>&nbsp;&nbsp;{I18n.t('DetailDoctor.viewAppointment')}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </TouchableHighlight>
      </Modal>
    );
  }

  renderCheckoutModal() {
    let indexService = 0;
    const optionService = [
      { key: indexService++, label: 'Tư vấn online' },
      { key: indexService++, label: 'Khám trực tiếp' },
    ];

    let indexPackage = 0;
    const optionPackage = [
      { key: indexPackage++, label: 'Gói 15 phút' },
      { key: indexPackage++, label: 'Gói 30 phút' },
      { key: indexPackage++, label: 'Gói 45 phút' },
      { key: indexPackage++, label: 'Gói 60 phút' },
    ];

    let indexDepartment = 0;
    const optionDepartment = [
      { key: indexDepartment++, label: 'Khoa nhi' },
      { key: indexDepartment++, label: 'Khoa sản' },
      { key: indexDepartment++, label: 'Khoa mũi' },
    ];
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.state.checkoutModalVisible}
      >
        <TouchableHighlight onPress={() => this.closeCheckoutModal()} style={temp.modalFavouriteMask}>
          <TouchableOpacity activeOpacity={1} onPress={() => false} style={temp.containerModal}>
            <Image style={temp.bgModal} source={require('./../../assets/images/bg-modal-fauvorite.png')} />
            <View style={temp.containerModalHeader}>
              <TouchableOpacity onPress={this.onClickItem} style={styles.leftContainer}>
                <NiceImage
                  style={styles.avatarImage}
                  defaultSource={ICON_CLINIC}
                />
              </TouchableOpacity>
              <Text style={temp.greenLabel}>{this.props.navigation.state.params.data.clinic_name}</Text>
            </View>
            <View style={temp.containerModalCalendar}>
              <View style={temp.containerModalCalendarItem}>
                <Text style={temp.greenDot}>&#9679; </Text>
                <Text style={temp.txtSmall}>{I18n.t('DetailDoctor.service')} </Text>

                <ModalPicker
                  data={optionService}
                  style={temp.pickerType}
                  cancelText={'Trở về'}
                  cancelTextStyle={{ fontWeight: '600', color: 'rgba(0,118,255,0.9)' }}
                  onChange={(option) => {
                    this.setState(
                      {
                        optionService: option.label,
                        bookingData: {
                          ...this.state.bookingData, service_id: option.label,
                        },
                      }
                    );
                  }
                  }
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', marginRight: 10 }}>
                      {this.state.optionService}
                    </Text>
                    <Text style={{ }}>&#9660;</Text>
                  </View>
                </ModalPicker>

              </View>
              <View style={temp.containerModalCalendarItem}>
                <Text style={temp.greenDot}>&#9679; </Text>
                <Text style={temp.txtSmall}>{I18n.t('DetailDoctor.hour')} </Text>
                <Text style={temp.txtBold}>{this.state.nameLabel}</Text>
              </View>
              <View style={temp.containerModalCalendarItem}>
                <Text style={temp.greenDot}>&#9679; </Text>
                <Text style={temp.txtSmall}>{I18n.t('DetailDoctor.dateTime')} </Text>
                <Text style={temp.txtBold}>{this.getToday('y-m-d')}</Text>
              </View>
              <View style={temp.containerModalCalendarItem}>
                <Text style={temp.greenDot}>&#9679; </Text>
                <Text style={temp.txtSmall}>Gói khám:</Text>
                <ModalPicker
                  data={optionPackage}
                  style={temp.pickerType}
                  cancelText={'Trở về'}
                  cancelTextStyle={{ fontWeight: '600', color: 'rgba(0,118,255,0.9)' }}
                  onChange={(option) => { this.setState({ optionPackage: option.label }) }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', marginRight: 10 }}>
                      {this.state.optionPackage}
                    </Text>
                    <Text style={{ }}>&#9660;</Text>
                  </View>
                </ModalPicker>

              </View>
              <View style={temp.containerModalCalendarItem}>
                <Text style={temp.greenDot}>&#9679; </Text>
                <Text style={temp.txtSmall}>Chuyên khoa:</Text>
                <ModalPicker
                  data={optionDepartment}
                  style={temp.pickerType}
                  cancelText={'Trở về'}
                  cancelTextStyle={{ fontWeight: '600', color: 'rgba(0,118,255,0.9)' }}
                  onChange={(option) => {
                    this.setState({
                      optionDepartment: option.label,
                      bookingData: { ...this.state.bookingData, speciality: option.label },
                    });
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', marginRight: 10 }}>
                      {this.state.optionDepartment}
                    </Text>
                    <Text style={{ }}>&#9660;</Text>
                  </View>
                </ModalPicker>

              </View>
            </View>
            <TouchableOpacity onPress={() => this.openCheckoutSuccessModal()}>
              <LinearGradient
                colors={['#ffffff', '#FBEBAF',]}
                style={temp.sendButton}
              >
                <Image source={require('./../../assets/images/checkoutnIcon.png')} style={temp.iconSend} />
                <Text style={temp.sendButtonTxt}>
                  &nbsp;&nbsp;ĐẶT LỊCH HẸN KHÁM
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableHighlight>
      </Modal >
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
          {this.renderBody()}
          <Loading isVisible={this.props.isRequestingListDoctor} />
          {this.renderCheckoutModal()}
          {this.renderCheckoutSuccessModal()}
        </View>
        <DropdownAlert
          ref={(ref) => this.dropdown = ref}
        />
      </Image>
    );
  }
}

/** Screen styles */
const styles = {
  avatarImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
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
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 10,
  },

  /// Header view ///
  /// Header view - Photos view ///

  photosViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  photosViewBgContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  photosViewBgImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },

  photosViewLoaderImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  /// Header view - Overlap header view ///
  headerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
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

  /// Body view - Info view ///

  clinicInfoContainer: {
    flex: 1,
    padding: 10,
  },

  /// Body view - Description view ///

  descViewContainer: {
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    width: Dimensions.get('window').width,
  },

  descMainContainer: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
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

  /// Body view - Doctors view ///

  doctorsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 7,
  },

  doctorsTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderTopWidth: 4,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  },

  doctorsTitleLeftText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  doctorsTitleRightIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },

  doctorsListLabelText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
};

const temp = {
  pickerType: {
    flex: 5,
    borderWidth: 0,
    marginLeft: 15
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
    // justifyContent: 'space-around',
    // alignItems: 'center',
    flex: 1,
    backgroundColor: '#E9F8E5',

  },
  containerModalCalendarItem: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 10,
    flex: 1,
  },
  txtBold: {
    fontWeight: 'bold',
    flex: 5,
    marginLeft: 15
  },
  txtBold1: {
    fontWeight: 'bold',
  },
  txtSmall: {
    fontSize: 13,
    flex: 3,
    color: '#4F4F4F'
  },
  txtPicker: {
    flex: 5,
    color: '#4F4F4F',
    fontWeight: 'bold',
    marginTop: -17,
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
    marginTop: 20,
    paddingTop: 5
  },
  sendButton1: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // backgroundColor: '#FFD638',
    // backgroundColor: 'transparent',
    marginBottom: 10,
    marginTop: (Platform.OS === 'ios') ? 10 : 60,
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
    height: 110,
  },
  viewPicker: {
    flex: 4,
  },

};

export default withConnect(DetailClinic);
