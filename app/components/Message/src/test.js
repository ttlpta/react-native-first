<View style={styles.headerContainer}>
        
         

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.textName}>Tiến sĩ, Bác sĩ cao cấp chuyên khoa I</Text>
            <Text style={styles.textCall}>Đang gọi</Text>
          </View>

           <View style={{flexDirection: 'row'}}>
            <Text style={styles.textName2}>Trần Văn Chương</Text>
            <Text style={styles.textCall2}>00:26</Text>
          </View>
          
        </View>





<TextInput
          style={styles.loginInputText}
          onChangeText={text => this.setState({ data: { ...this.state.data, userid: text.trim() } })}
          placeholder={(this.state.onFocus) ? '' : 'Số điện thoại'}
          underlineColorAndroid="transparent"
          maxLength={15}
          keyboardType="phone-pad"
          clearTextOnFocus="true"
          onBlur={() => this.onBlur()}
          onFocus={() => this.onFocus()}
          placeholderTextColor="white"
        />   




const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 10,
    paddingTop:10,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    color: '#aaa',
  },
  textCall: {
    paddingLeft:20,
    color: '#4F4F4F',
  },
  textName: {
    paddingLeft:13,
    color: '#4F4F4F',
  },
  textCall2: {
    paddingLeft:105,
    color: '#4F4F4F',
    fontSize: 20,
  },
  textName2: {
    paddingLeft:45,
    color: '#40B81F',
    fontSize:20,
    fontFamily: 'Roboto',
  },
  icon: {
    width: 11,
    height:22,
    marginLeft:20,
    // position: 'absolute',
  },
  wrap: {
    position: 'absolute',
    left:10,
    top:10,
    flex:1,
  },
});



/**
 * @providesModule TeleMedicine.Components.Screens.Login
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

import * as asyncdata from 'app/data/asyncdata';

import LeftCenterRight from 'app/components/LeftCenterRight';
import TopMidBottom from 'app/components/TopMidBottom';
import LinearGradient from 'react-native-linear-gradient';

import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
import TextField from 'react-native-md-textinput';

const ICON_BG = require('app/assets/images/screen_bg.png');
const ICON_LOGIN_LOGO = require('app/assets/images/login_logo.png');
const ICON_LOGIN_USER = require('app/assets/images/icon_login_user.png');
const ICON_LOGIN_PASSWORD = require('app/assets/images/icon_login_password.png');
const ICON_FB = require('app/assets/images/login_with_fb.png');


/**
 * Login screen.
 */
export default class Login extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object,
  };

  static defaultProps = {
    // TODO: need to remove this
    data: asyncdata.getLoginData(),
  };

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      connecting: false,
      onFocus: false,
    };
  }

  onFocus = () => {
    this.setState({ onFocus: true });
  }

  onBlur = () => {
    this.setState({ onFocus: false });
  }

  onFocus2 = () => {
    this.setState({ onFocus2: true });
  }

  onBlur2 = () => {
    this.setState({ onFocus2: false });
  }

  // Getters ///

  get isConnecting() {
    return this.state.connecting;
  }

  // Events ///

  onLogin = () => {
    if (!this.isConnecting) {
      const { userid, password } = this.state.data;

      // Check userid, password must not be empty
      if (!userid || userid.length === 0 ||
        !password || password.length === 0) {
        // TODO: show error to user, then return
      }

      // Set state to 'connecting'
      this.setState({ connecting: true });

      Logger.debug(`Start logging in, userid=${userid}`);

      // Simualte an async call (should be replaced by actual business call)
      // await sysutils.sleep(2000);
      this.onLoginDone();
    }
  }

  onLoginDone = (error = null) => {
    if (error) {
      Logger.debug(`Login error ${error}`);
    } else {
      this.props.navigation.navigate('MapView');
    }
  }

  onLoginWithFaceBook = () => {
    if (!this.isConnecting) {
      this.props.navigation.navigate('LoginWithFb');
    }
  }

  onForgotPassword = () => {
    if (!this.isConnecting) {
      this.props.navigation.navigate('Forgot');
    }
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

  // / Body View - Logo view ///

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
        {this.renderLoginUser()}
        {this.renderLoginPassword()}
        <Text style={styles.forgetPwdText} onPress={this.onForgotPassword}>Bạn quên?</Text>
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

        <ScrollView>
        <TextField
          label={'Số điện thoại'}
          labelColor={'white'}
          textFocusColor={'red'}
          textColor={'white'}
          highlightColor={'white'}
          keyboardType={'numeric'}
          autoGrow="true"
          labelStyle= {styles.loginInputText}
        />
      </ScrollView>


      </View>
    );
  }

  renderLoginPassword() {
    return (
      <View style={(this.state.onFocus2) ? [styles.loginInputContainer, styles.loginInputContainerFocus] : styles.loginInputContainer}>
        <Image
          source={ICON_LOGIN_PASSWORD}
          style={styles.loginInputIcon}
          
        />
        <TextInput
          style={styles.loginInputText}
          onChangeText={text => this.setState({ data: { ...this.state.data, password: text } })}
          placeholder={(this.state.onFocus2) ? '' : 'Mật khẩu'}
          underlineColorAndroid="transparent"
          secureTextEntry
          defaultValue={this.state.data.password}
          maxLength={14}
          clearTextOnFocus="true"
          placeholderTextColor="white"
          onFocus={() => this.onFocus2()}
          onBlur={() => this.onBlur2()}
          
        />
        {/* {this.renderForgotPassword()}   */}
        
      </View>
      
      
    );
  }

  renderForgotPassword() {
    return (
      <TouchableOpacity onPress={this.onForgotPassword}>
        <Text style={styles.forgetPwdText}>Bạn quên?</Text>
      </TouchableOpacity>
    );
  }

  renderLoginButton() {
    const indicator = this.isConnecting ? <ActivityIndicator animated /> : null;

    return (
      // <TouchableOpacity onPress={this.onLogin}>
      //   <View style={styles.loginButtonContainer}>
      //     {indicator}
      //     <Text style={styles.loginButtonText}>
      //       ĐĂNG NHẬP
      //     </Text>
      //   </View>
      // </TouchableOpacity>

      // Within your render function
      <View>
        <LinearGradient colors={['#FBC700', '#EAA30A']} style={styles.linearGradient}>
          <TouchableOpacity onPress={this.onLogin}>
            <Text style={styles.buttonText}>
            ĐĂNG NHẬP
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient colors={['#4A70C0', '#3A5897']} style={styles.FblinearGradient}>
          <TouchableOpacity onPress={this.onLoginWithFaceBook}>
            <Text style={styles.buttonText}>
            Đăng nhập qua Facebook
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      
    );
  }

  // / Footer View ///

  renderFooter() {
    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={this.onLoginWithFaceBook}>
          <View style={styles.loginWithFbContainer}>
            <Text style={styles.fbloginText}>Đăng ký tài khoản</Text>
            {/* <Image style={styles.fbloginIcon} source={ICON_FB} /> */}
            {/* <Text style={styles.fbloginText}>Facebook</Text> */}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // / Main render ///

  render() {
    return (
      <Image
        source={ICON_BG}
        style={styles.rootBgImage}
      >
        <TopMidBottom
          containerStyle={styles.rootContainer}
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
    // borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    marginTop: 15,
    marginBottom: 10,
    paddingVertical: 7,
    paddingTop: 15,
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
    // marginRight: 10,
    position: 'absolute',
    top:50,
    left:0,
  },

  loginInputText: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Roboto-Light',
    color: 'rgba(255, 255, 255, 1.0)',
    paddingVertical: 0, // For Android
    marginBottom:50,
    paddingLeft:30,
    
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
    left: 210,
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
