/**
 * @providesModule TeleMedicine.Components.Base.DescView
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet, View, ScrollView, Image, ActivityIndicator, Text,
  TouchableHighlight, TouchableOpacity,
} from 'react-native';

import * as app from 'app/constants/app';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';

import TextReadMore from 'app/components/TextReadMore';


/**
 * Used to display description for a thing.
 * Usage:
 *    <DescView>
 *      child_text
 *    </DescView>
 */
export default class DescView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
    this._readMoreText = null;
  }

  static propTypes = {
    numberOfLines: PropTypes.number,
    style: PropTypes.object,
    textAlign: PropTypes.string,
  };

  static defaultProps = {
    numberOfLines: 0,
    textAlign: 'left',
  };

  setNativeProps(nativeProps) {
    // this._root.setNativeProps(nativeProps);
  }

  toggleShowMore = () => {
    this._readMoreText.toggleReadMore();
  }

  toggleShowLess = () => {
    this._readMoreText.toggleReadLess();
  }

  handleTextReady = () => {
    // ...
  }

  /// Render ///

  renderTruncatedFooter = (handlePress) => {
    const { showMoreItem } = this.props;

    return (
      <TouchableOpacity onPress={handlePress}>
        {showMoreItem}
      </TouchableOpacity>
    );
  }

  renderRevealedFooter = (handlePress) => {
    const { showLessItem } = this.props;

    return (
      <TouchableOpacity onPress={handlePress}>
        {showLessItem}
      </TouchableOpacity>
    );
  }

  render() {
    const { children, numberOfLines, textAlign } = this.props;
    return (
      <TextReadMore
        ref={item => this._readMoreText = item}
        style={{ ...styles.rootContainer, ...this.props.style }}
        textAlign={textAlign}
        numberOfLines={numberOfLines}
        renderTruncatedFooter={this.renderTruncatedFooter}
        renderRevealedFooter={this.renderRevealedFooter}
        onReady={this.handleTextReady}>
        {children}
      </TextReadMore>
    );
  }
}

const styles = {
  rootContainer: {
  },
};
