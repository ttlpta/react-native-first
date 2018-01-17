import React from 'react';
import I18n from 'react-native-i18n';
import _ from 'lodash';
import {
  Platform, StyleSheet, View, ScrollView, Dimensions, Text, TextInput,
  Image, ActivityIndicator, TouchableHighlight, TouchableOpacity, FlatList
} from 'react-native';

import { connect } from 'react-redux';
import withConnect from './withConnect';

import * as app from 'app/constants/app';
import * as gui from 'app/constants/gui';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';
import * as asyncdata from 'app/data/asyncdata';

import NiceImage from 'app/components/NiceImage';
import CheckBox from 'react-native-checkbox';

const ICON_FAV_ON = require('app/assets/images/icon_favorite_on.png');
const ICON_FAV_OFF = require('app/assets/images/icon_favorite_off.png');
const ICON_PRICE = require('app/assets/images/icon_price.png');

import { ICON_DOCTOR, ICON_CLINIC, ICON_POSITION, ICON_ADDRESS, ICON_SHARE, ICON_INFO, CHECKED, UNCHECKED } from 'app/constants';

class ListFavoriteClinic extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked : false,
      dataClinic: props.dataClinic,
      // favorite: this.props.item.favorite,
      // status: this.props.item.status,
      // doctorShare: this.props.item.doctorShare,
      // hide: this.props.item.hide,
    };
  }

  componentWillMount(){
    const { listFavClinic } = this.props;
    listFavClinic(this.props.dataAuth.user_code);
  }

  onClickClinic = (id) => {
    const { dataClinic } = this.props;
    const filterDataById = _.find(dataClinic, (value)=>
      (value.clinic_id == id)
    );
    // filterId[0].stroke=
    // const data = filterId[0];
    this.props.navigation.navigate('DetailClinic', {data :{ ...filterDataById, checkoutModalVisible : false}});
  }

  onPressFavorite = () =>{
    this.setState({
      favorite: !this.state.favorite
    });
  }

  onPressStatus = () =>{
    this.setState({
      status: !this.state.status
    });
  }

  onShare = () => {
    this.setState({hide: false, doctorShare: false, status: !this.state.status})
  }

  onDeny = () => {
    this.setState({hide: true, doctorShare: !this.state.doctorShare})
  }

  _keyExtractor = (item, index) => 'item_'+index;

  renderBody({item}) {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.left}>
          <TouchableOpacity onPress={() => this.onClickClinic(item.clinic_id)} style={styles.leftContainer}>
            <NiceImage
              style={styles.avatarImage}
              defaultSource={ICON_CLINIC}
              source={{ uri : item.avatar_url}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detail}>
          <TouchableOpacity onPress={() => this.onClickClinic(item.clinic_id)} >
            <Text style={styles.nameClinic}>{item.clinic_name}</Text>
          </TouchableOpacity>
          <View style={styles.info}>
            <Image source={ICON_ADDRESS} style={{width:6.7,height:11.38, marginTop:5}}/>
            <Text style={styles.textinfo}>{item.address}</Text>
          </View>
        </View>
        {
          !this.state.favorite &&
          <TouchableOpacity style={{backgroundColor:'transparent'}} onPress={this.onPressFavorite}>
            <Image source={ICON_FAV_ON} style={{width:24,height:22, backgroundColor:'transparent'}}/>
          </TouchableOpacity>
        }
        {
          this.state.favorite &&
          <TouchableOpacity style={{backgroundColor:'transparent'}} onPress={this.onPressFavorite}>
            <Image source={ICON_FAV_OFF} style={{width:24,height:22, backgroundColor:'transparent'}}/>
          </TouchableOpacity>
        }
      </View>
    );
  }

  render() {
    return (
      <View style={styles.bodyContainer}>
        <FlatList
            keyExtractor={this._keyExtractor}
            data={this.props.dataClinic}
            renderItem={({item}) => 
              this.renderBody({item})}
          />
      </View>
    );
  }
}

export default withConnect(ListFavoriteClinic);

const styles = {
  avatarImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },

  rootContainer:{
    flexDirection:'row',
    paddingVertical:15,
    paddingHorizontal:15,
    borderBottomColor:'rgba(255, 255, 255, 0.2)',
    borderBottomWidth:1
  },

  left:{
    flexDirection:'column',
  },

  cancelShare:{
    marginTop:11,
    backgroundColor:'rgba(255, 0, 0, 0.8)',
    width:100,
    height:28,
    flexDirection:'row',
    borderRadius:50,
    alignItems:'center'
  },

  share:{
    marginTop:11,
    backgroundColor:'rgba(255, 255, 255, 0.2)',
    width:100,
    height:28,
    flexDirection:'row',
    borderRadius:50,
    alignItems:'center'
  },

  nameClinic:{
    fontSize:18,
    textAlign:'left',
    color:'#FFD638',
    backgroundColor: 'transparent'
  },

  detail:{
    flex:2,
    paddingLeft:10  
  },

  namepos:{
    fontSize:14,
    color:'#FFF',
    backgroundColor: 'transparent'
  },

  nameDoctor:{
    fontSize:18,
    color:'#FFD638',
    backgroundColor: 'transparent'
  },

  info:{
    flexDirection:'row',
    marginTop:10
  },

  textinfo:{
    fontSize:14,
    paddingLeft:5,
    color:'#FFF',
    backgroundColor: 'transparent'
  },

  price:{
    flexDirection:'row',
    // marginTop:10
  },

  doctorShare:{
    flexDirection:'row',
    marginTop:10,
  },
  
  acceptShare:{
    fontSize:15,
    color:'rgba(0, 0, 0, 0.75)',
    textAlign:'center',
    paddingVertical:6
  },

  denyShare:{
    fontSize:14,
    color:'#FFFFFF',
    textAlign:'center',
    paddingVertical:6
  },

  sharebtn:{
    width:140,borderRadius:100,backgroundColor:'#FFD638',overflow: 'hidden'
  },

  denybtn:{
    width:78,borderRadius:30,borderWidth:1,borderColor:'#C4C4C4',backgroundColor:'rgba(196, 196, 196, 0.1)',marginLeft:5,
  },

  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  
};