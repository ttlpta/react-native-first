import PropTypes from 'prop-types';
import React from 'react';
import I18n from 'react-native-i18n';
import {
  StyleSheet, View, ScrollView, Dimensions, Platform,
  Text, TextInput, Image,
  TouchableHighlight, TouchableOpacity, Picker,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import ShadowView from 'react-native-shadow-view';

import LeftCenterRight from 'app/components/LeftCenterRight';
import NiceImage from 'app/components/NiceImage';
import ModalDropdown from '../ModalDropdown';

import withConnect from './withConnect';

import {
  BG_IMAGE, ICON_USER, ICON_CALENDAR,
  ICON_LOCATION, ICON_PHONE_CALL,
  ICON_ACCOUNT, ICON_APPOINTMENT,
  ICON_PAYMENT, ICON_TOS, ICON_LANGUAGE,
  ICON_LOGOUT, ICON_BUTTON_BG_ORANGE, ICON_HEART, ICON_PATIENT
} from 'app/constants';

class SideBar extends React.PureComponent {

  static propTypes = {
    data: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }

  componentWillMount() {
    console.log(this.props.facebookAuth.access_token);
  }

  onClickAvatar = () => {
    this.props.navigation.navigate('AccountProfile');
  }

  onPhoneCall = () => {
    // this.props.navigation.navigate('DrawerClose');
    this.props.navigation.navigate('Calling');
    // this.props.navigation.navigate('Message');

    // TODO: Activate calling the phone number
  }

  onMenuAccount = () => {
    this.props.navigation.navigate('AccountProfile');
  }

  onMenuAppointments = () => {
    this.props.navigation.navigate('Appointments');
  }

  onMenuPayment = () => {
    this.props.navigation.navigate('AccountBalance');
  }

  onMenuFavourite = () => {
    this.props.navigation.navigate('ListFavorite');
  }

  onMenuPersonal = () => {
    this.props.navigation.navigate('MedicalRecord');
  }

  onMenuTerm = () => {
    this.props.navigation.navigate('Term');
  }

  renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <LeftCenterRight
          body={this.renderAvatar()}
        />
        <LeftCenterRight
          body={this.renderUserInfo()}
        />
      </View>
    );
  }

  renderAvatar() {
    const { avatar_url } = this.props.dataAuth;

    return (
      <ShadowView style={styles.avatarContainer}>
        <TouchableOpacity onPress={this.onClickAvatar}>
          <NiceImage
            defaultSource={ICON_USER}
            source={{ uri: avatar_url }}
            style={styles.avatarImage}
          />
        </TouchableOpacity>
      </ShadowView>
    );
  }

  renderUserInfo() {
    const user_name = this.props.dataAuth.user_name || this.props.facebookAuth.user_name;
    return (
      <View style={styles.userInfoContainer}>
        {
          user_name.length > 0 &&
          <View>
            <Text style={styles.userNameText}>
              {user_name}
            </Text>
          </View>
        }
      </View>
    );
  }

  /// Body view ///

  renderBody() {
    const data = [
      {
        title: I18n.t('sideBar.item4'),
        icon: ICON_ACCOUNT,
        func: this.onMenuAccount,
      },
      {
        title: I18n.t('sideBar.item1'),
        icon: ICON_HEART,
        func: this.onMenuFavourite,
      },
      {
        title: I18n.t('sideBar.item2'),
        icon: ICON_CALENDAR,
        func: this.onMenuAppointments,
      },
      {
        title: I18n.t('sideBar.item5'),
        icon: ICON_PATIENT,
        func: this.onMenuPersonal,
      },
      {
        title: I18n.t('sideBar.item3'),
        icon: ICON_PAYMENT,
        func: this.onMenuPayment,
      }
    ];
    return (
      <View style={styles.bodyContainer}>
        {data.map((item, index) => {
          return this.renderMenuItem(item, index);
        })}
      </View>

    );
  }

  renderMenuItem(item, index) {
    return (
      <TouchableOpacity onPress={item.func} key={index}>
        <View style={styles.menuItemContainer}>
          <Image
            style={styles.menuItemIcon}
            source={item.icon}
          />
          {
            index == 0 &&
            <View>
              <Text style={styles.menuItemText}>
                {item.title}
                {/* <Text style={{ fontSize: 20, fontWeight: 'bold' }}>24/7</Text> */}
              </Text>
              {/* <Text style={{ backgroundColor: 'transparent', fontSize:13, color:'#F2C94C', marginLeft: 10, marginTop: 5 }}>
                Còn 14 tháng 20 ngày nữa hết hạn
              </Text> */}
            </View>
          }
          {
            !index == 0 &&
            <Text style={styles.menuItemText}>
              {item.title}
            </Text>
          }
          {
            index == 1 &&
            <LinearGradient
              colors={['#FFD844', '#FFD638',]}
              style={styles.notyIcon}
            >
              <Text style={styles.notyIconTxt}> {'3'} </Text>
            </LinearGradient>
          }
        </View>
      </TouchableOpacity>
    );
  }

  /// Footer view ///

  renderFooter() {
    return (
      <View style={{ marginHorizontal: 10 }}>
        <TouchableOpacity onPress={this.onMenuTerm}>
          <Text style={styles.copyrightText}>. {I18n.t('sideBar.terms')}</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.copyrightText}>. {I18n.t('sideBar.contact')}</Text>
          <Text style={{ backgroundColor: 'transparent', position: 'absolute', right: 10, color: 'rgba(255, 255, 255, 0.7)', fontSize: 16 }}>v1.0</Text>
        </View>
      </View>
    );
  }

  /// Footer view - Emergency call///

  renderCallButton() {
    const { emergencyNumber } = this.state.data;
    return (
      <TouchableOpacity onPress={this.onPhoneCall}>
        <View style={styles.callContainer}>
          <Image style={styles.callBgIcon} source={ICON_BUTTON_BG_ORANGE} />
          <Text style={styles.callBigText}>{I18n.t('sideBar.button')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Image
              style={styles.callIcon}
              source={ICON_PHONE_CALL}
            />
            <Text style={styles.callSmallText}>
              {emergencyNumber}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  /// Footer view - Copyright ///

  renderCopyright() {
    return (
      <Text onPress={this.onMenuTerm} style={styles.copyrightText}>{I18n.t('sideBar.rule')}</Text>
    );
  }

  render() {
    let dropdown_icon = this.props.mylanguage === 'vi' ? require('../../assets/images/Vietnam-Flag-icon.png') : require('../../assets/images/Kingdom-flag-icon.png');
    return (
      <Image
        source={BG_IMAGE}
        style={styles.rootBgImage}
      >
        <View style={styles.rootContainer}>
          {this.renderHeader()}
          {this.renderBody()}
          {this.renderFooter()}
        </View>
      </Image>
    );
  }
}

/** Screen styles */
const styles = {
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
  },

  viewPicker: {
    position: 'absolute',
    marginLeft: 180,
    ...Platform.select({
      ios: {
        paddingTop: 290,
      },
      android: {
        paddingTop: 296,
      },
    }),
  },
  pickerLanguage: {
    color: '#A1D59A',
    width: 110,
    height: 25,
  },

  notyIcon: {
    width: 21,
    height: 21,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    right: 0,
  },
  notyIconTxt: {
    color: '#fff',
    backgroundColor: 'transparent',
    fontSize: 13,
  },
  /// Header view ///

  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50,
  },

  /// Header view - Avatar view ///

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

  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: 'rgb(255, 255, 255)',
  },

  /// Header view - User info view ///

  userInfoContainer: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    ...Platform.select({
      ios: {
        paddingBottom: 10,
        paddingTop: 10,
      },
      android: {
        paddingBottom: 5,
        paddingTop: null,
      },
    }),
  },

  userNameText: {
    textAlign: 'center',
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 24,
  },

  userLocationIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 5,
  },

  userLocationText: {
    textAlign: 'center',
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 14,
  },

  /// Body view ///

  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  /// Body view - Menu item ///

  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10,
  },

  menuItemIcon: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
  },

  menuItemText: {
    fontSize: 20,
    fontFamily: 'Roboto-Light',
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingLeft: 10,
    paddingRight: 10,
  },

  /// Footer view ///

  footerContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },

  /// Footer view - Emergency call ///

  callContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 46,
    borderRadius: 23,
    ...Platform.select({
      ios: {
        marginBottom: null,
      },
      android: {
        marginBottom: 15,
      },
    }),

  },

  callBgIcon: {
    width: 200,
    height: 46,
    borderRadius: 23,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },

  callIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    marginRight: 3,
  },

  callBigText: {
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontWeight: 'bold',
    fontSize: 17,
  },

  callSmallText: {
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 14,
  },

  /// Footer view - Copyright ///

  copyrightText: {
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    paddingBottom: 12,
    fontFamily: 'Roboto-Light',
  },
  dropdown: {
    flex: 1,
    left: 8,
    width: 50,
  },
  dropdown_image: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginLeft: 20,
  },
  dropdown_2_dropdown: {
    width: 72,
    height: 68,
  },

};


export default withConnect(SideBar);
