import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { StyleSheet, Dimensions, Image, View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';

import AccountBalanceTab from './../AccountBalanceTab';
import LeftCenterRight from './../LeftCenterRight';
// import withConnect from './withConnect';
import { BG_IMAGE, ICON_GOBACK, ICON_WALLET } from 'app/constants';

class AccountBalance extends React.PureComponent {
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props);
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
        <Image style={styles.headerTitleIcon} source={ICON_WALLET} />
        <Text style={styles.headerTitleText}>{I18n.t('accountBalance.header')}</Text>
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

  onMenu = () => {
    this.props.navigation.navigate('DrawerOpen');
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={BG_IMAGE}
          style={styles.rootBgImage}
        /> 
        {this.renderHeader()}
        <View style={styles.containerTop}>
          <Text style={styles.label}>{I18n.t('accountBalance.label')}</Text>
          <Text style={styles.priceTag}>{'1,200,000'}</Text>
        </View>
        <AccountBalanceTab />
      </View>
    );
  }
}
const styles = {
  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 0,
  },
  menuIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 10,
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
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  containerTop: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  label: {
    color: '#fff',
    fontSize: 17,
  },
  priceTag : {
    color: '#F2C94C',
    fontWeight: 'bold',
    fontSize: 48,
    backgroundColor: 'transparent',
  },
};

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(AccountBalance);