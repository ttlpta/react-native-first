import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Dimensions, Platform } from 'react-native';
import __ from 'react-native-i18n';

import LeftCenterRight from './../LeftCenterRight';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import ModalPicker from 'react-native-modal-picker';
import {
  BG_IMAGE, ICON_GOBACK
} from 'app/constants';


export default class BasicInformation extends Component {

  static navigationOptions = {
    header: null,
  }

  constructor(props){
    super(props);
    this.state={
      optionService: 'O - Nhóm máu O'
    }
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
        <Text style={styles.headerTitleText}> {__.t('accountProfile.prehistoricPatient')} </Text>
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

  onGoBack = () => {
    this.props.navigation.goBack();
  }

  renderBankPicker() {
    let index = 0;
    const data = [
        { key: index++, label: 'O - Nhóm máu O' },
        { key: index++, label: 'A - Nhóm máu A' },
        { key: index++, label: 'B - Nhóm máu B' },
        { key: index++, label: 'AB - Nhóm máu AB' },
    ];
    return (
      <ModalPicker
          data={data}
          cancelText={__.t('cancel')}
          overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}
          cancelTextStyle={{color: 'red'}}
          onChange={(option)=>{ this.setState({ optionService : option.label}) }}>
          <View style={{ flexDirection : 'row', paddingTop:10 }}>
              <Text style={styles.txtPicker}>{ this.state.optionService }</Text>
              <Text style={styles.txtPickerArrowDown}>&#9660;</Text>
          </View>
      </ModalPicker>
    );
  }

  renderBody = () => {
    return (
      <KeyboardAwareScrollView>
        <View style={styles.rootContainer}>
          <View style={{ ...styles.itemRow}}>
            <Text style={styles.txtLabel} >
              {__.t('height')}
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              placeholder={'1.50'}
              placeholderTextColor={'#FFFFFF'}
              style={{ ...styles.txtInput }} />
            <Text style={styles.rightLabel}>m</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.txtLabel} >
              {__.t('weight')}
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              placeholder={'50.00'}
              placeholderTextColor={'#FFFFFF'}
              style={{ ...styles.txtInput }} />
              <Text style={styles.rightLabel}>kg</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.txtLabel} >
              {__.t('bloodgroup')}
            </Text>
            {this.renderBankPicker()}
          </View>
          <View style={styles.itemRow}>
            <Text style={{ ...styles.txtLabel, opacity: null }} >
              {__.t('bloodpresure')}
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              placeholder={'120/180'}
              placeholderTextColor={'#FFFFFF'}
              style={{ ...styles.txtInput }} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }


  renderFirstLine = () => {
    return (
      <View style={{ backgroundColor: '#fff', height: 1, opacity: 0.4 }}>
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
        {this.renderFirstLine()}

        {this.renderBody()}
        {
          <TouchableOpacity>
            <LinearGradient colors={['#FBC700', '#EAA30A']} style={styles.linearGradient}>
              <Text style={styles.buttonText}>
                {__.t('accountProfile.button')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        }

      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 21,
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
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontFamily: 'Roboto-Light'
  },
  goBackIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
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
  txtLabel: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 16,
    opacity:0.6
  },
  txtInput: {
    color: '#fff',
    fontSize: 22,
    paddingRight:50,
    ...Platform.select({
      android: {
        paddingBottom: 0
      },
      ios: {
        marginTop: 5,
        height: 25,
      }
    }),
  },
  itemRow: {
    paddingVertical: 15,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    borderBottomWidth: 1,
    marginHorizontal: 20
  },
  rootContainer: {
    flex: 1,
    // borderTopColor: 'rgba(255,255,255,0.15)',
    // borderTopWidth: 1,
    // marginHorizontal: 20
  },
  linearGradient: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },

  rightLabel:{
    fontSize:22,
    color:'#52C234',
    position:'absolute',
    top:45,
    left:290
  },

  bottom:{
    flexDirection:'row',
    justifyContent:'space-between'
  },

  txtPickerArrowDown:{
      position:'absolute',
      left:290,
      top:13,
      color:'#52C234',
  },

  txtPicker:{
      fontSize:22,
      color:'#FFFFFF'
  },
};