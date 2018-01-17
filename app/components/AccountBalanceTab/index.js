import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import AccountBalanceHistory from './../AccountBalanceHistory';
import AccountBalanceDeposit from './../AccountBalanceDeposit';
import AccountBalanceTabBar from './../AccountBalanceTabBar';

// import withConnect from './withConnect';

class AccountBalanceTab extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollableTabView
        initialPage={0}
        renderTabBar={() => <AccountBalanceTabBar />}
      >
        <AccountBalanceHistory tabLabel={I18n.t('accountBalance.tablabel1' )} />
        <AccountBalanceDeposit tabLabel={I18n.t('accountBalance.tablabel2' )} />
      </ScrollableTabView>
    );
  }
}

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(AccountBalanceTab);
