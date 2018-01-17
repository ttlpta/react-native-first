import React from 'react';
import I18n from 'react-native-i18n';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Image, View, StyleSheet, ScrollView, Dimensions, Text, TouchableOpacity, TextInput, Picker, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LoginManager } from 'react-native-fbsdk';
import Geocoder from 'react-native-geocoder';
import DropdownAlert from 'react-native-dropdownalert';
import QRCode from 'react-native-qrcode';
import CheckBox from 'react-native-checkbox';
import DatePicker from 'react-native-datepicker';

import { getToday } from 'app/utils';
import withConnect from './withConnect';

import LeftCenterRight from './../LeftCenterRight';
import Avatar from 'app/components/Avatar';
import Loading from 'app/components/Loading';

import {
  BG_IMAGE, ICON_GOBACK, ICON_TERM, ICON_USER, ICON_CALENDAR_WHITE, ICON_SEX, ICON_LOCATION,
  ICON_ACCOUNT, ICON_PENCIL, ICON_MOBILEPHONE, ICON_ENVELOPE, ICON_EARTH, ICON_LOCK, ICON_CODE, ICON_FLY,
  ICON_CAMERA_BLACK, ICON_ICE, ICON_LOGOUT, ICON_RIGHT, ICON_DOCTOR_DEFAULT, CHECKED, UNCHECKED

} from 'app/constants';

const LANG_OPTIONS = ['vi', 'en'];

class AccountProfile extends React.PureComponent {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      canEdit: false,
      showbuttonSave: false,
      showQrCode: false,
      info: {
        address: '',
        isMale: true
      },
      loadingVisible: false,
      sex: true,
    };
  }

  componentWillMount() {
    const { profilePatient, dataAuth, facebookAuth, getProfilePatient } = this.props;
    getProfilePatient(dataAuth.user_code);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isRequestingAccProfileData && !nextProps.isRequestingAccProfileData) {
      if (nextProps.profilePatient) {
        this.setState({ data: nextProps.profilePatient, sex: (nextProps.profilePatient.sex === 'M') });
      }
    }

    if (this.props.isSavingProfileData && !nextProps.isSavingProfileData) {
      if (nextProps.isSavedProfileSuccess) {
        this.dropdown.alertWithType('success', 'Lưu thông tin thành công', '');
      } else {
        this.dropdown.alertWithType('error', 'Lưu thông tin thất bại', '');
      }
    }
  }

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
        <Text style={styles.headerTitleText}>{I18n.t('accountProfile.header')}</Text>
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

  onGoBack = () => {
    this.props.navigation.goBack();
  }

  onPressEditButton = (name) => {
    this.setState({ ...this.state, canEdit: true, showbuttonSave: true });
    if (typeof name != 'undefined')
      this[name].focus();
  }

  onMenuLogout = () => {

    LoginManager.logOut();
    this.props.logout();

  }

  onSubmit = () => {
    console.log(this.state.data);
    this.props.saveProfile(this.state.data);
  }

  onPressGetYourAddress = () => {
    this.setState({ loadingVisible: true });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { coords } = position;
        const geoCode = {
          lat: coords.latitude,
          lng: coords.longitude
        };

        Geocoder.geocodePosition(geoCode).then(res => {
          this.setState({ loadingVisible: false });

          const add = res[0];
          this.setState({ data: { ...this.state.data, address1: add.formattedAddress } });
        })
          .catch(err => {
            this.setState({ loadingVisible: false });
            this.dropdown.alertWithType('error', 'Opps', 'Xin lỗi chúng tôi không thể tìm thấy vị trí của bạn');
          });
      },
      error => {
        this.setState({ loadingVisible: false });
        this.dropdown.alertWithType('error', 'Opps', 'Xin lỗi chúng tôi không thể tìm thấy vị trí của bạn');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  onPressShowQrCode = () => {
    this.setState({ showQrCode: !this.state.showQrCode });
  }

  onChangeUsername = user_name => {
    this.setState({ data: { ...this.state.data, user_name } });
  }

  onChangeAddess = address1 => {
    this.setState({ data: { ...this.state.data, address1 } });
  }

  setBookingDate = (date) => {
    const birthday = date.replace(new RegExp('-', 'g'), '');

    this.setState({ data: { ...this.state.data, birthday } });
  }

  onChangeSex = () => {
    this.setState({ sex: !this.state.sex })
  }

  render() {
    const { data } = this.state;

    return (
      <View style={styles.container}>
        <Image
          source={BG_IMAGE}
          style={styles.rootBgImage}
        />
        {this.renderHeader()}
        <KeyboardAwareScrollView>
          <View style={styles.firstRow}>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flexDirection: 'column' }}>
                <Avatar
                  source={data.avatar_url ? { uri: data.avatar_url } : ICON_DOCTOR_DEFAULT}
                  withBorder
                  interactive
                  overlayColor={'transparent'}
                  style={styles.avatarImage}
                  ref={avatar => this.avatar = avatar}
                />
                <TouchableOpacity style={styles.bgIconCameraTouch} onPress={() => this.avatar.handleInteractivePress()}>
                  <View style={styles.bgIconCamera}>
                    <Image source={ICON_CAMERA_BLACK} style={{ width: 26, height: 20 }} />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.name}>{data.user_name}</Text>
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Image source={ICON_ENVELOPE} style={{ width: 24, height: 17 }} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{I18n.t('accountProfile.emailPH')}</Text>
              <Text style={styles.txtInput}>{data.email}</Text>
            </View>
            <View style={{ flex: 1 }} />
          </View>
          <View style={styles.itemRowBold}>
            <View style={{ flex: 1 }}>
              <Image source={ICON_MOBILEPHONE} style={{ width: 16, height: 24 }} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{I18n.t('accountProfile.phonePH')}</Text>
              <Text style={styles.txtInput}>{data.phone_no}</Text>
            </View>
            <View style={{ flex: 1 }} />
          </View>

          {/* ============= */}
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Image source={ICON_ACCOUNT} style={{ width: 18.57, height: 22 }} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{I18n.t('accountProfile.namePH')}</Text>
              <TextInput
                style={styles.txtInput}
                onChangeText={text => this.onChangeUsername(text)}
                value={data.user_name}
                placeholderTextColor='#fff'
                selectionColor='#fff'
                onFocus={() => this.onPressEditButton()}
                ref={ref => { this.username = ref; }}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Image source={ICON_PENCIL} style={styles.iconPencil} />
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Image source={ICON_CALENDAR_WHITE} style={{ width: 17, height: 17 }} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{I18n.t('accountProfile.dob')}</Text>
              <DatePicker
                style={{ flex: 6, padding: 0, position: 'relative', bottom: 5, right: 12 }}
                mode="date"
                date={this.state.data.birthday}
                showIcon={false}
                placeholder={this.state.data.birthday}
                format="DD/MM/YYYY"
                minDate={getToday('d/m/y')}
                confirmBtnText="Chọn ngày"
                cancelBtnText="Huỷ"
                customStyles={{
                  dateInput: {
                    padding: 0,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  },
                  dateText: { color: '#fff', fontSize: 22 }
                }}
                onDateChange={(date) => this.setBookingDate(date)}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Image source={ICON_PENCIL} style={styles.iconPencil} />
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Image source={ICON_SEX} style={{ width: 21, height: 21 }} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{I18n.t('accountProfile.sex')}</Text>
              <View style={{ flexDirection: 'row' }}>
                <CheckBox
                  label={I18n.t('accountProfile.male')}
                  labelStyle={{ color: '#fff' }}
                  checked={(this.state.data.sex === 'M')}
                  checkedImage={CHECKED}
                  uncheckedImage={UNCHECKED}
                  underlayColor={'transparent'}
                  onChange={() => this.setState({ data: { ...this.state.data, sex: 'M' } })}
                />
                <CheckBox
                  label={I18n.t('accountProfile.female')}
                  labelStyle={{ color: '#fff' }}
                  checked={(this.state.data.sex === 'F')}
                  checkedImage={CHECKED}
                  uncheckedImage={UNCHECKED}
                  underlayColor={'transparent'}
                  onChange={() => this.setState({ data: { ...this.state.data, sex: 'F' } })}
                />
              </View>
            </View>
            <View style={{ flex: 1 }} />
          </View>
          <View style={styles.itemRowBold}>
            <View style={{ flex: 1 }}>
              <Image source={ICON_LOCATION} style={{ width: 15, height: 22 }} />
            </View>
            <View style={{ flex: 7 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.txtLabel} >{I18n.t('accountProfile.address')}</Text>
                <TouchableOpacity onPress={() => this.onPressGetYourAddress()}>
                  <Text style={{ backgroundColor: 'transparent', color: '#fff' }}>Vị trí của bạn</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.txtInputMultiline}
                onChangeText={text => this.onChangeAddess({ text })}
                value={data.address1}
                multiline
                placeholderTextColor='#fff'
                selectionColor='#fff'
                onFocus={() => this.onPressEditButton()}
                ref={ref => { this.username = ref; }}
              />
            </View>
          </View>

          {/* ========== */}
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Image source={ICON_FLY} style={{ width: 20, height: 20 }} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{'Mã giới thiệu'}</Text>
              <Text style={styles.txtInput}>{data.ref_code}</Text>
            </View>
            <View style={{ flex: 1 }} />
          </View>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Image source={ICON_CODE} style={{ width: 21, height: 12.75 }} />
            </View>

            <View style={{ flex: 7 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.txtLabel} >{'Mã ID'}</Text>
                <TouchableOpacity onPress={() => this.onPressShowQrCode()}>
                  <Text style={{ backgroundColor: 'transparent', color: '#fff' }}>Hiển thị QR code</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.txtInput}>ID0000156</Text>
              {
                this.state.showQrCode &&
                <QRCode
                  value={'ID0000156'}
                  size={200}
                  bgColor='purple'
                  fgColor='white' />
              }
            </View>
          </View>
          {/* ========== */}
          <View style={[styles.itemRow, { marginBottom: 80 }]}>
            <View style={{ flex: 1 }} >
              <Image source={ICON_LOGOUT} style={{ width: 20, height: 21 }} />
            </View>
            <TouchableOpacity style={{ flex: 6 }} onPress={() => this.onMenuLogout()}>
              <Text style={styles.txtLabelNoOpacity} >{I18n.t('sideBar.logout')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity
          style={styles.btnFinish}
          onPress={() => this.onSubmit()}
        >
          <LinearGradient
            colors={['#FBC700', '#EAA30A']}
            style={styles.linearGradient}
          >
            <Text style={styles.btnFinishText}>
              {I18n.t('accountProfile.button')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Loading isVisible={this.state.loadingVisible || this.props.isRequestingAccProfileData || this.props.isSavingProfileData} />
        <DropdownAlert
          ref={ref => this.dropdown = ref}
        />
      </View>
    );
  }
}

const styles = {
  btnFinishText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: 'transparent',
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    width: Dimensions.get('window').width,
    paddingVertical: 15,
    justifyContent: 'center',
    opacity: 1
    // flex: 1
  },
  btnFinish: {
    // flex: 1
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
  },
  bgIconCamera: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  bgIconCameraTouch: {
    position: 'absolute',
    bottom: 0,
    right: -10
  },
  txtLabel: {
    backgroundColor: 'transparent',
    color: '#fff',
    opacity: 0.6,
    fontSize: 16,
    fontWeight: '500'
  },
  txtLabelNoOpacity: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 22,
    fontWeight: '500'
  },
  // txtInput : {
  //   backgroundColor: 'transparent',
  //   color: '#fff',
  //   fontSize: 22
  // },
  txtInput: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 22,
    height: 25,
  },
  txtInputMultiline: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontSize: 18,
    height: 60,
    padding: 5,
    marginTop: 5
  },
  txtInputDisable: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 22,
    height: 0,
    marginTop: 18
  },
  firstRow: {
    justifyContent: 'center',
    paddingTop: 20,
    flex: 4,
    flexDirection: 'row',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 3,
    paddingBottom: 20,
  },
  itemRow: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 1,
  },
  itemRowBold: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 3,
  },
  iconPencil: {
    width: 24,
    height: 24
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent',
    marginVertical: 10
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: 'rgb(255, 255, 255)',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    // shadow
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    shadowOpacity: 0.7,
    shadowColor: 'rgb(255, 255, 255)',
  },
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
  },
  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 21,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 7,
  },
  headerTitleText: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontFamily: 'Roboto-Light'
  },
  goBackIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
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
  scrollView: {
    flex: 1,
  },
  txtHeader: {
    backgroundColor: 'transparent',
    color: '#F2C94C',
    fontWeight: 'bold',
    marginVertical: 25,
  },
  txt: {
    backgroundColor: 'transparent',
    flex: 1,
    color: '#fff',
    lineHeight: 19,
  },
  pickerLanguage: {
    color: '#fff',
    width: 110,
    height: 25,
  },
  dropdown: {
    // flex: 1,
    // left: 230,
    width: 50,
    height: 30,
    // marginBottom: 100,
  },
  dropdown_image: {
    width: 30,
    height: 30,
    // marginLeft:150,
    marginBottom: 100,
  },
  dropdown_2_dropdown: {
    width: 72,
    height: 68,
  },
};

export default withConnect(AccountProfile);
