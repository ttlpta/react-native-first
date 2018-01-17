/**
 * @providesModule TeleMedicine.Components.Base.SearchBar
 */

/* eslint no-unused-vars: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet, View, TouchableHighlight, TouchableOpacity,
  Text, TextInput, Image,
} from 'react-native';

import * as app from 'app/constants/app';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';

const ICON_SEARCH = require('app/assets/images/icon_search.png');
const ICON_BG = require('app/assets/images/search_bg.png');


/**
 * Search bar item.
 */
export default class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text || '',
      icon: this.props.icon,
      onFocus: false,
    };
  }

  static propTypes = {
    containerStyle: PropTypes.object,
    focusContainerStyle: PropTypes.object,
    icon: PropTypes.any,
    iconBg: PropTypes.any,
    iconStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    noBg: PropTypes.bool,
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
    text: PropTypes.string,
  };

  static defaultProps = {
    noBg: true,
    placeholder: 'enter something',
  };

  /// Events ///

  onSearch = () => {
    const { text } = this.state;
    // if (this.props.onSearch && text) {
      this.props.onSearch(text);
    // }
  }

  onOpenFilter = () => {
    this.props.onOpenFilter();
  }

  onFocus = () => {
    this.setState({ onFocus: true });
  }

  onBlur = () => {
    this.setState({ onFocus: false });
  }

  /// Render ///

  renderInput() {
    return (
      <TextInput
        style={{ ...styles.inputText, ...this.props.inputStyle }}
        placeholder={this.props.placeholder}
        placeholderTextColor="rgba(62, 199, 25, 0.5)"
        selectionColor="white"
        underlineColorAndroid="transparent"
        autoCorrect={false}
        onSubmitEditing={this.onSearch}
        onChangeText={newText => this.setState({ text: newText })}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
      />
    );
  }

  renderIcon() {
    return (
      <TouchableOpacity onPress={this.onOpenFilter}>
        <Image
          style={{ ...styles.searchIcon, ...this.props.iconStyle }}
          source={this.state.icon || ICON_SEARCH}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const iconBg = this.state.iconBg || ICON_BG;
    const style = this.state.onFocus ?
      { ...styles.focusRootContainer, ...this.props.focusContainerStyle } :
      { ...styles.rootContainer, ...this.props.containerStyle };

    if (!this.props.noBg && iconBg) {
      return (
        <Image style={style} source={iconBg}>
          {this.renderInput()}
          {this.renderIcon()}
        </Image>
      );
    } else {
      return (
        <View style={style}>
          {this.renderInput()}
          {this.renderIcon()}
        </View>
      );
    }
  }
}

const styles = {
  rootContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 38,
    borderRadius: 19,
    borderColor: 'rgba(45, 152, 29, 1)',
    borderWidth: 1,
  },

  focusRootContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 38,
    borderRadius: 19,
    borderColor: 'rgba(45, 152, 29, 1)',
    borderWidth: 1,
    // shadow
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 1,
    shadowColor: 'rgb(0, 255, 0)',
  },

  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    // opacity: 0.5,
  },

  inputText: {
    flex: 1,
    color: 'rgba(230, 230, 230, 0.8)',
    marginLeft: 10,
    paddingVertical: 0, // For Android
    fontSize: 18,
  },

  searchIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 10,
  },
};
