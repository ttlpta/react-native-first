import React from 'react';
import { StyleSheet, Dimensions, Image, View, Text, FlatList } from 'react-native';


// import withConnect from './withConnect';
import AccountBalanceHistoryItem from './../AccountBalanceHistoryItem';

export default class AccountBalanceHistory extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FlatList
        data={[{type: 'plus'}, {type: 'plus'}, {key: 'minus'}]}
        renderItem={({item}) => <AccountBalanceHistoryItem item={item}/>}
      />
    );
  }
}
const styles = StyleSheet.create({

});
