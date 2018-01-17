/**
 * @providesModule TeleMedicine.Components.Screens.LoginWithFb
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import {
  StyleSheet, View, ScrollView, Dimensions, Alert,
  TouchableHighlight, TouchableOpacity,
  Text, TextInput, Image, Switch, ActivityIndicator,
} from 'react-native';
import { Logger } from '@onaclover/react-native-utils';

import * as app from 'app/constants/app';
import * as gui from 'app/constants/gui';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';

import LeftCenterRight from 'app/components/LeftCenterRight';
import TopMidBottom from 'app/components/TopMidBottom';

const ICON_BG = require('app/assets/images/screen_bg.png');
const ICON_GOBACK = require('app/assets/images/back.png');
const ICON_LOGIN_FB_LOGO = require('app/assets/images/login_fb_logo.png');
const ICON_BUTTON_BG_ORANGE = require('app/assets/images/icon_btn_bg_orange.png');
const ICON_BUTTON_AGREE = require('app/assets/images/icon_agree.png');


/**
 * Login screen.
 */
class LoginWithFb extends React.PureComponent {
  static navigationOptions = {
    header: null,
  }
  /// Events ///

  onUserAgree = () => {
    // TODO: !!!
    this.props.navigation.navigate('Main');
  }

  onGoBack = () => {
    this.props.navigation.goBack();
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
        {this.renderLogo()}
        {this.renderAgreement()}
      </View>
    );
  }

  /// Body View - Logo view ///

  renderLogo() {
    return (
      <View
        style={styles.logoContainer}
      >
        <Image
          style={styles.logoImage}
          source={ICON_LOGIN_FB_LOGO}
        />
      </View>
    );
  }

  /// Body View - Agreement view ///

  renderAgreement() {
    return (
      <Text style={styles.agreementText}>
        <Text style={{ fontWeight: 'bold' }}>Uber Doctor </Text>
        {I18n.t('loginFB.info1')}
        {"\n\n"}
        {I18n.t('loginFB.info2')}
      </Text>
    );
  }

  /// Footer View ///

  renderFooter() {
    return (
      <View style={styles.footerContainer}>
        {this.renderAgreeButton()}
      </View>
    );
  }

  renderAgreeButton() {
    return (
      <TouchableOpacity onPress={this.onUserAgree}>
        <Image style={styles.agreeButtonContainer} source={ICON_BUTTON_BG_ORANGE}>
          <Image style={styles.agreeButtonIcon} source={ICON_BUTTON_AGREE} />
          <Text style={styles.agreeButtonText}>{I18n.t('loginFB.button')}</Text>
        </Image>
      </TouchableOpacity>
    );
  }

  /// Main render ///

  render() {
    return (
      <Image
        source={ICON_BG}
        style={styles.rootBgImage}
      >
        <TopMidBottom
          containerStyle={styles.rootContainer}
          top={this.renderHeader()}
          body={this.renderBody()}
          bottom={this.renderFooter()}
        />
      </Image>
    );
  }
}

const window = Dimensions.get('window');

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
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 10,
  },

  /// Header view ///

  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },

  goBackIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },

  /// Body view ///

  bodyContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },

  /// Body view - Logo ///

  logoContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: window.height * 0.08,
  },

  logoImage: {
    width: window.width * 0.5,
    height: window.width * 0.3,
    resizeMode: 'contain',
  },

  /// Body view - Agreement ///

  agreementText: {
    fontSize: 17,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingBottom: 20,
    paddingTop: 20,
  },

  /// Footer view ///

  footerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },

  agreeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },

  agreeButtonText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingBottom: 20,
    paddingTop: 20,
  },

  agreeButtonIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 7,
  },
};

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(LoginWithFb);