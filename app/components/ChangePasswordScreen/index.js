/**
 * @providesModule TeleMedicine.Components.Screens.ChangePassword
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet, View, ScrollView, Dimensions, Alert, Text, TextInput,
  Image, Switch, ActivityIndicator, TouchableHighlight, TouchableOpacity,
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
const ICON_PASSWORD = require('app/assets/images/icon_login_password.png');


/**
 * ChangePassword screen.
 */
export default class ChangePassword extends React.PureComponent {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      password: null,
      passwordRetype: null,
      changing: false,
    };
  }

  /// Getters ///

  get isChanging() {
    return this.state.changing;
  }

  /// Events ///

  onChangePassword = async () => {
    if (!this.isChanging) {
      const { password, passwordRetype } = this.state;

      // Check password must not be empty
      if (!password || password.length === 0) {
        // TODO: show error to user, then return
      }

      // Check passwords must match
      if (password !== passwordRetype) {
        // TODO: show error to user, then return
      }

      // Set state to 'changing'
      this.setState({ changing: true });

      Logger.debug(`Start changing password`);

      // Simualte an async call (should be replaced by actual business call)
      await sysutils.sleep(3000);
      this.onChangePasswordDone();
    }
  }

  onChangePasswordDone = (error = null) => {
    if (error) {
      Logger.debug(`Change password failed, error=${error}`);
    } else {
      this.setState({ changing: false });
    }
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
        Đổi mật khẩu
      </Text>
    );
  }

  /// Body View ///

  renderBody() {
    return (
      <View style={styles.bodyContainer}>
        {this.renderPasswordInputView()}
      </View>
    );
  }

  /// Body View - Password input view ///

  renderPasswordInputView() {
    return (
      <View style={styles.inputContainer}>
        {this.renderPasswordLabel()}
        {this.renderPasswordInput()}
        {this.renderPasswordReInput()}
        {<View style={styles.resetButtonTopMargin} />}
        {this.renderChangeButton()}
      </View>
    );
  }

  renderPasswordLabel() {
    return (
      <Text style={styles.passwordInputLabel}>
        Mật khẩu mới của bạn
      </Text>
    );
  }

  renderPasswordInput() {
    return (
      <View style={styles.passwordInputContainer}>
        <Image
          source={ICON_PASSWORD}
          style={styles.passwordIcon}
        />
        <TextInput
          style={styles.passwordInputText}
          onChangeText={text => this.setState({ password: text })}
          placeholder="Mật khẩu mới"
          underlineColorAndroid="transparent"
          maxLength={100}
          secureTextEntry
          placeholderTextColor='rgba(255, 255, 255, 0.7)'
        />
      </View>
    );
  }

  renderPasswordReInput() {
    return (
      <View style={styles.passwordInputContainer}>
        <Image
          source={ICON_PASSWORD}
          style={styles.passwordIcon}
        />
        <TextInput
          style={styles.passwordInputText}
          onChangeText={text => this.setState({ passwordRetype: text })}
          placeholder="Nhập lại mật khẩu"
          underlineColorAndroid="transparent"
          maxLength={100}
          secureTextEntry
          placeholderTextColor='rgba(255, 255, 255, 0.7)'
        />
      </View>
    );
  }

  renderChangeButton() {
    const indicator = this.isChanging ? <ActivityIndicator animated /> : null;
    return (
      <TouchableOpacity onPress={this.onChangePassword}>
        <View style={styles.changeButtonContainer}>
          {indicator}
          <Text style={styles.changeButtonText}>
            ĐỔI MẬT KHẨU
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
  },

  /// Header view ///

  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 20,
  },

  goBackIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },

  headerTitleText: {
    fontSize: 22,
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

  /// Body view - Password input view ///

  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 20,
  },

  passwordInputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    marginBottom: 5,
    paddingVertical: 7,
  },

  passwordIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },

  passwordInputLabel: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  passwordInputText: {
    flex: 1,
    fontSize: 18,
    color: 'rgba(255, 255, 255, 1.0)',
    paddingVertical: 0, // For Android
  },

  /// Body view - Change button ///

  resetButtonTopMargin: {
    height: 40,
  },

  changeButtonContainer: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 22,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },

  changeButtonText: {
    fontSize: 18,
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    marginLeft: 10,
    marginRight: 10,
  },
};
