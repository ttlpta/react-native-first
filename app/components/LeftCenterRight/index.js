/**
 * @providesModule TeleMedicine.Components.Base.LeftCenterRight
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet, View, ScrollView, Dimensions,
  TouchableHighlight, TouchableOpacity,
} from 'react-native';

import * as app from 'app/constants/app';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';


/**
 * A layout to display horizontally 3 items. The body (center) is
 * expanded by default.
 * Usage:
 *    <LeftCenterRight
 *       left={leftItem}
 *       body={bodyItem}
 *       right={rightItem}
 *       style={style}
 *       leftStyle={leftStyle}
 *       bodyStyle={bodyStyle}
 *       rightStyle={rightStyle} />
 */
export default class LeftCenterRight extends React.PureComponent {
  static propTypes = {
    body: PropTypes.element,
    bodyStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    left: PropTypes.element,
    leftStyle: PropTypes.object,
    right: PropTypes.element,
    rightStyle: PropTypes.object,
  };

  setNativeProps(nativeProps) {
    // this._root.setNativeProps(nativeProps);
  }

  renderLeft() {
    return this.props.left;
  }

  renderRight() {
    return this.props.right;
  }

  renderBody() {
    return this.props.body;
  }

  render() {
    return (
      <View style={{ ...styles.rootContainer, ...this.props.style }}>
        <View style={{ ...styles.leftContainer, ...this.props.leftStyle }}>
          {this.renderLeft()}
        </View>
        <View style={{ ...styles.bodyContainer, ...this.props.bodyStyle }}>
          {this.renderBody()}
        </View>
        <View style={{ ...styles.rightContainer, ...this.props.rightStyle }}>
          {this.renderRight()}
        </View>
      </View>
    );
  }
}

const styles = {
  rootContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 0,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftContainer: {
    flex: 0,
  },

  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  rightContainer: {
    flex: 0,
  },
};
