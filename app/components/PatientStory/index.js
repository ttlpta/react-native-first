import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Dimensions, Platform } from 'react-native';
import __ from 'react-native-i18n';

import LeftCenterRight from './../LeftCenterRight';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {
  BG_IMAGE, ICON_GOBACK
} from 'app/constants';


export default class PatientStory extends Component {

  static navigationOptions = {
    header: null,
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

  renderBody = () => {
    return (
      <KeyboardAwareScrollView>
        <View style={styles.rootContainer}>
          <View style={{ ...styles.itemRow, borderTopColor: 'rgba(0, 0, 0, 0)' }}>
            <Text style={styles.txtLabel} >
              {__.t('storyItem1')}
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              placeholder={__.t('storyPlaceHolder1')}
              placeholderTextColor={'rgba(255,255,255,0.4)'}
              style={{ ...styles.txtInput }} />
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.txtLabel} >
              {__.t('storyItem2')}
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              placeholder={__.t('storyPlaceHolder2')}
              placeholderTextColor={'rgba(255,255,255,0.4)'}
              style={{ ...styles.txtInput }} />
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.txtLabel} >
              {__.t('storyItem3')}
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              placeholder={__.t('storyPlaceHolder3')}
              placeholderTextColor={'rgba(255,255,255,0.4)'}
              style={{ ...styles.txtInput }} />
          </View>
          <View style={styles.itemRow}>
            <Text style={{ ...styles.txtLabel, opacity: null }} >
              {__.t('storyItem4')}
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              placeholder={__.t('storyPlaceHolder4')}
              placeholderTextColor={'rgba(255,255,255,0.4)'}
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
    fontWeight: '500',
  },
  txtInput: {
    color: '#fff',
    fontSize: 22,
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
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderTopWidth: 1,
  },
  rootContainer: {
    flex: 1,
    marginHorizontal: 20
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
};