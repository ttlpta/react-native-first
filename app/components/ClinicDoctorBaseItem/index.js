/**
 * @providesModule TeleMedicine.Components.Items.ClinicDoctorBaseItem
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

import * as app from 'app/constants/app';
import * as gui from 'app/constants/gui';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';

import NiceImage from 'app/components/NiceImage';

const ICON_FAV_ON = require('app/assets/images/icon_favorite_on.png');
const ICON_FAV_OFF = require('app/assets/images/icon_favorite_off.png');
const ICON_PRICE = require('app/assets/images/icon_price.png');


/**
 * Base class for displaying clinic and doctor item in search
 * result screen.
 */
export default class ClinicDoctorBaseItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data, 
    };
  }

  static propTypes = {
    data: PropTypes.object,
    iconStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    onChangeFavorite: PropTypes.func,
    onClickItem: PropTypes.func,
    showAvailTime: PropTypes.bool,
    showAvatar: PropTypes.bool,
    showFavorite: PropTypes.bool,
  };

  static defaultProps = {
    showAvailTime: true,
    showAvatar: true,
    showFavorite: true,
  };

  onClickItem = () => {
    const func = this.props.onClickItem;
    if (func) {
      func(this);
    }
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

  iconAvatarDefault() {
    // Override this in subclass
    return null;
  }

  iconPosition() {
    // Override this in subclass
    return null;
  }

  renderTop() {
    return (
      // <TouchableHighlight
      //   onPress={this.onClickItem}
      //   underlayColor='rgba(0, 0, 0, 0)'
      // >
      <View style={styles.leftRightContainer}>
        {this.renderLeft()}
        {this.renderRight()}
      </View>
      // </TouchableHighlight>
    );
  }

  renderLeft() {
    return this.renderAvatar();
  }

  renderAvatar() {
    if (this.props.showAvatar) {
      return (
        <TouchableOpacity onPress={this.onClickItem} style={styles.leftContainer}>
          <NiceImage
            style={styles.avatarImage}
            defaultSource={this.iconAvatarDefault()}
            source={this.state.data.avatar}
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
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
    const { title, name } = this.state.data;

    const hasSmallTitle = title;
    const smallTitle = title ? (
      <Text
        ellipsizeMode="tail"
        numberOfLines={1}
        style={styles.titleSmallText}
      >
        {title}
      </Text>
    ) : null;

    const bigTitle = name ? (
      <Text
        ellipsizeMode={hasSmallTitle ? 'middle' : 'tail'}
        numberOfLines={hasSmallTitle ? 1 : 2}
        style={styles.titleBigText}
      >
        {name}
      </Text>
    ) : null;

    return (
      <View>
        {smallTitle}
        {bigTitle}
      </View>
    );
  }

  renderFavorite() {
    const iconFav = this.state.data.favorite ? ICON_FAV_ON : ICON_FAV_OFF;
    if (this.props.showFavorite) {
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
    } else {
      return null;
    }
  }

  renderPosition() {
    const { position } = this.state.data;
    return (
      <View style={styles.rightContainerRow}>
        <Image source={this.iconPosition()} style={styles.posPriceImage} />
        <View style={styles.posPriceContainer}>
          <Text ellipsizeMode="tail" numberOfLines={2}
            style={styles.posPriceText}
          >
            {position}
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
    const { price } = this.state.data;
    // Emphasizes any number in the price string
    const words = price.split(" ");

    return (
      <Text
        ellipsizeMode="tail"
        numberOfLines={2}
        style={styles.posPriceText}
      >
        {words.map((word, index) => {
          // Check that word starts with a digit
          if (word.match(/^\d/)) {
            return (
              <Text key={index} style={{ fontWeight: 'bold', fontSize: 18 }}>{word}</Text>
            );
          } else {
            return word + ' ';
          }
        })}
      </Text>
    );
  }

  renderBottom() {
    return this.renderAvailTimeView();
  }

  renderAvailTimeView() {
    if (this.props.showAvailTime) {
      return (
        <View style={styles.availTimeContainer}>
          {this.renderAvailTimeLabel()}
          {this.renderAvailTimeData()}
          <Text style={styles.arrowScrolltime}> &#9654;</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  renderAvailTimeLabel() {
    return (
      <Text style={styles.availTimeTitle}>{I18n.t('ClinicDoctorBaseItem.selectHour')} &#9654;</Text>
    );
  }

  renderAvailTimeData() {
    const availTime = this.state.data.availTime || [];
    const availTimeFirstDay = availTime.length > 0 ? availTime[0].data : [];

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
        <Text style={styles.availTimeText} key={idx} onPress={() => this.onBooking()}>{array[idx]}</Text>
      );
    }
    return items;
  }

  render() {
    return (
      <View style={{ ...styles.rootContainer, ...this.props.style}}>
        {this.renderTop()}
        {this.renderBottom()}
      </View>
    );
  }
}

const styles = {
  scrollAvailableTime : {
    marginRight: 5,
  },
  rootContainer: {
  },
  containerAvaiableTime : {
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
  curency : {
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
  arrowScrolltime : {
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

// function mapStatetoProps(state) {
//   return { mylanguage: state.language.defaultlanguage };
// }
// export default connect(mapStatetoProps)(ClinicDoctorBaseItem);

