import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { TouchableOpacity, StyleSheet, Dimensions, Image, View, Text, TextInput } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

import { ICON_TELEPHONE } from 'app/constants';


// import withConnect from './withConnect';

class AccountBalanceDeposit extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state={
      withdrawMoney: '',
    };
  }

  onChangeWithDrawMoney = (text) => {
    text = (!text.length) ? '0' : text;
    let find = '[,+-.]';
    let re = new RegExp(find, 'g');
    const textFormat = text.replace(re, '');
    if(textFormat) {
      let amount = parseFloat(textFormat).toFixed(2);
      let splitAmount = amount.split(".")[0];
      let i = splitAmount.length - 4;
      
      while (i >= 0) {
        splitAmount = splitAmount.slice(0, i + 1) + "," + splitAmount.slice(i + 1);
        i = i - 3;
      }

      this.setState({withdrawMoney: splitAmount});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <Image source={ICON_TELEPHONE} style={styles.icon} />
          <Text style={{ color: '#D4FCC3', fontSize: 16 }}>{I18n.t('AccountBalanceDeposit.title' )}</Text>
        </View>
        <View style={styles.containerBottom}>
          <Content style={stylesNativeBase.content}>
            <Form>
              <Item stackedLabel>
                <Label style={stylesNativeBase.label}>{I18n.t('AccountBalanceDeposit.moneys', { locale: this.props.mylanguage })}</Label>
                <Input 
                      style={stylesNativeBase.input} 
                      placeholder={'0.00'} 
                      onChangeText={(text) => this.onChangeWithDrawMoney(text)}
                      value={this.state.withdrawMoney}
                      keyboardType={"phone-pad"} 
                    />
              </Item>
            </Form>
          </Content>
        </View>
        <TouchableOpacity style={styles.btnFinish}>
          <LinearGradient colors={['#FBC700', '#EAA30A']} style={styles.linearGradient}>
            <Text style={styles.btnFinishText}>
              {I18n.t('AccountBalanceDeposit.recharge' )}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
}
const stylesNativeBase = {
  lable: {
    backgroundColor: 'rgba(0.0, 0.0, 0.0, 0.5)',
    fontSize: 15
  },
  input: {
    fontSize: 28,
    color: '#333333'
  },
  content: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 8,
    height: 130,
    borderRadius: 3
  },
};
const styles = StyleSheet.create({
  btnFinishText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    width: Dimensions.get('window').width,
    paddingVertical: 20,
    justifyContent: 'center'
  },
  btnFinish: {
    flex: 1
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 10
  },
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1
  },
  containerTop: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  containerBottom: {
    flex: 5,
    flexDirection: 'row',
  },
  image: {
    width: Dimensions.get('window').width / 2 - 40,
    height: Dimensions.get('window').width / 2 - 40,
  },
  touch: {
    padding: 15
  }
});

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(AccountBalanceDeposit);
