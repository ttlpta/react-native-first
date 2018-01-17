import React from 'react';
import withConnect from './withConnect';
import {
  Platform, StyleSheet, View, ScrollView, Dimensions, Alert,
  TouchableHighlight, TouchableOpacity,
  Text, TextInput, Image, Switch, ActivityIndicator, StatusBar
} from 'react-native';

import TopMidBottom from 'app/components/TopMidBottom';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import __ from 'react-native-i18n';

import { ICON_BG, ICON_LOGIN_LOGO, ICON_LOGIN_USER, ICON_LOGIN_PASSWORD, ICON_FB } from 'app/constants';

class LoginOtp extends React.PureComponent {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      connecting: false,
      onFocus: false,
      textLength: 0,
      count: 10,
      canReSendOtp: false,
    };
  }

  componentDidMount() {
    let count = 10;
    this.loadInterval = setInterval(
      () => { 
        if (count > 0) {
          count -= 1;
          this.setState({...this.state, count });
        } else {
          this.setState({...this.state, canReSendOtp : true });
        }
      }, 1000 
    );
  }

  componentWillUnmount () {
    this.loadInterval && clearInterval(this.loadInterval);
    this.loadInterval = false;
  }

  onChangeText = (text) => {
    this.setState({
      textLength: text.length,
      username: text,
    });

    if(text.length == 6) {
      this.confirmCodeInp.blur();
      this.props.navigation.navigate('SearchListDrawer');
    }
  }

  onFocus = () => {
    this.setState({ onFocus: true });
  }

  onBlur = () => {
    this.setState({ onFocus: false });
  }

  onLogin = () => {
    this.props.navigation.navigate('SearchListDrawer');
  }

  onRegister = () => {
    this.props.navigation.navigate('Register');
  }

  renderBody() {
    return (
      <KeyboardAwareScrollView>
        <View style={styles.bodyContainer}>
          {this.renderLogo()}
          {this.renderLoginView()}
        </View>
      </KeyboardAwareScrollView>
    );
  }

  renderLogo() {
    return (
      <View
        style={styles.logoContainer}
      >
        <Image
          style={styles.logoImage}
          source={ICON_LOGIN_LOGO}
        />
      </View>
    );
  }

  renderLoginView() {
    return (
      <View style={styles.loginContainer}>
        <Text
          style={((this.state.onFocus) || (this.state.textLength > 0)) ? {...styles.userNameLabel,opacity:1} : styles.userNameLabel}
        >{__.t('confirmCode')}
        </Text>
        {this.renderLoginUser()}
        <View style={styles.loginButtonTopMargin} />
        {this.renderLoginButton()}
      </View>
    );
  }

  renderLoginUser() {
    return (
      <View
        style={(this.state.onFocus) ? [styles.loginInputContainer, styles.loginInputContainerFocus] : styles.loginInputContainer}
      >
        <Image
          source={ICON_LOGIN_USER}
          style={styles.loginInputIcon}
        />
        <TextInput
          style={styles.loginInputText}
          ref={ (input) => this.confirmCodeInp = input }
          onChangeText={(text) => this.onChangeText(text)}
          placeholder={(this.state.onFocus) ? '' : __.t('confirmCode')}
          underlineColorAndroid="transparent"
          maxLength={15}
          keyboardType="phone-pad"
          onBlur={() => this.onBlur()}
          onFocus={() => this.onFocus()}
          placeholderTextColor="white"
          selectionColor='white'
        />
      </View>
    );
  }

  renderLoginButton() {

    return (
      <View>
        <TouchableOpacity style={ (this.state.canReSendOtp) ? styles.FblinearGradient : styles.FblinearGradientInActive } onPress={this.onLoginWithFaceBook}>
          <Text style={ (this.state.canReSendOtp) ? styles.buttonText : styles.buttonTextInactive }>
            { (this.state.canReSendOtp) ? __.t('resendConfirmCode') :  __.t('receiveCodeIn') + this.state.count +'s' }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderFooter() {
    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={this.onRegister}>
          <View style={styles.loginWithFbContainer}>
            <Text style={styles.fbloginText}>{ __.t('register') }</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={ICON_BG}
          style={styles.rootBgImage}
        />
        <TopMidBottom
          containerStyle={styles.rootContainer}
          body={this.renderBody()}
          bottom={this.renderFooter()}
        />
      </View>
    );
  }
}

export default withConnect(LoginOtp);

const window = Dimensions.get('window');

/** Screen styles */
const styles = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  rootBgImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  questionTxt: {
    backgroundColor: 'transparent',
    color : 'rgba(255, 255, 255, 0.4)',
    fontSize: 18,
    fontWeight: '400'
  },
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',

  },

  // / Body view ///

  bodyContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // alignItems: 'stretch',
    marginLeft: 50,
    marginRight: 50,
  },

  // / Body view - Logo ///

  logoContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: window.height * 0.2,
    marginTop: 70,
  },

  logoImage: {
    width: window.width * 0.5,
    height: window.width * 0.3,
    resizeMode: 'contain',
  },

  // / Body view - Login view ///

  loginContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 50,
  },

  loginInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 10,
    paddingVertical: 7,
  },
  loginInputContainerFocus: {
    // borderBottomWidth: 1.001,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 5,
    shadowOpacity: 1,
    shadowColor: '#fff',

  },
  loginInputPwContainerFocus: {
    borderBottomWidth: 10,

  },

  loginInputIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },

  loginInputText: {
    flex: 1,
    fontSize: 20,
    // fontFamily: 'Roboto-Light',
    color: 'rgba(255, 255, 255, 1.0)',
    paddingVertical: 0, // For Android

  },
  forgetPwdTouch : {
    flex: 1,
    position: 'absolute',
    top: 100,
    left: Platform.select({
      ios: 210,
      android: 200,
    }),
  },
  forgetPwdText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlignVertical: 'center',
    paddingVertical: 0, // For Android
  },
  userNameLabel: {
    opacity:0,
    flex: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 16,
    marginLeft:35
  },
  userNameLabelFocus: {
    flex: 1,
    // color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlignVertical: 'center',
    paddingVertical: 0, // For Android
    position: 'absolute',
    top: 5,
    left: 30,
    fontSize: 16,
    // fontFamily: 'Roboto-Light',
    // color: 'rgba(255, 255, 255, 1.0)',
  },

  userPwLabel: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlignVertical: 'center',
    paddingVertical: 0, // For Android
    position: 'absolute',
    top: Platform.select({
      ios: 95,
      android: 106,
    }),
    left: Platform.select({
      ios: 30,
      android: 34,
    }),
    fontSize: 20,
    // fontFamily: 'Roboto-Light',
    // color: 'rgba(255, 255, 255, 1.0)',
  },
  userPwLabelFocus: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlignVertical: 'center',
    paddingVertical: 0, // For Android
    position: 'absolute',
    top: 72,
    left: 30,
    fontSize: 16,
    // fontFamily: 'Roboto-Light',
    // color: 'rgba(255, 255, 255, 1.0)',
  },

  loginButtonTopMargin: {
    height: 40,
  },

  loginButtonContainer: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 22,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },

  loginButtonText: {
    fontSize: 18,
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginRight: 10,
  },

  // / Footer view ///

  footerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },

  loginWithFbContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fbloginText: {
    fontSize: 17,
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  fbloginIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginLeft: 7,
    marginRight: 7,
    marginVertical: 10
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white'
  },
  FblinearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
    marginTop: 20,
    borderWidth: 0.7,
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  FblinearGradientInActive: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
    marginTop: 20,
    borderWidth: 0.7,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    // fontFamily: 'Gill Sans',
    textAlign: 'center',
    marginVertical: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },

  buttonTextInactive: {
    // fontFamily: 'Gill Sans',
    textAlign: 'center',
    marginVertical: 10,
    color : 'rgba(255, 255, 255, 0.4)',
    fontSize: 18,
    fontWeight: '400',
    backgroundColor: 'transparent',
  },
};


