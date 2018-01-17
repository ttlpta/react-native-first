import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';

// import withConnect from './withConnect';
import { ICON_SHARE, ICON_CLOCK2 } from 'app/constants';

export default class MedicalRecordTabBar extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return <View style={styles.tabs}>
      {this.props.tabs.map((tab, i) => {
        return (
          <TouchableOpacity
            key={tab} 
            onPress={() => this.props.goToPage(i)} 
            style={this.props.activeTab === i ? styles.tabActive : styles.tab}>
            <Image source={(i==0) ? ICON_SHARE : ICON_CLOCK2} style={(i == 0) ? {width:24,height:21.78} : {width:24,height:24.02}}/>
            <Text style={this.props.activeTab === i ? styles.textActive : styles.text}>{tab}</Text>
          </TouchableOpacity>
        );
      })}
    </View>;
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    flexDirection:'row'
  },
  tabActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
    ...Platform.select({
      ios: {
        backgroundColor: 'transparent',
        shadowColor: '#6FCF97',
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
    }),
    flexDirection:'row'
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  text: {
    backgroundColor: 'transparent', 
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 18,
    marginLeft:5
  },
  textActive: {
    fontSize: 18,
    backgroundColor: 'transparent', 
    color: '#fff',
    fontFamily: 'Roboto',
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 2,
    ...Platform.select({
      ios: {
        fontSize: 18,
        backgroundColor: 'transparent', 
        color: '#fff',
        fontFamily: 'Roboto',
        shadowColor: '#6FCF97',
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
    }),
    marginLeft:5
  }
});
