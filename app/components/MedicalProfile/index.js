import React from 'react';
import __ from 'react-native-i18n';
import { connect } from 'react-redux';
import { TouchableOpacity, StyleSheet, Dimensions, Image, View, Text, TextInput, ScrollView,
         FlatList
 } from 'react-native';
 import MedicalProfileHistoryItem from './../MedicalProfileHistoryItem';

import { ICON_TELEPHONE, ICON_PEOPLE, ICON_RIGHT, ICON_CLOCK, ICON_SMALL_RIGHT } from 'app/constants';
import MedicalSurvival from 'app/components/MedicalSurvival';


// import withConnect from './withConnect';

class MedicalProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state={
      withdrawMoney: '',
    };
  }

  onUpdateInfo = () => {
    this.props.navigation.navigate('BasicInformation');
  }

  onUpdateTiensubenh = () => {
    this.props.navigation.navigate('PatientStory');
  }
  
  _keyExtractor = (item, index) => 'item_'+index;

  renderInfo(){
    return (
      <View style={styles.detail}>
        <View style={styles.textInfo}>
          <View style={styles.left}>
            <Image source={ICON_PEOPLE} style={{width:22, height:22}} />
            <Text style={styles.text}>{__.t('basic')}</Text>
          </View>
          <TouchableOpacity style={styles.right} onPress={this.onUpdateInfo}>
            <Text style={styles.textEdit}>Sửa</Text>
            <Image source={ICON_SMALL_RIGHT} style={{width:6, height:18, resizeMode:'contain'}} />
          </TouchableOpacity>
        </View>
        <View style={styles.textItem}>
          <Text style={styles.data}>{__.t('height')}</Text>
          <Text style={styles.value}>1.50 m</Text>
        </View>
        <View style={styles.textItem}>
          <Text style={styles.data}>{__.t('weight')}</Text>
          <Text style={styles.value}>50 kg</Text>
        </View>
        <View style={styles.textItem}>
          <Text style={styles.data}>{__.t('bloodgroup')}</Text>
          <Text style={styles.value}>Nhóm máu O</Text>
        </View>
        <View style={styles.textItem}>
          <Text style={styles.data}>{__.t('bloodpresure')}</Text>
          <Text style={styles.value}>120/180</Text>
        </View>
      </View>
    );
  }

  renderTiensubenh = () => {
    return(
      <View style={styles.detail}>
        <View style={styles.textInfo}>
          <View style={styles.left}>
            <Text style={{...styles.text,marginLeft:0}}>{__.t('accountProfile.prehistoricPatient')}</Text>
          </View>
          <TouchableOpacity style={styles.right} onPress={this.onUpdateTiensubenh}>
            <Text style={styles.textEdit}>{__.t('edit')}</Text>
            <Image source={ICON_SMALL_RIGHT} style={{width:6, height:18, resizeMode:'contain'}} />
          </TouchableOpacity>
        </View>
        <View style={styles.textTiensubenh}>
            <Text style={styles.text1}>- Dị ứng tôm cua, hải sản</Text>
            <Text style={styles.text1}>- Viêm họng mãn tính</Text>
            <Text style={styles.text1}>- Phẩu thuật nội soi dạ dày, tháng 8/2016</Text>
        </View>
      </View>
    );
  }

  renderHistory(){
    return (
      <View style={styles.history}>
        <View style={styles.textInfoHistory}>
          <Text style={{...styles.text,marginLeft:0}}>{__.t('survivalindex')}</Text>
        </View>
        {this.renderSurvival()}
      </View>
    );
  }

  renderSurvival(){
    return (
      <MedicalSurvival {...this.props} />
    );
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.renderInfo()}
        {this.renderTiensubenh()}
        {this.renderHistory()}
      </ScrollView>
    );
  }
}

const styles = ({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    marginTop:24,
    flex: 1
  },

  detail: {
    borderBottomWidth:5,
    borderBottomColor:'rgba(0, 0, 0, 0.15)',
    paddingHorizontal:24,
    paddingBottom:10,
    marginBottom:19
  },

  textInfo: {
    flexDirection : 'row',
    alignItems: 'center',
    paddingBottom:16,
    justifyContent:'space-between'
  },

  textInfoHistory: {
    flexDirection : 'row',
    alignItems: 'center',
    marginBottom:13,
    paddingHorizontal:24,
  },

  text :{
    fontSize:16,
    color: '#52C234',
    marginLeft:10
  },

  textItem: {
    flexDirection: 'row',
    paddingBottom:10,
    alignItems:'center'
  },

  data : {
    color:'#FFFFFF',
    fontSize:16,
    flex:2
  },

  value : {
    color:'#FFFFFF',
    fontSize:18,
    flex:3,
    paddingLeft:20
  },

  left:{
    flexDirection:'row'
  },

  right:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },

  textEdit:{
    fontSize:14,
    marginRight:10,
    color:'#FFFFFF'
  },

  textTiensubenh:{
    flexDirection: 'column',
    paddingBottom:5,
  },

  text1:{
    color:'#FFFFFF',
    paddingBottom:5
  }

});

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(MedicalProfile);
