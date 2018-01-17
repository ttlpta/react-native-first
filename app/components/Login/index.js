import React from 'react';
import I18n from 'react-native-i18n';
import { NavigationActions } from 'react-navigation';

import {
  Platform, StyleSheet, View, ScrollView, Dimensions, Alert,
  TouchableHighlight, TouchableOpacity,
  Text, TextInput, Image, Switch, ActivityIndicator,
} from 'react-native';
import withConnect from './withConnect';
import { login } from 'app/redux/actions';

import FBSDK, { LoginManager, AccessToken } from 'react-native-fbsdk';

import LeftCenterRight from 'app/components/LeftCenterRight';
import TopMidBottom from 'app/components/TopMidBottom';
import LinearGradient from 'react-native-linear-gradient';
import DropdownAlert from 'react-native-dropdownalert';
import Loading from 'app/components/Loading';

import { ICON_BG, ICON_LOGIN_LOGO, ICON_LOGIN_USER, ICON_LOGIN_PASSWORD, ICON_FB } from 'app/constants';
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

class Login extends React.PureComponent {

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      onFocus: false,
      onFocusPw: false,
      textLength: 0,
      textLengthPw: 0,
      userText:'',
      passText:'',
      loadingVisible : this.props.loading,
      onrequestLogin:this.props.requestLogin
    };
  }

  componentWillReceiveProps(nextProps) {
    if ( this.props.isDoctorRegisting && ! nextProps.isDoctorRegisting ) {
      if (nextProps.isLogin) {
        this.props.navigation.navigate('SearchListDrawer');
      } else {
        this.dropdown.alertWithType( 'error', 'Đăng nhập thất bại', nextProps.loginErrorMsg );
      }
    } 
  }

  onChangeText(text) {
    this.setState({
      textLength: text.length,
      userText: text
    });
  }

  onChangeTextPw(text) {
    this.setState({
      textPwLength: text.length,
      passText:text
    });
  }

  onFocus = () => {
    this.setState({ onFocus: true });
  }

  onBlur = () => {
    this.setState({ onFocus: false });
  }

  onFocusPw = () => {
    this.setState({ onFocusPw: true });
  }

  onBlurPw = () => {
    this.setState({ onFocusPw: false });
  }

  onLogin = () => {
    const { userText, passText } = this.state;
    if(!this.state.textLength) {
      this.dropdown.alertWithType('error', I18n.t('phoneRequired'), I18n.t('pleaseFillPhone'));
    } else if(!this.state.textPwLength) {
      this.dropdown.alertWithType('error', I18n.t('pwRequired'), I18n.t('pleaseFillPw'));
    } else {
      this.props.login( userText, passText );
    }
  }

  _responseInfoCallback = (error: ?Object, result: ?Object) => {
    if (error) {
      console.log('Error fetching data: ' + error.toString());
    } else {
      AccessToken.getCurrentAccessToken().then(
        data => {
          const accessToken = data.accessToken.toString();
          this.props.loginFacebook(result.id, accessToken, result.email, result.name);
        }
      );
    }
  }

  onLoginWithFaceBook = () => {
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(result => {
      if (result.isCancelled) {
        console.log('login canceled');
      } else {
        const infoRequest = new GraphRequest(
          '/me?fields=id,email,name',
          null,
          this._responseInfoCallback,
        );

        new GraphRequestManager()
          .addRequest(infoRequest)
          .start();
      }
    })
      .catch(error => console.log(error));
  }

  onRegister = () => {
    this.props.navigation.navigate('Register');
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

  // / Body View - Login view ///

  renderLoginView() {
    return (
      <View style={styles.loginContainer}>
        <Text
          style={((this.state.onFocus) || (this.state.textLength > 0)) ? { ...styles.userNameLabel, opacity: 1 } : styles.userNameLabel}
        >{I18n.t('login.lgPlaceholder1')}
        </Text>
        {this.renderLoginUser()}
        <Text
          style={((this.state.onFocusPw) || (this.state.textPwLength > 0)) ? {...styles.userNameLabel,opacity:1} : styles.userNameLabel}
        >{I18n.t('login.lgPlaceholder2'  )}
        </Text>
        {this.renderLoginPassword()}
        {<View style={styles.loginButtonTopMargin} />}
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
          onChangeText={this.onChangeText.bind(this)}
          placeholder={(this.state.onFocus) ? '' : I18n.t('login.lgPlaceholder1')}
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

  renderLoginPassword() {
    return (
      <View style={(this.state.onFocusPw) ? [styles.loginInputContainer, styles.loginInputContainerFocus] : styles.loginInputContainer}>
        <Image
          source={ICON_LOGIN_PASSWORD}
          style={styles.loginInputIcon}

        />
        <TextInput
          style={styles.loginInputText}
          onChangeText={this.onChangeTextPw.bind(this)}
          placeholder={(this.state.onFocusPw) ? '' : I18n.t('login.lgPlaceholder2')}
          underlineColorAndroid="transparent"
          secureTextEntry
          maxLength={14}
          placeholderTextColor="white"
          onFocus={() => this.onFocusPw()}
          onBlur={() => this.onBlurPw()}
          returnKeyType={"done"}
          selectionColor='white'

        />
      </View>
    );
  }

  renderForgotPassword() {
    return (
      <TouchableOpacity onPress={this.onForgotPassword}>
        <Text style={styles.forgetPwdText}>{I18n.t('login.lgPlaceholder3')}</Text>
      </TouchableOpacity>
    );
  }

  renderLoginButton() {
    const indicator = this.isConnecting ? <ActivityIndicator animated /> : null;

    return (
      <View>
        <LinearGradient colors={['#FBC700', '#EAA30A']} style={styles.linearGradient}>
          <TouchableOpacity onPress={this.onLogin}
              disabled={this.props.isRequestingData}
            >
            <Text style={styles.buttonText}>
              {I18n.t('login.lgLogin')}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient colors={['#4A70C0', '#3A5897']} style={styles.FblinearGradient}>
          <TouchableOpacity onPress={() => this.onLoginWithFaceBook()}>
            <Text style={styles.buttonText}>
              {I18n.t('login.lgLoginFB')}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

    );
  }

  // / Body View ///
  renderBody() {
    return (
      <ScrollView>
        <View style={styles.bodyContainer}>
          {this.renderLogo()}
          {this.renderLoginView()}
        </View>
      </ScrollView>
    );
  }

  // / Footer View ///

  renderFooter() {
    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={this.onRegister}>
          <View style={styles.loginWithFbContainer}>
            <Text style={styles.fbloginText}>{I18n.t('login.lgRegister')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // / Main render ///

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
        <Loading isVisible={ this.props.isRequestingData } />
        <DropdownAlert
          ref={ref => this.dropdown = ref}
        />
        
      </View>
    );
  }
}

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
    alignItems: 'stretch',
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
    shadowColor: 'rgb(0, 255, 0)',

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
    fontFamily: 'Roboto-Light',
    color: 'rgba(255, 255, 255, 1.0)',
    paddingVertical: 0, // For Android

  },

  forgetPwdText: {
    fontSize: 14,
    flex: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlignVertical: 'center',
    paddingVertical: 0, // For Android
    position: 'absolute',
    top: 100,
    left: Platform.select({
      ios: 210,
      android: 200,
    }),
  },
  userNameLabel: {
    opacity: 0,
    flex: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 16,
    marginLeft: 35
  },
  userNameLabelFocus: {
    flex: 1,
    // color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlignVertical: 'center',
    opacity: 1,
    paddingVertical: 0, // For Android
    // position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 16,
    // color: 'rgba(255, 255, 255, 1.0)',
  },

  userPwLabel: {
    opacity: 0,
    flex: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 16,
    marginLeft: 35
  },
  userPwLabelFocus: {
    flex: 1,
    // color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlignVertical: 'center',
    paddingVertical: 0, // For Android
    position: 'absolute',
    top: Platform.select({
      ios: 75,
      android: 90
    }),
    left: 0,
    fontSize: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0)',
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
    // fontWeight: 'bold',
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  fbloginIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginLeft: 7,
    marginRight: 7,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
  },
  FblinearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    // fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
};

export default withConnect(Login);

