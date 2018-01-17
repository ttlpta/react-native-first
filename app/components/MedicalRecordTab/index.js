import React from 'react';
import __ from 'react-native-i18n';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import MedicalProfile from './../MedicalProfile';
import MedicalHistoryTab from './../MedicalHistoryTab';
import MedicalRecordTabBar from './../MedicalRecordTabBar';

// import withConnect from './withConnect';

class MedicalRecordTab extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollableTabView
        initialPage={0}
        renderTabBar={() => <MedicalRecordTabBar />}
      >
        <MedicalProfile navigation={this.props.navigation} tabLabel={__.t('medicalRecord')} />
        <MedicalHistoryTab navigation={this.props.navigation} tabLabel={__.t('history')} />
      </ScrollableTabView>
    );
  }
}

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(MedicalRecordTab);
