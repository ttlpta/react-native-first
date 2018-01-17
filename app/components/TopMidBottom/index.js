/**
 * @providesModule TeleMedicine.Components.Base.TopMidBottom
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet, View, ScrollView, TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import * as app from 'app/constants/app';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';


/**
 * A layout to display vertically 3 items. The body (middle) is
 * expanded by default.
 * Usage:
 *    <TopMidBottom
 *       top={topItem}
 *       body={bodyItem}
 *       bottom={bottomItem}
 *       style={style}
 *       topStyle={topStyle}
 *       bodyStyle={bodyStyle}
 *       bottomStyle={bottomStyle} />
 */
export default class TopMidBottom extends React.PureComponent {
  static propTypes = {
    body: PropTypes.element,
    bodyStyle: PropTypes.object,
    bottom: PropTypes.element,
    bottomStyle: PropTypes.object,
    style: PropTypes.object,
    top: PropTypes.element,
    topStyle: PropTypes.object,
  };

  setNativeProps(nativeProps) {
    // this._root.setNativeProps(nativeProps);
  }

  renderTop() {
    return this.props.top;
  }

  renderBottom() {
    return this.props.bottom;
  }

  renderBody() {
    return this.props.body;
  }

  render() {
    return (
      <View style={{ ...styles.rootContainer, ...this.props.containerStyle }}>
        <View style={{ ...styles.topContainer, ...this.props.topStyle }}>
          {this.renderTop()}
        </View>
        <View style={{ ...styles.bodyContainer, ...this.props.bodyStyle }}>
          {this.renderBody()}
        </View>
        <View style={{ ...styles.bottomContainer, ...this.props.bottomStyle }}>
          {this.renderBottom()}
        </View>
      </View>
    );
  }
}

const styles = {
  rootContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  topContainer: {
    flex: 0,
  },

  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  bottomContainer: {
    flex: 0,
  },
};
