import React from 'react';
import I18n from 'react-native-i18n';
import {
  Platform, StyleSheet, View, ScrollView, Dimensions, Text, TextInput,
  Image, ActivityIndicator, TouchableHighlight, TouchableOpacity, Modal, Picker,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import ModalPicker from 'react-native-modal-picker';
import DatePicker from 'react-native-datepicker';

import * as app from 'app/constants/app';
import * as gui from 'app/constants/gui';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';

import NiceImage from 'app/components/NiceImage';

const ICON_FAV_ON = require('app/assets/images/icon_favorite_on.png');
const ICON_FAV_OFF = require('app/assets/images/icon_favorite_off.png');
const ICON_PRICE = require('app/assets/images/icon_price.png');

import { ICON_CLINIC, ICON_LOCATION } from 'app/constants'

export default class ClinicInfoItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      checkoutModalVisible: false,
      optionService: 'Tư vấn online',
      optionPackage: 'Gói 30 phút',
      optionDepartment: 'Khoa nhi',
      isUnderfined: false,
    };
  }

  static defaultProps = {
    // showAvailTime: true,
    showAvatar: true,
    showFavorite: true,
  };

  componentWillMount() {
  }
  componentDidMount() {
  }

  iconAvatarDefault() {
    return ICON_CLINIC;
  }

  iconPosition() {
    return ICON_LOCATION;
  }

  onBooking(nameLabel) {
    // this.props.navigation.navigate('DetailClinic');
    this.props.onBooking(nameLabel);
  }

  onClickItem = () => {
    const { data } = this.state;
    this.props.navigation.navigate('DetailClinic',
      {
        data
      }
    );
  }

  onChangeFavorite = () => {
    const func = this.props.onChangeFavorite;
    if (func) {
      func(this, this.onChangeFavoriteDone);
    }
  }

  onChangeFavoriteDone = (isFavorite) => {
    this.setState({ data: { ...this.state.data, favorite: isFavorite } });
  }

  renderTop() {
    return (
      <View style={styles.leftRightContainer}>
        {this.renderLeft()}
        {this.renderRight()}
      </View>
    );
  }

  renderLeft() {
    return this.renderAvatar();
  }

  renderAvatar() {
    return (
      this.props.allowClick ?
      (
        <TouchableOpacity
          onPress={this.onClickItem}
          style={styles.leftContainer}
        >
          <NiceImage
            style={styles.avatarImage}
            defaultSource={this.iconAvatarDefault()}
            source={{ uri : this.state.data.avatar_url}}
          />
        </TouchableOpacity>
      ) :
      (
        <View
          style={styles.leftContainer}
        >
          <NiceImage
            style={styles.avatarImage}
            defaultSource={this.iconAvatarDefault()}
            source={{ uri : this.state.data.avatar_url}}
          />
        </View>
      )
    );
  }

  renderRight() {
    return (
      <View style={styles.rightContainer}>
        {this.renderTitleView()}
        {this.renderPosition()}
        {this.renderPrice()}
      </View>
    );
  }

  renderTitleView() {
    return (
      <View style={styles.rightContainerRow}>
        <View style={styles.titleTextContainer}>
          {this.renderTitle()}
        </View>
        {this.renderFavorite()}
      </View>
    );
  }

  renderTitle() {
    const name = this.state.data.clinic_name;
    return (
      this.props.allowClickTitle ?
        (
          <TouchableOpacity onPress={this.onClickItem}>
            <Text
              ellipsizeMode={'tail'}
              numberOfLines={2}
              style={styles.titleBigText}
            >
              {name}
            </Text>
          </TouchableOpacity>
        ) :
        (
          <View>
            <Text
              ellipsizeMode={'tail'}
              numberOfLines={2}
              style={styles.titleBigText}
            >
              {name}
            </Text>
          </View>
        )
    );
  }

  renderFavorite() {
    return (
      <TouchableOpacity
        style={styles.favImageContainer}
        onPress={this.onChangeFavorite}
      >
        <Image
          source={ICON_FAV_ON}
        style={styles.favImage}
      />
      </TouchableOpacity>
    );
  }

  renderPosition() {
    const { address } = this.state.data;
    return (
      <View style={styles.rightContainerRow}>
        <Image source={this.iconPosition()} style={styles.posPriceImage} />
        <View style={styles.posPriceContainer}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={styles.position}
          >
            {address}
          </Text>
        </View>
      </View>
    );
  }

  renderPrice() {
    return (
      <View style={styles.rightContainerRow}>
        <Image source={ICON_PRICE} style={styles.posPriceImage} />
        <View style={styles.posPriceContainer}>
          {this.renderPriceDetail()}
          <Text style={styles.curency} > vnđ</Text>
        </View>
      </View>
    );
  }

  renderPriceDetail() {
    // const { price } = this.state.data;
    // Emphasizes any number in the price string
    // const words = price.split(" ");

    return (
      <Text
        ellipsizeMode="tail"
        numberOfLines={2}
        style={styles.posPriceText}
      >
        {/*{words.map((word, index) => {
          // Check that word starts with a digit
          if (word.match(/^\d/)) {
            return (
              <Text key={index} style={{ fontWeight: 'bold', fontSize: 18 }}>{word}</Text>
            );
          } else {
            return word + ' ';
          }
        })}*/}
        {'150000'}
      </Text>
    );
  }

  renderBottom() {
    return this.renderAvailTimeView();
  }

  renderAvailTimeView() {

    return (
      <View style={styles.availTimeContainer}>
        {this.renderAvailTimeLabel()}
        {this.renderAvailTimeData()}
        <Text style={styles.arrowScrolltime}> &#9654;</Text>
      </View>
    );
  }

  renderAvailTimeLabel() {
    return (
      <Text style={styles.availTimeTitle}>{I18n.t('ClinicDoctorBaseItem.selectHour')} &#9654;</Text>
    );
  }

  renderAvailTimeData() {
    // const availTime = this.state.data.availTime || [];
    // const availTimeFirstDay = availTime.length > 0 ? availTime[0].data : [];
    const availTimeFirstDay = ['7:00', '15:00', '12:00', '22:00'];

    return availTimeFirstDay.length > 0 ?
      (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollAvailableTime}>
          {this.renderAvailTimeButtons(availTimeFirstDay)}
        </ScrollView>
      ) : (
        <Text style={styles.availTimeText}>{I18n.t('ClinicDoctorBaseItem.noInfomation')}</Text>
      );
  }

  renderAvailTimeButtons(array) {
    const items = [];
    for (let idx = 0; idx < array.length; idx += 1) {
      items.push(
        <TouchableOpacity onPress={() => this.onBooking(array[idx])}>
          <Text style={styles.availTimeText} key={idx} >{array[idx]}</Text>
        </TouchableOpacity>
      );
    }
    return items;
  }

  closeCheckoutModal = () => {
    this.setState({ ...this.state, checkoutModalVisible: false });
  }

  openCheckoutSuccessModal = () => {
    this.setState({ ...this.state, checkoutModalVisible: false, checkoutSuccessModalVisible: true });
  }

  render() {
    return (
      <View style={{ ...styles.rootContainer, ...this.props.style }}>
        {this.renderTop()}
        {
          this.props.showAvailTime ? this.renderBottom() : null
        }
      </View>
    );
  }
}

const styles = {
  position:{
    color:'#FFFFFF'
  },
  scrollAvailableTime: {
    marginRight: 5,
  },
  rootContainer: {
  },
  containerAvaiableTime: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: Dimensions.get('window').width
  },
  leftRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  leftContainer: {
    marginRight: 7,
  },

  avatarImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },

  rightContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  curency: {
    color: '#fff',
    fontWeight: '100',
    backgroundColor: 'transparent'
  },
  rightContainerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  titleTextContainer: {
    flex: 1,
  },

  titleSmallText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'transparent'
  },

  titleBigText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 214, 56, 1.0)',
    backgroundColor: 'transparent'
  },

  favImageContainer: {
    alignSelf: 'flex-start',
  },

  favImage: {
    width: 20,
    height: 20,
    margin: 5,
    resizeMode: 'contain',
  },

  posPriceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  posPriceImage: {
    width: 14,
    height: 14,
    marginRight: 5,
    resizeMode: 'contain',
  },

  posPriceText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 1.0)',
    fontWeight: '100',
    backgroundColor: 'transparent'
  },

  availTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 7,
  },

  availTimeTitle: {
    marginRight: 10,
    textAlign: 'left',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 1.0)',
    shadowColor: '#6FCF97',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  arrowScrolltime: {
    textAlign: 'left',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 1.0)',
    shadowColor: '#6FCF97',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  availTimeText: {
    marginRight: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 21,
    fontWeight: '200',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1.0)',
    color: 'rgba(255, 255, 255, 1.0)',
    fontFamily: 'Roboto',
    shadowColor: '#6FCF97',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
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
    marginTop: 20,
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
