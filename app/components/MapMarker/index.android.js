import React from 'react';
import { Image, View , StyleSheet } from 'react-native';

import withConnect from './withConnect';

import { MARKER_LAYOUT, DR_AVA_DUMP, ICON_CLINIC_MAP } from '../../constants';
class MapMarker extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Image source={ (this.props.type == 'doctor') ?  DR_AVA_DUMP : ICON_CLINIC_MAP} style={styles.imageSub} />
    );
  }
}

const styles = StyleSheet.create({
  image : {
    width: 60,
    height: 52,
    justifyContent : 'center',
  },
  imageSub : {
    width: 30,
    height: 30,
    position: 'relative',
    top: -6,
    left: 5,
  },
});

export default withConnect(MapMarker);
