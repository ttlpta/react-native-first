import React from 'react';
import I18n from 'react-native-i18n';
import {
  Platform, StyleSheet, View, ScrollView, Dimensions, Text, TextInput,
  Image, ActivityIndicator, TouchableHighlight, TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';

import * as utils from 'app/utils';

import NiceImage from 'app/components/NiceImage';
import _ from 'lodash';

const ICON_FAV_ON = require('app/assets/images/icon_favorite_on.png');
const ICON_FAV_OFF = require('app/assets/images/icon_favorite_off.png');
const ICON_PRICE = require('app/assets/images/icon_price.png');

import { ICON_DOCTOR, ICON_POSITION } from 'app/constants';

class DoctorInfoItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };

    // console.log(props.data);
  }

  iconAvatarDefault() {
    return ICON_DOCTOR;
  }

  iconPosition() {
    return ICON_POSITION;
  }

  onBooking(schedule_start) {
    const { data } = this.state;
    this.props.navigation.navigate('DetailDoctor', { ...data, checkoutModalVisible: true, schedule_start });
  }

  onClickItem = () => {
    const { data } = this.state;
    this.props.navigation.navigate('DetailDoctor', { ...data, checkoutModalVisible: false });
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
      <TouchableOpacity onPress={this.onClickItem} style={styles.leftContainer}>
        <NiceImage
          style={styles.avatarImage}
          defaultSource={this.iconAvatarDefault()}
          source={{ uri: this.state.data.avatar_url }}
        />
      </TouchableOpacity>
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
      <TouchableOpacity onPress={this.onClickItem} style={styles.rightContainerRow}>
        <View style={styles.titleTextContainer}>
          {this.renderTitle()}
        </View>
        {this.renderFavorite()}
      </TouchableOpacity>
    );
  }

  renderTitle() {
    const { doctor_name, speciality } = this.state.data;
    const hasSmallTitle = speciality;
    const formatSpeciality = _.isArray(speciality) ? speciality.join(', ') : speciality;
    const smallTitle = (
      <Text
        ellipsizeMode="tail"
        numberOfLines={1}
        style={styles.titleSmallText}
      >
        {formatSpeciality}
      </Text>
    );

    const bigTitle = (
      <Text
        ellipsizeMode={hasSmallTitle ? 'middle' : 'tail'}
        numberOfLines={hasSmallTitle ? 1 : 2}
        style={styles.titleBigText}
      >
        {doctor_name}
      </Text>
    );

    return (
      <View>
        {smallTitle}
        {bigTitle}
      </View>
    );
  }

  renderFavorite() {
    const iconFav = this.state.data.favorite ? ICON_FAV_ON : ICON_FAV_OFF;
    return (
      <TouchableOpacity
        style={styles.favImageContainer}
        onPress={this.onChangeFavorite}
      >
        <Image
          source={iconFav}
          style={styles.favImage} />
      </TouchableOpacity>
    );
  }

  renderPosition() {
    const { clinic_name } = this.state.data;
    return (
      <View style={styles.rightContainerRow}>
        <Image source={this.iconPosition()} style={styles.posPriceImage} />
        <View style={styles.posPriceContainer}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={styles.posPriceText}
          >
            {clinic_name}
          </Text>
        </View>
      </View>
    );
  }

  renderPrice() {
    const { price_list } = this.state.data;
    const priceOfDoctor = _.find(price_list, price => (typeof (price.duration) !== 'undefined' ? price.type === 'C' : price.type === 'D'));
    return (
      priceOfDoctor &&
      <View style={styles.rightContainerRow}>
        <Image source={ICON_PRICE} style={styles.posPriceImage} />
        <View style={styles.posPriceContainer}>
          {this.renderPriceDetail(utils.priceFormat(priceOfDoctor.price))}
          {/* {this.renderPriceDetail(utils.priceFormat(15000))} */}
          {/* <Text style={styles.curency} > {priceOfDoctor.ccy}</Text> */}
          {/*<Text style={styles.curency} > {'VND'}</Text>*/}
          <Text style={styles.curency} > {priceOfDoctor.ccy}</Text>
        </View>
      </View>
    );
  }

  renderPriceDetail(price) {
    return (
      <Text
        ellipsizeMode="tail"
        numberOfLines={2}
        style={styles.posPriceText}
      >
        {price}
      </Text>
    );
  }

  renderBottom() {
    return this.props.showAvaiableTime && this.renderAvailTimeView();
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
    const { working_time } = this.state.data;
    const arrTime = working_time || [];
    return arrTime.length > 0 ?
      (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollAvailableTime}>
          {this.renderAvailTimeButtons(arrTime)}
        </ScrollView>
      ) : (
        <Text style={styles.availTimeText}>{I18n.t('ClinicDoctorBaseItem.noInfomation')}</Text>
      );
  }

  renderAvailTimeButtons(workingTime) {
    const items = [];
    for (let idx = 0; idx < workingTime.length; idx += 1) {
      items.push(
        <TouchableOpacity onPress={() => this.props.allowClickDoctor ? this.onBooking(workingTime[idx]) : false}>
        <Text
          key={idx}
          onPress={() => (this.props.allowClickDoctor ? this.onBooking(workingTime[idx]) : false)}
          style={styles.availTimeText}
        >
          {workingTime[idx].hour}
        </Text>
        </TouchableOpacity>
      );
    }
    return items;
  }

  render() {
    return (
      <View style={{ ...styles.rootContainer, ...this.props.style }}>
        {this.renderTop()}
        {this.renderBottom()}
      </View>
    );
  }
}

DoctorInfoItem.defaultProps = {
  allowClickDoctor: true,
  showAvaiableTime: true,
};

const mapStatetoProps = state => {
  return state;
}

export default connect(mapStatetoProps)(DoctorInfoItem);

const styles = {
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
  },

  titleBigText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 214, 56, 1.0)',
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