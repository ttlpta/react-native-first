import React from 'react';
import __ from 'react-native-i18n';
import { connect } from 'react-redux';
import { TouchableOpacity, StyleSheet, Dimensions, Image, View, Text, TextInput, ScrollView,
         FlatList, PixelRatio, Platform
 } from 'react-native';

import { ICON_TELEPHONE, ICON_PEOPLE, ICON_RIGHT, ICON_CALENDAR3, ICON_HUYETAP,
ICON_NHIETDO, ICON_NHIPTHO, ICON_NHIPTIM, ICON_SPO2
 } from 'app/constants';


// import withConnect from './withConnect';

class MedicalSurvival extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  onSurvivalDetail = () =>{
    this.props.navigation.navigate('MedicalSurvivalDetail');
  }

  renderLife() {
    const fontSizeNumber = (Platform.OS === 'ios') ? 
      Math.round(PixelRatio.roundToNearestPixel(20)) : Math.round(PixelRatio.roundToNearestPixel(20)) - 2;
    return (
      <View style={styles.detail}>
        <View style={styles.chiso}>
          <View style={styles.left}>
            <View style={{width:42,alignItems:'center'}}>
              <Image source={ICON_NHIPTIM} style={{width:36.86,height:32,tintColor :'#FFFFFF'}} />
            </View>
          </View>
          <View style={styles.right}>
            <TouchableOpacity onPress={this.onSurvivalDetail} style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{fontSize:18,color:'#FFFFFF'}}>{__.t('heartbeat')}</Text>
              <View style={styles.rightInRightChild}>              
                <View style={{alignItems:'flex-end',paddingRight:20}}>
                  <Text style={{fontSize:12,color:'#FFFFFF',}}>BPM</Text>
                  <Text style={{fontSize: 24, color:'#F2C94C'}}>49-55</Text>
                </View>
                <Image source={ICON_RIGHT} style={{width:9,height:27,resizeMode:'contain'}}/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.chiso}>
          <View style={styles.left}>
            <View style={{width:42,alignItems:'center'}}>
              <Image source={ICON_HUYETAP} style={{width:32,height:32,tintColor :'#FFFFFF'}}/>
            </View>              
          </View>
          <View style={styles.right}>
            <TouchableOpacity onPress={this.onSurvivalDetail} style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{fontSize:18,color:'#FFFFFF'}}>{__.t('blood')}</Text>
              <View style={styles.rightInRightChild}>
                <View style={{alignItems:'flex-end',paddingRight:20}}>
                  <Text style={{fontSize:12,color:'#FFFFFF',}}>mmHg</Text>
                  <Text style={{fontSize: 24, color:'#F2C94C'}}>80-120</Text>
                </View>
                <Image source={ICON_RIGHT} style={{width:9,height:27,resizeMode:'contain'}}/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.chiso}>
          <View style={styles.left}>
            <View style={{width:42,alignItems:'center'}}>
              <Image source={ICON_NHIPTHO} style={{width:35.05,height:32,tintColor :'#FFFFFF'}} />
            </View>              
          </View>
          <View style={styles.right}>
            <TouchableOpacity onPress={this.onSurvivalDetail} style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{fontSize:18,color:'#FFFFFF'}}>{__.t('breath')}</Text>
              <View style={styles.rightInRightChild}>
                <View style={{alignItems:'flex-end',paddingRight:20}}>
                  <Text style={{fontSize:12,color:'#FFFFFF',}}>{__.t('per')}</Text>
                  <Text style={{fontSize: 24, color:'#F2C94C'}}>15-20</Text>
                </View>
                <Image source={ICON_RIGHT} style={{width:9,height:27,resizeMode:'contain'}}/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.chiso}>
          <View style={styles.left}>
            <View style={{width:42,alignItems:'center'}}>
              <Image source={ICON_NHIETDO} style={{width:18.27,height:32,tintColor :'#FFFFFF',}}/>
            </View>            
          </View>
          <View style={styles.right}>
            <TouchableOpacity onPress={this.onSurvivalDetail} style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{fontSize:18,color:'#FFFFFF'}}>{__.t('Temperature')}</Text>
              <View style={styles.rightInRightChild}>
                <View style={{alignItems:'flex-end',paddingRight:20}}>
                  <Text style={{fontSize:12,color:'#FFFFFF',}}>oC</Text>
                  <Text style={{fontSize: 24, color:'#F2C94C'}}>37.1</Text>
                </View>
                <Image source={ICON_RIGHT} style={{width:9,height:27,resizeMode:'contain'}}/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.spo2}>
          <View style={styles.left}>
            <View style={{width:42,alignItems:'center'}}>
              <Image source={ICON_SPO2} style={{width:23.51,height:32,tintColor :'#FFFFFF',}}/>
            </View>
          </View>
          <View style={styles.right}>
            <TouchableOpacity onPress={this.onSurvivalDetail} style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{fontSize:18,color:'#FFFFFF'}}>SPO2</Text>
              <View style={styles.rightInRightChild}>
                <View style={{alignItems:'flex-end',paddingRight:20}}>
                  <Text style={{fontSize:12,color:'#FFFFFF',}}>%</Text>
                  <Text style={{fontSize: 24, color:'#F2C94C'}}>98.0</Text>
                </View>
                <Image source={ICON_RIGHT} style={{width:9,height:27,resizeMode:'contain'}}/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.renderLife()}
      </ScrollView>
    );
  }
}

const styles ={
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    // flex: 1
  },

  title:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginHorizontal:10,
  },

  detail:{
    flexDirection:'column',
  },

  line1:{
    flexDirection:'row',
    marginBottom:2
  },

  line2:{
    flexDirection:'row',
    marginTop:2,
    marginBottom:2
  },

  chiso:{
    paddingLeft:10,
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:10,
  },

  spo2:{
    paddingLeft:10,
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:10,
  },

  left:{
    flexDirection:'row',
    marginBottom:13,
    alignItems:'center',
    flex:1,
  },

  right:{
    // alignItems:'flex-end',
    flex:5,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    // marginBottom:15,
    borderBottomWidth:1,
    borderBottomColor:'rgba(255, 255, 255, 0.15)',
    paddingBottom:10
  },

  center:{
    marginHorizontal:12,
    marginVertical:17,
    flexDirection:'row',
  },

  line3Left:{
    flexDirection:'row',
    alignItems:'center',
    flex:1,
  },

  line3Right:{
    flexDirection:'row',
    alignItems:'center',
    flex:1,
    justifyContent:'space-between'
  },

  rightInRightChild:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingRight:10
  }
};

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(MedicalSurvival);
