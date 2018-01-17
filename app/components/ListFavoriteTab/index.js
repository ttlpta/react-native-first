import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import ListFavoriteTabBar from './../ListFavoriteTabBar';
import ListFavoriteDoctor from './../ListFavoriteDoctor';
import ListFavoriteClinic from './../ListFavoriteClinic';

// import withConnect from './withConnect';

class ListFavoriteTab extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollableTabView
        initialPage={0}
        renderTabBar={() => <ListFavoriteTabBar />}
      >
        <ListFavoriteDoctor {...this.props} tabLabel={I18n.t('lvSearchScreen.heading2' )} />
        <ListFavoriteClinic {...this.props} tabLabel={I18n.t('lvSearchScreen.heading3' )} />
      </ScrollableTabView>
    );
  }
}

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(ListFavoriteTab);
