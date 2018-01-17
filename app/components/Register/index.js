import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { Image, View, StyleSheet, ScrollView, Dimensions, Text, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Platform } from 'react-native';
import LeftCenterRight from './../LeftCenterRight';
import TextField from 'react-native-md-textinput';
import CheckBox from 'react-native-check-box';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import withConnect from './withConnect';
import DropdownAlert from 'react-native-dropdownalert';
import Loading from 'app/components/Loading';
import FBSDK, { LoginManager, AccessToken } from 'react-native-fbsdk';

import { Container, Header, Content, Form, Item, Input, Label, Icon } from 'native-base';

import { BG_IMAGE, ICON_GOBACK, ICON_TERM } from 'app/constants';
// import withConnect from './withConnect';
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

class Register extends React.PureComponent {

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      agreeTerm: false,
      txtPhone: '',
      txtPass: '',
      txtRePass: '',
      txtCode: '',
      textLenghtPhone: '',
      textLenghtPass: '',
      textLenghtRePass: '',
      textLenghtCode: '', 
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isRequestingData && !nextProps.isRequestingData) {
      if (nextProps.isRegister) {
        this.dropdown.alertWithType('success', 'Đăng ký thành công', '');
      } else {
        this.dropdown.alertWithType('error', 'Đăng ký thất bại', nextProps.registerErrorMsg);
      }
    }
    if (this.props.isRequestingDataLogin && !nextProps.isRequestingDataLogin) {
      if (nextProps.isLogin) {
        this.props.navigation.navigate('SearchListDrawer');
      } else {
        this.dropdown.alertWithType('error', 'Đăng ký thất bại', nextProps.loginErrorMsg || '');
      }
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

  renderHeader() {
    return (
      <LeftCenterRight
        style={styles.headerContainer}
        left={this.renderGoBack()}
        body={this.renderHeaderTitle()}
      />
    );
  }

  onChangePhone(text) {
    this.setState({
      txtPhone: text,
      textLenghtPhone: text.length
    });
  }

  onChangePass(text) {
    this.setState({
      txtPass: text,
      textLenghtPass: text.length
    });
  }

  onChangeRePass(text) {
    this.setState({
      txtRePass: text,
      textLenghtRePass: text.length
    });
  }

  onChangeRefCode(text) {
    this.setState({
      txtCode: text,
      textLenghtCode: text.length
    });
  }

  renderHeaderTitle() {
    return (
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitleText}>{I18n.t('Register.header')}</Text>
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

  onClose = (data) => {
    const { type } = data;

    if (type == 'success')
      this.props.navigation.navigate('Login');
  }

  onClickRegister = () => {
    const { register } = this.props;
    const phone = this.state.txtPhone;
    const pass = this.state.txtPass;
    const repass = this.state.txtRePass;
    const code = this.state.txtCode;

    let msg = '';
    let advise = '';
    let validatedSuccess = true;

    if (!this.state.textLenghtPhone) {
      msg = I18n.t('phoneRequired');
      advise = I18n.t('pleaseFillPhone');
      validatedSuccess = false;
    }

    if (!this.state.textLenghtPass) {
      msg = I18n.t('pwRequired');
      advise = I18n.t('pleaseFillPw');
      validatedSuccess = false;
    }

    if (!this.state.textLenghtRePass) {
      msg = I18n.t('rePwRequired');
      advise = I18n.t('pleaseFillRePw');
      validatedSuccess = false;
    }

    if (this.state.txtPass !== this.state.txtRePass) {
      msg = I18n.t('rePwWrong');
      advise = I18n.t('pleaseFillRightPw');
      validatedSuccess = false;
    }

    if (!this.state.agreeTerm) {
      msg = I18n.t('agreeTerm');
      advise = I18n.t('pleaseAgreeTerm');
      validatedSuccess = false;
    }

    if (validatedSuccess) {
      register(phone, pass, repass, code);
    } else {
      this.dropdown.alertWithType('error', msg, advise);
    }

  }

  onClick() {
    this.setState({ agreeTerm: !this.state.agreeTerm });
  }

  renderCheckBox() {

    return (
      <CheckBox
        style={{ marginTop: 30 }}
        onClick={() => this.onClick()}
        isChecked={this.state.agreeTerm}
        rightTextView={<View style={{ flexDirection: 'row' }} ><Text style={{ color: '#fff', fontWeight: '300' }}> {I18n.t('Register.rgCheckbox1')} </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Term')}><Text style={{ color: '#fff', fontWeight: '600' }}> {I18n.t('Register.rgCheckbox2')} </Text></TouchableOpacity>
        </View>}
        checkedImage={<Image style={{ marginLeft: 10, width: 18, height: 18 }} source={require('../../assets/images/Checked.png')} />}
        unCheckedImage={<Image style={{ marginLeft: 10, width: 18, height: 18 }} source={require('../../assets/images/Unchecked.png')} />}
      />

    );

  }

  renderRegisterButton() {
    return (

      <TouchableOpacity style={styles.linearGradient} onPress={this.onClickRegister}>
        <Text style={styles.buttonText}>
          {I18n.t('Register.rgbutton')}
        </Text>
      </TouchableOpacity>


    );
  }

  onGoBack = () => {
    this.props.navigation.goBack();
  }

  componentWillMount() {
    if (this.props.transitive === true) {
      this.props.handleInitialStateOfActivePrepositionCheckbox(false);
    }
  }

  renderInputForm() {
    return (
      <View >

        <Form>

          <Item floatingLabel>
            <Label style={styles.labelInput}>{I18n.t('Register.rgPlaceholder1')}</Label>
            <Input style={{ color: 'white', fontSize: 22 }} keyboardType='numeric' maxLength={15} onChangeText={this.onChangePhone.bind(this)} />

          </Item>

          <Item floatingLabel>
            <Label style={styles.labelInput}>{I18n.t('Register.rgPlaceholder2')}</Label>
            <Input style={{ color: 'white', fontSize: 22 }} secureTextEntry={true} maxLength={15} onChangeText={this.onChangePass.bind(this)} />
          </Item>

          <Item floatingLabel>
            <Label style={styles.labelInput}>{I18n.t('Register.rgPlaceholder3')}</Label>
            <Input style={{ color: 'white', fontSize: 22 }} secureTextEntry={true} maxLength={15} onChangeText={this.onChangeRePass.bind(this)} />
          </Item>

          <Item floatingLabel>
            <Label style={styles.labelInput}>{I18n.t('Register.rgPlaceholder4')}</Label>
            <Input style={{ color: 'white', fontSize: 22 }} maxLength={15} onChangeText={this.onChangeRefCode.bind(this)} />
          </Item>

        </Form>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={BG_IMAGE}
          style={styles.rootBgImage}
        />
        {this.renderHeader()}

        <View style={styles.content}>
          <KeyboardAwareScrollView>
            {this.renderInputForm()}
            {this.renderCheckBox()}
            {this.renderRegisterButton()}
            <LinearGradient colors={['#4A70C0', '#3A5897']} style={styles.FblinearGradient}>
              <TouchableOpacity onPress={() => this.onLoginWithFaceBook()}>
                <Text style={styles.buttonText}>
                  {I18n.t('login.lgRegisterFB')}
                </Text>
              </TouchableOpacity>
            </LinearGradient>

          </KeyboardAwareScrollView>
        </View>
        <Loading isVisible={this.props.isRequestingRegister|| this.props.isRequestingDataLogin} />
        <DropdownAlert
          ref={(ref) => this.dropdown = ref}
          onClose={(data) => this.onClose(data)}
          translucent
          closeInterval={1500}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  goBackIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },

  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 21,
    borderBottomColor: '#127C09',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 7,
  },
  headerTitleText: {
    fontWeight: '300',
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  rootBgImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  txtHeader: {
    backgroundColor: 'transparent',
    color: '#F2C94C',
    fontWeight: 'bold',
    marginVertical: 25,
    fontSize: 16,
  },
  linearGradient: {
    borderWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
    borderColor: '#fff',
    marginTop: 50
  },
  buttonText: {
    fontSize: 18,
    // fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  forgetPwdText1: {
    flex: 1,
    textAlignVertical: 'center',
    paddingVertical: 0, // For Android
    position: 'absolute',
    top: 38,
    left: 285,
    width: 20,
    height: 20,
    color: '#8FB788'
  },
  forgetPwdText3: {
    position: 'absolute',
    marginTop: 40,
    marginLeft: 240,
    width: 20,
    height: 20,
    color: '#8FB788'
  },
  forgetPwdText2: {
    position: 'absolute',
    marginTop: 40,
    marginLeft: 240,
    width: 20,
    height: 20,
    color: '#8FB788'
  },
  iconCheckUser: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 26,
    height: 17,
  },
  iconCheckCode: {
    position: 'absolute',
    top: 280,
    right: 0,
    width: 26,
    height: 17,
  },
  labelInput: {
    color: 'white',
    fontSize: 18,
    ...Platform.select({
      ios: {
        paddingTop: null,
      },
      android: {
        paddingTop: 8,
      },
    }),
  },
  FblinearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
    marginTop: 20,
  },
};

export default withConnect(Register);
