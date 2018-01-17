/**
 * @providesModule TeleMedicine.Components.Base.PhotosView
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import {
  Platform, StyleSheet, View, ScrollView, Image, ActivityIndicator, Text,
  TouchableHighlight, TouchableOpacity, Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';

import * as app from 'app/constants/app';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';

import NiceImage from 'app/components/NiceImage';

const { width } = Dimensions.get('window');

/**
 * Used as an image slider.
 * Usage:
 *    <PhotosView
 *      photos={photos}
 *      height={height}
 *      loadMinimal={true/false}
 *      loadMinimalSize={number}
 *      loop={true/false}
 *    />
 */
export default class PhotosView extends React.PureComponent {
  constructor(props) {
    super(props)
    const numPhotos = this.props.photos.length;
    this.state = {
      loadQueue: Array(numPhotos).fill(0),
    }
    this.loadHandle = this.loadHandle.bind(this);
  }

  static propTypes = {
    photos: PropTypes.array,
    loadMinimal: PropTypes.bool,
    loadMinimalSize: PropTypes.number,
    height: PropTypes.number,
    loop: PropTypes.bool,
    showsButtons: PropTypes.bool,
    loader: PropTypes.element,
  };

  static defaultProps = {
    height: 200,
    loadMinimal: true,
    loadMinimalSize: 0,
    loop: true,
    showsButtons: false,
    loader: <ActivityIndicator animated />,
  };

  setNativeProps(nativeProps) {
    // this._root.setNativeProps(nativeProps);
  }

  loadHandle(index) {
    const loaded = this.state.loadQueue[index];
    if (!loaded) {
      const updatedLoadQueue = this.state.loadQueue.slice(0);
      updatedLoadQueue[index] = 1;
      this.setState({ loadQueue: updatedLoadQueue });
    }
  }

  // renderItem(item, index) {
  //   const loaded = this.state.loadQueue[index];
  //   return (
  //     <View style={styles.slide} key={index}>
  //       <Image
  //         onLoad={this.loadHandle.bind(null, index)}
  //         style={styles.image}
  //         source={{ uri: item, cache: 'only-if-cached' }}
  //       />
  //       {this.renderLoader(index)}
  //     </View>
  //   );
  // }

  // renderLoader(index) {
  //   const loaded = this.state.loadQueue[index];
  //   if (!loaded) {
  //     return (
  //       <View style={styles.loadingView}>
  //         <Image style={styles.loadingImage} source={ICON_LOADING} />
  //       </View>
  //     );
  //   } else {
  //     return null;
  //   }
  // }

  renderItem(item, index) {
    return (
      <NiceImage
        key={index}
        onLoad={() => {
          this.loadHandle(index)
        }}
        style={styles.image}
        source={{ uri: item }}
        loader={this.props.loader}
      />
    );
  }

  render() {
    return (
      <View>
        <Swiper
          style={styles.wrapper}
          loadMinimal={this.props.loadMinimal}
          loadMinimalSize={this.props.loadMinimalSize}
          height={this.props.height}
          loop={this.props.loop}
          showsButtons={this.props.showsButtons}
        >
          {
            this.props.photos.map((item, i) => this.renderItem(item, i))
          }
        </Swiper>
      </View>
    )
  }
}

const styles = {
  wrapper: {
  },

  image: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'transparent',
    resizeMode: 'cover',
  },

  // slide: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   backgroundColor: 'transparent',
  // },

  // loadingView: {
  //   position: 'absolute',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   left: 0,
  //   right: 0,
  //   top: 0,
  //   bottom: 0,
  //   backgroundColor: 'rgba(0,0,0,.4)',
  // },

  // loadingImage: {
  //   width: 40,
  //   height: 40,
  // }
};
