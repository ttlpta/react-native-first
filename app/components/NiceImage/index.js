/**
 * @providesModule TeleMedicine.Components.Base.NiceImage
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import {
  Platform, StyleSheet, View, ScrollView, Image, ActivityIndicator,
  TouchableHighlight, TouchableOpacity,
} from 'react-native';
import Display from 'react-native-display';

import * as app from 'app/constants/app';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';


/**
 * Used to display image with default source.
 * Usage:
 *    <NiceImage
 *       source={source}
 *       defaultSource={defaultSource}
 *       style={containerStyle}
 *       loader={loaderItem} -> may be <ActivityIndicator animated />
 *    />
 * 
 *  TODO:
 *    - Need increase performance by using cache
 */
export default class NiceImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sourceLoaded: false,
    };
  }

  static propTypes = {
    cacheOption: PropTypes.string,
    defaultSource: PropTypes.any,
    loader: PropTypes.any,
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    source: PropTypes.any,
    style: PropTypes.object,
  };

  static defaultProps = {
    cacheOption: 'only-if-cached',
  };

  setNativeProps(nativeProps) {
    // this._root.setNativeProps(nativeProps);
  }

  get useDefaultSource() {
    return this.props.defaultSource;
  }

  onLoad = (event = null) => {
    if (!this.state.sourceLoaded) {
      this.setState({ sourceLoaded: true });
      const func = this.props.onLoad;
      if (func) {
        func(event);
      }
    }
  }

  onError = (event) => {
    const func = this.props.onError;
    if (func) {
      func(event);
    }
  }

  renderImageDefault() {
    const { defaultSource, style } = this.props;
    if (Platform.OS === 'android') {
      return (
        <View>
          <Image source={defaultSource} style={style} />
          {this.renderLoader()}
          {this.renderImageRemote()}
        </View>
      );
    } else { // iOS and others
      return (
        <Image source={defaultSource} style={style}>
          {this.renderLoader()}
          {this.renderImageRemote()}
        </Image>
      );
    }
  }

  renderLoader() {
    const { loader } = this.props;
    if (loader) {
      return (
        <View style={styles.floatingContainer}>
          {loader}
        </View>
      );
    } else {
      return null;
    }
  }

  renderImageRemote() {
    const { source, style } = this.props;

    // TODO: Setting cache control
    // if (typeof source === 'object' && !('cache' in source)) {
    //   // TODO: This works on iOS only
    //   source.cache = this.props.cacheOption;
    // }

    // Image element
    const image = (
      <Image
        source={source}
        style={style}
        onError={this.onError}
        onLoad={this.onLoad}
      />
    );

    // Android issue: image-nested-image does not apply borderRadius
    // Workaround: wrap the image by a floating view.
    if (Platform.OS === 'android' && !this.state.sourceLoaded) {
      return (
        <View style={styles.floatingContainer}>
          {image}
        </View>
      );
    } else {
      return image;
    }
  }

  render() {
    if (this.useDefaultSource && !this.state.sourceLoaded) {
      return this.renderImageDefault();
    } else {
      return this.renderImageRemote();
    }
  }
}

const styles = {
  floatingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
};
