import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  View,
  ViewPropTypes,
  Text,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Composer from './Composer';
import Send from './Send';
import Actions from './Actions';


export default class InputToolbar extends React.Component {
  renderActions() {
    if (this.props.renderActions) {
      return this.props.renderActions(this.props);
    } else if (this.props.onPressActionButton) {
      return <Actions {...this.props} />;
    }
    return null;
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    return <Send {...this.props}/>;
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }

    return (
      <Composer
        {...this.props}
      />
    );
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      // <View style={[styles.container, this.props.containerStyle]}>
      //   <View style={[styles.primary, this.props.primaryStyle]}>
      //     {this.renderActions()}
      //     {this.renderComposer()} 
      //     {this.renderSend()}
      //   </View>
      //   {this.renderAccessory()}
      // </View>
      <View style={styles.footer}> 
        <LinearGradient colors={['#52C234', '#6EDE50']} style={styles.linearGradient}>
          <View style={[styles.primary, this.props.primaryStyle]}>
            {this.renderActions()}
            {this.renderComposer()} 
            {/* {this.renderSend()}  */}
            <View style={styles.icon}>
              {this.renderSend()}
            </View>
          </View>
          {this.renderAccessory()}
            
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
    backgroundColor: 'green',
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
  linearGradient: {
    // flex: 1,
    // paddingLeft: 15,
    // paddingRight: 15,
    // borderRadius: 50,
  },
  footer: {
    height: 30,
  },
  icon: {
    position: 'absolute',
    top:0,
    right:10,

  },
});

InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
};

InputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  primaryStyle: ViewPropTypes.style,
  accessoryStyle: ViewPropTypes.style,
};
