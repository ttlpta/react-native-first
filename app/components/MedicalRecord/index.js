import React from 'react';
import __ from 'react-native-i18n';
import { connect } from 'react-redux';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Image, TextInput } from 'react-native';

import LeftCenterRight from './../LeftCenterRight';
import MedicalRecordTab from './../MedicalRecordTab';

import {
  BG_IMAGE, ICON_GOBACK, ICON_TERM, ICON_USER,
  ICON_ACCOUNT, ICON_PENCIL, ICON_MOBILEPHONE, ICON_ENVELOPE, ICON_EARTH, ICON_LOCK,
  ICON_CAMERA_BLACK

} from 'app/constants';
// import withConnect from './withConnect';

class MedicalRecord extends React.PureComponent {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      canEdit: false,
      showbuttonSave: false,
      language: this.props.mylanguage
    };
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
        <Text style={styles.headerTitleText}>{__.t('personalMedical')}</Text>
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

  render() {
    return (
        <View style={styles.container}>
          <Image
            source={BG_IMAGE}
            style={styles.rootBgImage}
          />
          {this.renderHeader()}
          <MedicalRecordTab navigation={this.props.navigation} />
        </View>
    );
  }
}

const styles = {
  
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
  scrollView: {
    flex: 1,
  },
};

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(MedicalRecord);
