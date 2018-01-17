import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { StyleSheet, TouchableOpacity, ScrollView, View, Text, Image } from 'react-native';

import { ICON_BANK_CARD, ICON_CALENDAR2, ICON_RIGHT, ICON_CLOCK } from 'app/constants';

// import withConnect from './withConnect';

class MedicalProfileHistoryItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onNavigate = () =>{
    this.props.navigation.navigate('DetailMedicalRecord');
  }

  render() {
    const { item } = this.props;
    return (
      <View style={{borderBottomWidth:1,borderBottomColor:'rgba(255, 255, 255, 0.15)',}}>
        <TouchableOpacity style={styles.history} onPress={this.onNavigate}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.value}>{item.value}</Text>
          <Image source={ICON_RIGHT} style={{width:9,height:27, resizeMode:'contain'}} />
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  history: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:24,
    paddingTop: 16,
    paddingBottom:10,
  },

  date : {
    color:'#FFFFFF',
    fontSize:16,
    flex:2
  },

  value : {
    color:'#FFFFFF',
    fontSize:18,
    flex:3,
    paddingLeft:20
  }
  
});

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(MedicalProfileHistoryItem);
