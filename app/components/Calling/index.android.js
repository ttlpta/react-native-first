import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Image,
  ScrollView,
  Modal
} from 'react-native';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from 'react-native-twilio-video-webrtc';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';

import ShadowView from 'react-native-shadow-view';
import NiceImage from 'app/components/NiceImage';

import { 
  ICON_MICRO, ICON_GO_TO_MESSAGER, ICON_FLIP_CAMERA, 
  ICON_DECLINE, BG_IMAGE, ICON_DOCTOR_DEFAULT, 
  ICON_SMALL_PHONE, ICON_REAL_DOCTOR_DEFAULT,
  ICON_BREAK_PHONE, ICON_MUTE_MICRO, ICON_STAR_ACTIVE, ICON_STAR_INACTIVE, ICON_LOGOUT
} from 'app/constants';

import LinearGradient from 'react-native-linear-gradient';

import withConnect from './withConnect';

const styles = StyleSheet.create({
  disconnectedContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  callContainer: {
    // flex: 1,
    // position: "absolute",
    // bottom: 0,
    // top: 0,
    // left: 0,
    // right: 0
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 40
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: 'center',
    backgroundColor: 'white'
  },
  button: {
    marginTop: 100
  },
  localVideo: {
    position: "absolute",
    right: 0,
    bottom: 0, 
    left: 0,
    top: 0,
    backgroundColor: 'red',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  remoteGrid: {
    flexDirection: "row",
    position: "absolute",
    right: 0,
    bottom: 0, 
    left: 0,
    top: 0,
    backgroundColor: 'transparent'
  },
  remoteVideo: {
    marginHorizontal : 10,
    marginVertical : 20,
    width: 150,
    height: 220,
    top: 100,
    // backgroundColor: 'yellow'
  },
  optionsContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    // backgroundColor: 'yellow',
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 30, 
    paddingRight: 10,
  },
  optionButton: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 30,
    marginTop: 10,
  },
  optionButtonIcon : {
    width: 60,
    height: 60,
  },
  optionButtonBg : {
    width: 40,
    height: 40,
    marginLeft: 6,
    marginRight: 6,
    borderRadius: 100 / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.21)',
    justifyContent: 'center',
    alignItems: "center"
  },
  txtNameDoctor : {
    color: '#FFD638',
    fontSize: 18,
  },
  txtTime : {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 20,
  },
  containerHeader : {
    flexDirection : 'row', 
    backgroundColor: 'transparent', 
    paddingHorizontal : 20, 
    marginTop: 30,
    position: 'absolute',
    top: 30,
    left: 0,
    zIndex: 999999
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
  avatarImage: {
    width: 176,
    height: 176,
    borderRadius: 176 / 2,
    resizeMode: 'cover',
  },
  content: {
    flex: 1
  },
  profile : {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flex: 1
  },
  jobTitle: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center'
  },
  name : {
    fontSize: 25,
    color: '#F2C94C',
    textAlign: 'center',
    marginTop: 10
  },
  avatar : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  action : {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  btnFinishText : {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 20
  },
  linearGradient :{
    width: Dimensions.get('window').width - 50 ,
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: (Dimensions.get('window').width - 60) / 2,
    overflow: 'hidden'
  },
  btnConnect : {
    borderRadius: (Dimensions.get('window').width - 60) / 2,
    borderWidth: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  info : {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 16,
    marginTop: 6
  },
  buttonBack : {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row'
  },
  buttonBackTxt : {
    color: '#fff',
    backgroundColor: 'transparent',
    fontSize: 20,
    paddingLeft: 5
  },
  loading : {
    backgroundColor: 'transparent',
    color: '#fff',
    marginTop: 20
  },
  modalFavouriteMask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerModal: {
    paddingTop: 30,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width - 45,
    height: Dimensions.get('window').height - 160,
  },
  bgModal: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width - 45,
    height: Dimensions.get('window').height - 160,
  },
  containerModalHeader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerModalStar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'center'
  },
  starImage: {
    height: 50,
    width: 50,
  },
  sendButton: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // backgroundColor: '#FFD638',
    // backgroundColor: 'transparent',
    marginBottom: 10,
    marginTop: 50,
    paddingTop: 5
  },
  sendButtonTxt: {
    color: '#4EBA31',
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: 'transparent'
  },
  laterButtonTxt: {
    color: '#828282',
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: 'transparent'
  },
  redLabel: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 21,
    paddingBottom: 10,
  },
  guide: {
    fontSize: 15,
    fontWeight: '100',
    paddingBottom: 18,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    flex: 1,
    padding: 5,
    fontSize: 18
  }
});

const stylesObj = {
  avatarContainer: {
    width: 180,
    height: 180,
    borderWidth: 2,
    borderRadius: 180 / 2,
    borderColor: 'rgb(255, 255, 255)',
    // shadow
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    shadowOpacity: 0.7,
    shadowColor: 'rgb(0, 255, 0)',
  },
  avatarImage: {
    width: 176,
    height: 176,
    borderRadius: 176 / 2,
    resizeMode: 'cover',
  },
}

class Calling extends Component {
  static navigationOptions = {
    header: null,
  }
  
  state = {
    isAudioEnabled: true,
    isVideoEnabled: true,
    status: 'disconnected',
    participants: new Map(),
    videoTracks: new Map(),
    mute: false,
    favouriteModalVisible: false,
    activeStar: [true, true, true, true, true],
    roomName: 'Udr room',
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.accessToken && this.props.accessToken !== nextProps.accessToken) {
      const accessToken = nextProps.accessToken;
      this.refs.twilioVideo.connect({ roomName: this.state.roomName, accessToken });
    }
  }

  _onVideoConnectButtonPress = () => {
    const { getAccessToken } = this.props;
    
    this.setState({status: 'connecting'});
    getAccessToken();
  }

  _onRoomDidConnect = () => {
    this.setState({status: 'connected'})
  }

  _onRoomDidDisconnect = ({roomName, error}) => {
    console.log("ERROR: ", error)

    this.setState({status: 'disconnected'})
  }

  _onFlipButtonPress = () => {
    this.refs.twilioVideo.flipCamera()
  }

  _onRoomDidFailToConnect = (error) => {
    console.log("ERROR: ", error);

    this.dropdown.alertWithType('error', 'Kết nối thất bại' , 'Xin hãy thử lại');
    this.setState({status: 'disconnected'})
  }

  _onEndButtonPress = () => {
    this.refs.twilioVideo.disconnect();
    this.setState({...this.state, status: 'disconnected', favouriteModalVisible : true})
  }

  _goBack = () => {
    this.props.navigation.goBack();
  }

  _onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log("onParticipantAddedVideoTrack: ", participant, track)

    this.setState({ videoTracks: [ ...this.state.videoTracks, { ...participant, ...track }] });
    // this.setState({videoTracks: { ...this.state.videoTracks, [track.trackId]: { ...participant, ...track }}})
  }

  _onParticipantRemovedVideoTrack = ({participant, track}) => {
    console.log("onParticipantRemovedVideoTrack: ", participant, track)

    const videoTracks = this.state.videoTracks
    videoTracks.delete(track.trackId)

    this.setState({videoTracks: { ...videoTracks }})
  }

  _onVideoConnectFailure = (response) => {
    this.dropdown.alertWithType('error', 'Kết nối thất bại' , 'Connect failure: ' + JSON.stringify(response));
  };

  _onSendVoting = () => {
    this.setState({...this.state, favouriteModalVisible : false});
    this.props.navigation.goBack();
  }

  changeActiveStar = (num) => {
    const actives = _.range(num).map(() => true);
    const inactives = _.range(5-num).map(() => false);
    const activeStar = [...actives, ...inactives];

    this.setState({...this.state, activeStar});
  }

  _onRoomParticipantDidDisconnect = () => {
    console.log("onRoomParticipantDidDisconnect");
    this.refs.twilioVideo.disconnect()
    this.setState({...this.state, favouriteModalVisible : true, status : 'disconnected'});
  }

  renderFavouriteModal() {
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.state.favouriteModalVisible}
      >
        <TouchableHighlight onPress={() => false} style={styles.modalFavouriteMask}>
          <TouchableOpacity activeOpacity={1} onPress={() => false} style={styles.containerModal}>
            <Image style={styles.bgModal} source={require('./../../assets/images/bg-modal-fauvorite.png')} />
            <View style={styles.containerModalStar}>
              {
                this.state.activeStar.map((activeStarBoolean, index) => {
                  return (
                    <TouchableOpacity 
                      key={'activeStar'+index}
                      style={{ paddingHorizontal: 3 }}
                      onPress={ () => this.changeActiveStar(index + 1) }
                    >
                      <Image style={styles.starImage} source={(activeStarBoolean) ? ICON_STAR_ACTIVE : ICON_STAR_INACTIVE } />
                    </TouchableOpacity>
                  )
                })
              }
              {/* <TouchableOpacity style={styles.closeBtn} onPress={() => this.closeFavourireModal()}>
                <Image style={styles.closeImage} source={require('./../../assets/images/close.png')} />
              </TouchableOpacity> */}
            </View>
            <View style={styles.containerModalHeader}>
              <Text style={styles.redLabel}>{I18n.t('DetailDoctor.rank' )}</Text>
              <Text style={styles.guide}>{I18n.t('DetailDoctor.touchStar' )}</Text>
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder={I18n.t('DetailDoctor.phComment' )}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              textAlignVertical={'top'}
              multiline
              autoFocus
              onSubmitEditing={()=>console.log('Thanh cong')}
            />
            {/* <LinearGradient colors={['#FFD638', '#fffff']} style={styles.sendButton} >
               <TouchableHighlight style={styles.sendButton}>
                <Text style={styles.sendButtonTxt}>GỬI</Text>
              </TouchableHighlight> 
            </LinearGradient> */}
            <LinearGradient
              colors={['#ffffff', '#FBEBAF',]}
              style={styles.sendButton}
            >
              <TouchableOpacity 
                style={{ flex : 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                onPress={() => this._onCancelVoting()}
              >
                <Text style={styles.laterButtonTxt}>
                  ĐỂ LẦN SAU
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flex : 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                onPress={() => this._onSendVoting()}
              >
                <Text style={styles.sendButtonTxt}>
                  {I18n.t('DetailDoctor.send' )}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </TouchableHighlight>
      </Modal>
    );
  }

  render() {
    return (
        <KeyboardAwareScrollView style={styles.container}>
        {
          ( this.state.status == 'disconnected' || this.state.status == 'connecting' ) &&
          <View style={styles.disconnectedContainer}>
            <Image
              source={BG_IMAGE}
              style={styles.rootBgImage}
            />
            <View style={styles.content}>
              <View style={styles.profile}>
                <Text style={styles.jobTitle}>Bác sĩ chuyên khoa II</Text>
                <Text style={styles.name}>Nguyễn Thị Thuỳ Dương</Text>
              </View>
              <View style={styles.avatar}>
                <ShadowView style={stylesObj.avatarContainer}>
                  <NiceImage
                    style={stylesObj.avatarImage}
                    source={ICON_REAL_DOCTOR_DEFAULT}
                  />
                </ShadowView>
                <Text style={styles.loading}>{ this.state.status === 'connecting' && 'Đang kết nối....' }</Text>
              </View>
              <View style={styles.action}>
                <TouchableOpacity style={styles.btnConnect} 
                  disabled={ this.props.isGettingToken || this.state.status == 'connecting' } 
                  onPress={this._onVideoConnectButtonPress}>
                  <LinearGradient colors={['#FBC700', '#EAA30A']} style={styles.linearGradient}>
                    <Text style={styles.btnFinishText}>
                      <Image source={ICON_SMALL_PHONE} style={{width: 20, height: 20, position:'relative', top: 6, left: -5}}/>
                      {I18n.t('joinTheMeeting')}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.info}>{I18n.t('maximumIs')} 1h {I18n.t('andWillBeSave')}</Text>
                <TouchableOpacity style={styles.buttonBack} onPress={this._goBack}>
                  <Image source={ICON_BREAK_PHONE} style={{width: 20, height: 20}} />
                  <Text style={styles.buttonBackTxt}>{I18n.t('back')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }

        {
          this.state.status === 'connected' &&
            <View style={styles.callContainer}>
              <TwilioVideoParticipantView style={styles.localVideo} />
              <View style={styles.containerHeader}>
                <View>
                  <Text style={styles.txtNameDoctor}>BS. Nguyễn Thị Thuỳ Dương</Text>
                  <Text style={styles.txtTime}>00:26</Text>
                </View>
                <TouchableOpacity
                  style={styles.optionButtonBg}
                  onPress={this._onFlipButtonPress}>
                  <Image style={styles.optionButtonIcon} style={{ width: 20, height: 15 }} source={ ICON_FLIP_CAMERA } />
                </TouchableOpacity>
              </View>
              {
                this.state.status === 'connected' &&
                <View style={styles.remoteGrid}>
                  <TwilioVideoLocalView style={styles.remoteVideo} /> 
                </View>
              }
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={this._onGotoMessageButtonPress}>
                  <Image style={styles.optionButtonIcon} source={ ICON_GO_TO_MESSAGER } />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={this._onEndButtonPress}>
                  <Image style={styles.optionButtonIcon} source={ ICON_DECLINE } />
                </TouchableOpacity>
              </View>
            </View>
        }
        
        {this.renderFavouriteModal()}

        <TwilioVideo
          ref="twilioVideo"
          onRoomDidConnect={ this._onRoomDidConnect }
          onRoomDidDisconnect={ this._onRoomDidDisconnect }
          onRoomDidFailToConnect= { this._onRoomDidFailToConnect }
          onRoomParticipantDidDisconnect= { this._onRoomParticipantDidDisconnect }
        />   
        <DropdownAlert
          ref={(ref) => this.dropdown = ref} />
      </KeyboardAwareScrollView>
    );
  }
}

export default withConnect(Calling);