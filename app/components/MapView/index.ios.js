import React from 'react';
import { StyleSheet, Dimensions, Image, View, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Text } from 'native-base';
import MapView from 'react-native-maps';

import MapCallout from 'app/components/MapCallout';
import MapMarker from 'app/components/MapMarker';
import SearchBarGreen from 'app/components/SearchBarGreen';
import AdvanceSearchModal from 'app/components/AdvanceSearch';
import Loading from 'app/components/Loading';

import withConnect from './withConnect';

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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({...this.state,
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          alloweKnowUserLocation: true,
        });
      },
      (error) => {
        if(error.message) {
          this.setState({ alloweKnowUserLocation: false })
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  onMapReady = () => {
    this.setState({ ...this.state, loadingVisible : false });
  }

  showCurrentUserPosition = () => {
    if(this.state.alloweKnowUserLocation)
      this.map.animateToCoordinate(this.state.center, 300);
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
          onMapReady={ () => this.onMapReady() }
          showsMyLocationButton={false}
          showsCompass={false}
        >
          {this.props.dumpData.map((marker, key) => (
            <MapView.Marker
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              key={key}
              ref={ref => { this.marker = ref; }}
            >
              
              <MapMarker type={marker.type}/>
              <MapView.Callout tooltip style={{width: Dimensions.get('window').width - 16 * 2 }}>
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
          <Image source={require('./../../assets/images/list.png')} style={styles.imgList} />
        </TouchableOpacity>
        <Loading isVisible={ this.state.loadingVisible } />
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
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
    top: Dimensions.get('window').height - 90,
    right: 4,
  },
  imgList: {
    width: 60, 
    height: 60,
  },
});

export default withConnect(Map);
