import React from 'react';
import { Image, View , StyleSheet, TouchableOpacity,Text, ScrollView } from 'react-native';
import { Left, Button } from 'native-base';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';

// import withConnect from './withConnect';
const ICON_FAV_ON = require('app/assets/images/icon_favorite_on.png');
const ICON_FAV_OFF = require('app/assets/images/icon_favorite_off.png');

class MapCallout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      liked : true,
    }
  }

  goToDetail = () => {
    const { navigation } = this.props;
    navigation.navigate('DetailDoctor', { checkoutModalVisible : true, });
  }

  unLike = () => {
    this.setState({...this.state, liked : !this.state.liked });
  }

  render() {
    return (
      <View >
        <View style={styles.bubble}>
          <View style={styles.bubbleTop}>
            <Image source={require('./../../assets/images/thumb.jpg')} style={styles.imageThumb} />
            <Left style={{ paddingLeft:10 }}>
              { 
                this.props.type == 'doctor' &&
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text note style={{color: '#fff', fontSize: 14, fontWeight : '200'}}>{'TS Bác sĩ chuyên khoa 1'}</Text>
                  <Text style={{color: '#FFD638', fontSize: 18, fontWeight : '500'}}>{'Trần Văn Chương'}</Text>
                </View>
              }
              {
                this.props.type == 'clinic' &&
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{color: '#FFD638', fontSize: 18, fontWeight : '500'}}>
                    {'Phòng khám Đa khoa Quốc tế Hồng Ngọc'}
                    </Text>
                </View>
              }
              {/* <TouchableOpacity onPress={() => this.unLike()} style={styles.imageHeartPosition}>
                <Image 
                  source={ (this.state.liked) ?  ICON_FAV_ON : ICON_FAV_OFF } 
                  style={styles.imageHeart}
                />
              </TouchableOpacity> */}
              <View style={{ marginTop: 5 }}>
                <Text note style={{ color: '#fff', fontSize: 14, fontWeight : '100' }}>
                  <Image source={require('./../../assets/images/Info_Icon.png')} style={styles.icon} />
                  {' Trưởng khoa phục hồi chức năng'}
                </Text>
                <Text note style={{ color: '#fff', fontSize: 14, fontWeight : '100' }}>
                  <Image source={require('./../../assets/images/Tag_Icon.png')} style={styles.icon} />
                  {I18n.t("MapCallout.from",{ locale: this.props.mylanguage })} <Text note style={{ fontWeight : 'bold', color: '#fff', fontSize: 18 }}>{'200, 000'}</Text> {' vnd'}
                </Text>
              </View>
            </Left>
          </View>
          { 
            this.props.type == 'doctor' &&
            <View style={styles.bubbleBottom}>
              <Text style={{ fontWeight: '200', fontSize: 15, color: '#fff', marginTop: 5 }}>{I18n.t("MapCallout.chooseDay",{ locale: this.props.mylanguage })} &#9654;</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1, marginTop: 4, flexDirection: 'row' }}>
                {/* <Button onPress={() => this.goToDetail()} light transparent style={{ paddingHorizontal: 0, paddingVertical: 0, borderColor:'#fff', borderWidth:1, marginLeft: 15 }}>
                  <Text style={{ fontWeight : '300', color: '#fff', fontSize: 21 }}>{'18:00'}</Text>
                </Button>
                <Button onPress={() => this.goToDetail()} light transparent style={{ paddingHorizontal: 0, paddingVertical: 0, borderColor:'#fff', borderWidth:1, marginLeft: 15 }}>
                  <Text style={{ padding: 0, fontWeight : '300', color: '#fff', fontSize: 21 }}>{'20:00'}</Text>
                </Button> */}
                <TouchableOpacity onPress={() => this.goToDetail()}>
                  <Text style={styles.button}>{'18:00'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goToDetail()}>
                  <Text style={styles.button}>{'20:00'}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          }          
        </View>
        {/* <View style={styles.arrowBorder} />
        <View style={styles.arrow} />   */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    fontWeight : '300', 
    color: '#fff', 
    fontSize: 21,
    borderColor:'#fff', 
    borderWidth:1, 
    marginLeft: 15,
    paddingHorizontal: 12, 
    paddingVertical: 5,
    borderRadius: 5

  },
  bubble: {
    backgroundColor: 'rgba(59, 175, 28, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 5,
    flex: 1,
    borderRadius: 5, 
  },
  bubbleTop: {
    flexDirection: 'row',
    flex: 1,
  },
  bubbleBottom: {
    flexDirection: 'row',
    marginTop: 5,
    flex: 1,
  },
  imageThumb: {
    borderColor: '#fff', 
    borderRadius: 5, 
    borderWidth: 1, 
    width: 100, 
    height: 100,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: 'rgba(59, 175, 28, 0.7)',
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: 'transparent',
    alignSelf: 'center',
    marginTop: -0.5,
  },
  imageHeart: {
    width: 25, 
    height: 25, 
  },
  imageHeartPosition: {
    position: 'absolute', 
    right: -15, 
    top: 2, 
  },
  icon: {
    width: 15, 
    height: 15, 
  },
  icon2: {
    width: 5, 
    height: 10, 
  },
});

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(MapCallout);