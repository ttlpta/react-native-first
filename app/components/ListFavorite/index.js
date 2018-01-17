/**
 * @providesModule TeleMedicine.Components.Screens.DetailDoctor
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import withConnect from './withConnect';
import {
  StyleSheet, View, ScrollView, Dimensions, Alert,
  TouchableHighlight, TouchableOpacity, Linking,
  Text, TextInput, Image, Switch, Modal, Input, Picker, FlatList
} from 'react-native';

import LeftCenterRight from 'app/components/LeftCenterRight';
import NiceImage from 'app/components/NiceImage';
import DescView from 'app/components/DescView';
import CheckBox from 'react-native-checkbox';
import ListFavoriteTab from './../ListFavoriteTab';

const ICON_BG = require('app/assets/images/screen_bg.png');
const ICON_MENU = require('app/assets/images/icon_menu.png');
const ICON_GOBACK = require('app/assets/images/back.png');
const ICON_FAV_ON = require('app/assets/images/icon_favorite_on.png');
const ICON_FAV_OFF = require('app/assets/images/icon_favorite_off.png');
const ICON_CHECKED = require('app/assets/images/icon_checked.png');
import { ICON_STAR_ACTIVE, ICON_STAR_INACTIVE, CHECKED, UNCHECKED } from 'app/constants';
/**

 */
class ListFavorite extends React.PureComponent {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      favorite: false,
      status: false
    };
  }

  static propTypes = {
    showFavorite: PropTypes.bool,
  };

  onChecked = () => {
    this.setState({...this.state, checked: !this.state.checked})
  }

  onGoBack = () => {
    this.props.navigation.goBack();
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
        {/*<Text style={styles.headerTitleText}>{I18n.t('accountProfile.header' )}</Text>*/}
        <Text style={styles.headerTitleText}>{I18n.t('headerFav' )}</Text>
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

  /// Body View ///
  _keyExtractor = (item, index) => 'item_'+index;

  // renderBody() {
  //   return (
  //     <View style={styles.bodyContainer}>
  //       <View style={{paddingTop:16, marginLeft:15,marginRight:140}}>
  //         <CheckBox
  //           label={I18n.t('isShare' )}
  //           labelStyle={{color: '#fff'}}
  //           checkedImage={ CHECKED }
  //           uncheckedImage={ UNCHECKED }
  //           underlayColor={'transparent'}
  //         />
  //       </View>
  //       <FlatList
  //           keyExtractor={this._keyExtractor}
  //           data={[
  //             {isDoctor: true, favorite: true, status: false, doctorShare: false, hide:false}, 
  //             {isDoctor: false, favorite: false, status: false, doctorShare: true, hide:true},  
  //             {isDoctor: true, favorite: false, status: false, doctorShare: true, hide:true},
  //             {isDoctor: false, favorite: true, status: true, doctorShare: false, hide:false},
  //           ]}
  //           renderItem={({item}) => 
  //             <ListFavoriteItem
  //               navigation={this.props.navigation}
  //               item={item}/>}
  //         />
  //     </View>
  //   );
  // }

  render() {
    return (
      <Image
        source={ICON_BG}
        style={styles.rootBgImage}
      >
        <View style={styles.rootContainer}>
          {this.renderHeader()}
          <ListFavoriteTab {...this.props} />
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

  headerTitleText: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontFamily: 'Roboto-Light'
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
    paddingBottom: 0,
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

  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderTopColor:'rgba(255, 255, 255, 0.2)',
    borderTopWidth:1,
    marginTop:25
  },

};


export default withConnect(ListFavorite);
