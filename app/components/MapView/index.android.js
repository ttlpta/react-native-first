import React from 'react';
import _ from 'lodash';
import { StyleSheet, Dimensions, Image, View, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Text } from 'native-base';
import MapView from 'react-native-maps';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import MapCallout from './../MapCallout';
import I18n from 'react-native-i18n';
import MapMarker from './../MapMarker';
import SearchBarGreen from './../SearchBarGreen';
import withConnect from './withConnect';
import AdvanceSearchModal from 'app/components/AdvanceSearch';
import Loading from 'app/components/Loading';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

class Map extends React.PureComponent {
  static navigationOptions = {
    tabBarVisible: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      center: {},
      region: {
        latitude: 20.9805524,
        longitude: 105.7871778,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0922 * ASPECT_RATIO,
      },
      markers : this.props.dumpData,
      circle : {
        center: {
          latitude: 20.9801709,
          longitude: 105.7883124,
        },
        radius: 700,
        radius2: 200,
        radius3: 100,
      },
      pressedMarker : false,
      showCurrentUserPosition : false,
      openFilterModal : false,
      loadingVisible : true,
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
          this.setState({...this.state,
            center: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            alloweKnowUserLocation: true,
          });
        }, error => {
          if(error.message) {
            this.setState({ alloweKnowUserLocation: false })
          }
        },
        { enableHighAccuracy: false },
      );

    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
      ok: "YES",
      cancel: "NO"
    }).then(function(success) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.setState({...this.state,
            center: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            alloweKnowUserLocation: true,
          });
        }, error => {
          if(error.message) {
            this.setState({ alloweKnowUserLocation: false })
          }
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000  },
      );
      }.bind(this)
    ).catch((error) => {
      this.setState({ alloweKnowUserLocation: false })
      console.log(error.message);
    });
  }
  
  onRegionChange = region => {
    this.setState({ region });
  }

  onMapReady = () => {
    this.setState({ ...this.state, loadingVisible : false });
  }

  showCallout = () => {
    if(this.state.pressedMarker) {
      this.marker.showCallout();
      this.setState({ ...this.state, pressedMarker: false});
    }
  }
  
  showCurrentUserPosition = () => {
    if(this.state.alloweKnowUserLocation){
      this.map.animateToCoordinate(this.state.center, 300);
    } 
    // this.setState({...this.state, showCurrentUserPosition : !this.state.showCurrentUserPosition});
  }

  renderMenu() {
    return (
      <TouchableOpacity>
        <Image style={styles.menuIcon} source={ICON_MENU} />
      </TouchableOpacity>
    );
  }

  onOpenFilter = () => {
    this.setState({...this.state, openFilterModal : true});
  }

  onCloseFilter = () => {
    this.setState({...this.state, openFilterModal : false});
  }

  renderAdvanceSearchModal() {
    return (
      <AdvanceSearchModal visible={ this.state.openFilterModal } onCloseFilter={this.onCloseFilter}/>
    );
  }

  _onCalloutPress = (type) => {
    const screen = (type === 'doctor') ? 'DetailDoctor' : 'DetailClinic';
    this.props.navigation.navigate(screen, { checkoutModalVisible : false });
  }

  render() {
    const { onSearch, dumpData } = this.props;
        
    const region = { 
      latitude: dumpData[0].latitude, 
      longitude: dumpData[0].longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0922 * ASPECT_RATIO
    };
    
    return (
      <ScrollView style={{flex: 1}}>
        {this.renderAdvanceSearchModal()}
        <MapView
          region={region}
          style={styles.map}
          ref={ref => { this.map = ref; }}
          showsUserLocation
          userLocationAnnotationTitle={'my location'}
          onRegionChangeComplete={ () => this.showCallout()}
          onMapReady={ () => this.onMapReady() }
          showsMyLocationButton={false}
          showsCompass={false}
        >
          {this.props.dumpData.map((marker, key) => (
            <MapView.Marker
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              key={key}
              ref={ref => { this.marker = ref; }}
              pinColor={ (marker.type == 'doctor') ? 'red' : 'green' }
            >
              
              <MapView.Callout 
                tooltip 
                style={{width: Dimensions.get('window').width - 16 * 2 }}
                onPress={ () => this._onCalloutPress(marker.type) }
              >
                 <MapCallout type={marker.type} navigation={this.props.navigation}/> 
              </MapView.Callout>
            </MapView.Marker>
          ))}
        </MapView>
        <SearchBarGreen navigation={this.props.navigation} onOpenFilter={this.onOpenFilter} onSearch={onSearch}/>
        <TouchableOpacity style={styles.positionPoint} onPress={() => this.showCurrentUserPosition()}>
          <Image source={require('./../../assets/images/point.png')} style={styles.imgPoint} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.positionList} onPress={() => this.props.navigation.navigate('ListViewSearch')}>
          <Image source={require('./../../assets/images/Group.png')} style={styles.imgList} />
          <Text style={{fontSize: 10,fontWeight: 'bold', color: 'rgba(44, 178, 9, 1.0)', backgroundColor: 'rgba(0, 0, 0, 0)',}}>
            {I18n.t('lvSearchScreen.list')}
          </Text>
        </TouchableOpacity>
        <Loading isVisible={ this.state.loadingVisible } />
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  mapText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(44, 178, 9, 1.0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  menuIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  map: {
    width: Dimensions.get('window').width, 
    height: Dimensions.get('window').height,
  },
  positionPoint : {
    position: 'absolute',
    top: Dimensions.get('window').height - 140,
    right: 8,
  },
  imgPoint: {
    width: 50, 
    height: 50,
  },
  positionList : {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: Dimensions.get('window').height - 85,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    // shadow
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.6,
    shadowColor: 'rgb(0, 0, 0)',
  },
  imgList: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});

export default withConnect(Map);
