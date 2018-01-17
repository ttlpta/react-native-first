import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';

import { ICON_BANK_CARD, ICON_CALENDAR2 } from 'app/constants';

// import withConnect from './withConnect';

class AccountBalanceHistoryItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { item } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.containerLeft}>
          <Image 
            style={ (item.type == 'plus') ? styles.bankCardIcon : styles.calendarIcon } 
            source={ (item.type == 'plus') ? ICON_BANK_CARD : ICON_CALENDAR2 } />
        </View>
        <View style={styles.containerRight}>
          <View style={styles.containerRightTop}>
            <Text style={(item.type == 'plus') ? styles.priceTagPlus : styles.priceTagMinus }>
              {(item.type == 'plus') ? '+' : '-' } {' 100,000,000 VND'}
            </Text>
            <Text style={styles.time}>{'2 '}{I18n.t("accountBalance.hour",{ locale: this.props.mylanguage })}</Text>
          </View>
          <Text style={styles.log}>{I18n.t('accountBalance.log' )}</Text>
        </View>
      </View>
      
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 20,
  },
  containerLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems : 'center',
    flexDirection: 'column',
  },
  calendarIcon: {
    width: 20,
    height: 20
  },
  bankCardIcon: {
    width: 24,
    height: 17.14
  },
  containerRight: {
    flex: 5,
    flexDirection: 'column',
  },
  containerRightTop: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  priceTagMinus : {
    color: '#D4FCC3',
    fontSize: 19,
    backgroundColor: 'transparent',
    fontFamily : 'Roboto-Medium'
  },
  priceTagPlus : {
    color: '#F2C94C',
    fontSize: 19,
    backgroundColor: 'transparent',
    fontFamily : 'Roboto-Medium'
  }, 
  time : {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
    position: 'absolute',
    top: 15,
    right: 10,
    fontFamily : 'roboto-regular',
  },
  log: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 15,
  }
});

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(AccountBalanceHistoryItem);
