/**
 * @providesModule TeleMedicine.Components.Screens.ForgotPassword
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import {
  Platform, StyleSheet, View, ScrollView, Dimensions, Alert,
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
const ICON_GOBACK = require('app/assets/images/LeftArrow.png');
const ICON_EMAIL = require('app/assets/images/icon_email.png');


/**
 * ForgotPassword screen.
 */
export default class ForgotPassword extends React.PureComponent {

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      email: null,
      reseting: false,
    };
  }

  /// Getters ///

  get isReseting() {
    return this.state.reseting;
  }

  /// Events ///

  onResetPassword = async () => {
    if (!this.isReseting) {
      const { email } = this.state;

      // Check email must not be empty
      if (!email || email.length === 0) {
        // TODO: show error to user, then return
      }

      // Set state to 'reseting'
      this.setState({ reseting: true });

      Logger.debug(`Start reseting password, email=${email}`);

      // Simualte an async call (should be replaced by actual business call)
      await sysutils.sleep(1000);
      this.onResetPasswordDone();
    }
  }

  onResetPasswordDone = (error = null) => {
    if (error) {
      Logger.debug(`Reset password failed error=${error}`);
    } else {
      this.setState({ reseting: false });
    }
    this.props.navigation.navigate('ChangePassword');
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
        body={this.renderHeaderTitle()}
        right={<View style={{ width: 40 }} />}
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

  renderHeaderTitle() {
    return (
      <Text style={styles.headerTitleText}>
        Khôi phục mật khẩu
      </Text>
    );
  }

  /// Body View ///

  renderBody() {
    return (
      <View style={styles.bodyContainer}>
        {this.renderEmailInputView()}
      </View>
    );
  }

  /// Body View - Email input view ///

  renderEmailInputView() {
    return (
      <View style={styles.inputContainer}>
        {this.renderEmailLabel()}
        {this.renderEmailInput()}
        {this.renderResetButton()}
      </View>
    );
  }

  renderEmailLabel() {
    return (
      <Text style={styles.emailInputLabel}>
        Địa chỉ e-mail của bạn
      </Text>
    );
  }

  renderEmailInput() {
    return (
      <View style={styles.emailInputContainer}>
        <Image
          source={ICON_EMAIL}
          style={styles.emailIcon}
        />
        <TextInput
          style={styles.emailInputText}
          onChangeText={text => this.setState({ email: text.trim() })}
          placeholder="E-MAIL"
          underlineColorAndroid="transparent"
          defaultValue={this.state.email}
          maxLength={100}
          placeholderTextColor='rgba(255, 255, 255, 0.7)'
        />
      </View>
    );
  }

  renderResetButton() {
    const indicator = this.isReseting ? <ActivityIndicator animated /> : null;
    return (
      <TouchableOpacity onPress={this.onResetPassword}>
        <View style={styles.resetButtonContainer}>
          {indicator}
          <Text style={styles.resetButtonText}>
            RESET MẬT KHẨU
          </Text>
        </View>
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

  headerTitleText: {
    fontSize: 22,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  /// Body view ///

  bodyContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: window.height * 0.15,
  },

  /// Body view - Email input view ///

  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 20,
  },

  emailInputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    marginBottom: 40,
    paddingVertical: 7,
  },

  emailInputLabel: {
    fontSize: 18,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  emailIcon: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },

  emailInputText: {
    flex: 1,
    fontSize: 18,
    color: 'rgba(255, 255, 255, 1.0)',
    paddingVertical: 0, // For Android
  },

  /// Body view - Reset button ///

  resetButtonContainer: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 22,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },

  resetButtonText: {
    fontSize: 18,
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    marginLeft: 10,
    marginRight: 10,
  },
};
