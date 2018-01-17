import React from 'react';
import __ from 'react-native-i18n';
import { connect } from 'react-redux';
import { StyleSheet, Dimensions, TouchableOpacity, FlatList, ScrollView, View, Text, Image, 
  PixelRatio, Platform } from 'react-native';

import { ICON_GOBACK, ICON_NHIPTIM, BG_IMAGE, ICON_CLOCK } from 'app/constants';
import LeftCenterRight from 'app/components/LeftCenterRight';

// import withConnect from './withConnect';

class MedicalSurvivalDetail extends React.PureComponent {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
  }

  

  renderHeader() {
    return (
      <LeftCenterRight
        style={styles.headerContainer}
        left={this.renderGoBack()}
        body={this.renderHeaderTitle()}
      />
    );
  }

  renderHeaderTitle() {
    return (
      <View style={styles.headerTitleContainer}>
        <Image source={ICON_NHIPTIM} style={{width:30,height:26.04}} />
        <Text style={styles.headerTitleText}>{__.t('heartbeat')}</Text>
      </View>
    );
  }

  renderGoBack() {
    return (
      <TouchableOpacity onPress={this.onGoBack}>
        <Image style={styles.goBackIcon} source={ICON_GOBACK} />
      </TouchableOpacity>
    );
  }

  onGoBack = () => {
    this.props.navigation.goBack();
  } 

  renderBody() {
    return (
      <ScrollView style={styles.body}>
        <Text style={styles.title}>Đơn vị: BPM</Text>
        <FlatList
          keyExtractor={this._keyExtractor}
          data={[
            {time:'15:33 AM', date:'15/05/2017', value:'45-90'}, 
            {time:'17:33 AM', date:'15/05/2017', value:'46-91'},
            {time:'19:33 AM', date:'15/05/2017', value:'47-92'},
            {time:'21:33 AM', date:'15/05/2017', value:'48-93'},
          ]}
          renderItem={({item}) => (
            <View style={styles.detail}>
              <View style={styles.left}>
                <Image source={ICON_CLOCK} style={{width:23.98,height:24}}/>
                <Text style={{fontSize:16,color:'#FFFFFF', backgroundColor: 'transparent'}}>{item.date}</Text>
                <Text style={{fontSize:16,color:'#FFFFFF', backgroundColor: 'transparent'}}>{item.time}</Text>
              </View>
              <View style={styles.right}>
                <Text style={{fontSize:24,color:'#F2C94C'}}>{item.value}</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
    );
    
  }
  
  _keyExtractor = (item, index) => 'item_'+index;

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={BG_IMAGE}
          style={styles.rootBgImage}
        />
        {this.renderHeader()}
        {this.renderBody()}
      </View>
    );
  }
}
const styles ={
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
  },
  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 21,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontFamily: 'Roboto-Light',
    marginLeft:10
  },
  goBackIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },
  rootBgImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  
  body:{
    borderTopWidth:1,
    borderTopColor:'rgba(255,255,255,0.15)',
    paddingTop:15
  },

  title: {
    color:'#52C234',
    fontSize:14,
    marginLeft:20,
    backgroundColor: 'transparent',
    
  },

  detail:{
    width: Dimensions.get('window').width,
    paddingHorizontal:20,
    paddingVertical:15,
    borderBottomWidth:1,
    borderBottomColor:'rgba(255,255,255,0.15)',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor: 'transparent',
  },

  left:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    flex:1.5
  },

  right:{
    flex:1,
    alignItems:'flex-end'
  }
};

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(MedicalSurvivalDetail);
