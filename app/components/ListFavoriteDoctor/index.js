import React from 'react';
import I18n from 'react-native-i18n';
import _ from 'lodash';
import {
  Platform, StyleSheet, View, ScrollView, Dimensions, Text, TextInput,
  Image, ActivityIndicator, TouchableHighlight, TouchableOpacity, FlatList
} from 'react-native';

import { connect } from 'react-redux';
import withConnect from './withConnect';
import Loading from 'app/components/Loading';

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

class ListFavoriteDoctor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked : false,
      dataDoctor : null,
    };
    this.ItemIdx = null;
    this.shareItemIdx = null;
  }

  componentWillMount(){
    this.props.listFavDoctor(this.props.dataAuth.user_code);
  }

  componentWillReceiveProps(nextProps){
    if (this.props.isGettingDataDoctor && !nextProps.isGettingDataDoctor){
      this.setState({dataDoctor : nextProps.dataDoctor});
    }

    if (this.props.isSharing && !nextProps.isSharing){
      this.setState({dataDoctor : _.map(this.state.dataDoctor, (item, index) => {
        return (index === this.ItemIdx) ? {...item, emr_share_status : 6} : item
      })})
    }

    if (this.props.isCanceling && !nextProps.isCanceling){
      this.setState({dataDoctor : _.map(this.state.dataDoctor, (item, index) => {
        return (index === this.ItemIdx) ? {...item, emr_share_status : 5} : item
      })})
    }

    if (this.props.isAccepting && !nextProps.isAccepting){
      this.setState({dataDoctor : _.map(this.state.dataDoctor, (item, index) => {
        return (index === this.ItemIdx) ? {...item, emr_share_status : 4} : item
      })})
    }

    if (this.props.isDenying && !nextProps.isDenying){
      this.setState({dataDoctor : _.map(this.state.dataDoctor, (item, index) => {
        return (index === this.ItemIdx) ? {...item, emr_share_status : 3} : item
      })})
    }
  }

  onClickDoctor = (id) => {
    const { dataDoctor } = this.state;
    const filterId = _.filter(dataDoctor, (value)=>
      (value.doctor_id == id)
    );
    const data = filterId[0];
    this.props.navigation.navigate('DetailDoctor', { ...data, checkoutModalVisible : false });
  }

  onPressFavorite = () =>{
    this.setState({
      favorite: !this.state.favorite
    });
  }

  filterDoctor(dataDoctor){
    const dataFilter = _.filter(dataDoctor,(value) =>
      (value.emr_share_status == 0 || value.emr_share_status == 2 || value.emr_share_status == 4 || value.emr_share_status == 6)
    );
    return (dataFilter);
  }

  onShareMedical = (index, dw_id, user_code, doctor_code) =>{
    const { shareMedical } = this.props;
    shareMedical(dw_id, user_code, doctor_code);
    this.ItemIdx = index;
    // this.setState({sharing : !this.state.sharing})
  }

  onCancelMedical = (index, dw_id, user_code, doctor_code) =>{
    const { cancelMedical } = this.props;
    cancelMedical(dw_id, user_code, doctor_code);
    this.ItemIdx = index;
    // this.setState({sharing : !this.state.sharing})
  }

  onShare = (index, dw_id, user_code, doctor_code) => {
    const { acceptMedical } = this.props;
    acceptMedical(dw_id, user_code, doctor_code);
    this.ItemIdx = index;
  }

  onDeny = (index, dw_id, user_code, doctor_code) => {
    const { denyMedical } = this.props;
    denyMedical(dw_id, user_code, doctor_code);
    this.ItemIdx = index;
  }

  _keyExtractor = (item, index) => 'item_'+index;

  renderBody({item, index}){
    return (
      <View style={styles.rootContainer}>
        <View style={styles.left}>
          <TouchableOpacity onPress={() => this.onClickDoctor(item.doctor_id)} style={styles.leftContainer}>
            <NiceImage
              style={styles.avatarImage}
              defaultSource={ICON_DOCTOR}
              source={{uri : item.avatar_url}}
            />
          </TouchableOpacity>
          {
            (item.emr_share_status == 0 || item.emr_share_status == 2 || item.emr_share_status == 4 || item.emr_share_status == 6 ) && 
            
            <TouchableOpacity style={styles.cancelShare} onPress={() => this.onCancelMedical(index, item.dw_id, this.props.dataAuth.user_code, item.doctor_code)}>
              <Image source={ICON_SHARE} style={{marginLeft:14,width:18, height:16.94, backgroundColor:'#FF0000'}}/>
              <Text style={{color:'#FFF', marginLeft:10, fontSize:13}}>{I18n.t('cancel' )}</Text>
            </TouchableOpacity>
          }
          {
            (item.emr_share_status == 3 || item.emr_share_status == 5 ) && 
            <TouchableOpacity style={styles.share} onPress={() => this.onShareMedical(index, item.dw_id, this.props.dataAuth.user_code, item.doctor_code)}>
              <Image source={ICON_SHARE} style={{marginLeft:14, width:18, height:16.94, backgroundColor:'rgba(255, 255, 255, 0.2)'}}/>
              <Text style={{color:'#FFF', marginLeft:10, fontSize:13}}>{I18n.t('share' )}</Text>
            </TouchableOpacity>
          }
        </View>
        <View style={styles.detail}>
          <Text style={styles.namepos}>{item.speciality}</Text>
          <TouchableOpacity onPress={() => this.onClickDoctor(item.doctor_id)}>
            <Text style={styles.nameDoctor}>{item.doctor_name}</Text>
          </TouchableOpacity>
          <View style={styles.info}>
            <Image source={ICON_INFO} style={{width:11.14,height:11.14, marginTop:5}}/>
            <Text style={styles.textinfo}>{item.content}</Text>
          </View>
          { 
            item.emr_share_status == 1 &&
            <View style={styles.doctorShare}>
              <TouchableOpacity style={styles.sharebtn}  onPress={() => this.onShare(index, item.dw_id, this.props.dataAuth.user_code, item.doctor_code)}>
                <Text style={styles.acceptShare}>{I18n.t('shareMedical')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.denybtn}  onPress={() => this.onDeny(index, item.dw_id, this.props.dataAuth.user_code, item.doctor_code)}>
                <Text style={styles.denyShare}>{I18n.t('deny')}</Text>
              </TouchableOpacity>
            </View>
          }
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
    const { isSharing, isCanceling, isGettingDataDoctor, isAccepting, isDenying } = this.props;
    return (
      <View style={styles.bodyContainer}>
        <View style={{paddingTop:16, marginLeft:15,marginRight:140}}>
          <CheckBox
            label={I18n.t('isShare' )}
            labelStyle={{color: '#fff'}}
            checkedImage={ CHECKED }
            uncheckedImage={ UNCHECKED }
            underlayColor={'transparent'}
            checked={this.state.checked}
            onChange = {() => this.setState({checked : !this.state.checked})}
          />
        </View>
        <FlatList
            keyExtractor={this._keyExtractor}
            data={this.state.checked ? this.filterDoctor(this.state.dataDoctor) : this.state.dataDoctor}
            renderItem={({item, index}) => 
              this.renderBody({item, index})}
          />
        <Loading isVisible={( isSharing || isCanceling || isAccepting || isDenying || isGettingDataDoctor )} />
      </View>
    );
  }
}

export default withConnect(ListFavoriteDoctor);

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