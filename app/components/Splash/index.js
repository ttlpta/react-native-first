import React, { Component, PureComponent } from 'react';
import { StyleSheet , View, Dimensions, Image } from 'react-native';

import Spinner from 'react-native-spinkit';
import LinearGradient from 'react-native-linear-gradient';

export default class Splash extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LinearGradient
        colors={['#0B2501', '#52C234']}
        style={styles.container}

      >
        <Spinner style={styles.spinner} size={100} type={'Bounce'} color={'#fff'} />
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#52af39',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
  spinner: {
    marginBottom: 50
  },
})
