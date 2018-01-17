import PropTypes from 'prop-types';
import React from 'react';

import {
  ListView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from 'react-native';

import shallowequal from 'shallowequal';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import md5 from 'md5';
import LoadEarlier from './LoadEarlier';
import Message from './Message';

export default class MessageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    this.renderScrollComponent = this.renderScrollComponent.bind(this);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r1.hash !== r2.hash;
      }
    });

    const messagesData = this.prepareMessages(props.messages);
    this.state = {
      dataSource: dataSource.cloneWithRows(messagesData.blob, messagesData.keys)
    };
  }

  prepareMessages(messages) {
    return {
      keys: messages.map(m => m._id),
      blob: messages.reduce((o, m, i) => {
        const previousMessage = messages[i + 1] || {};
        const nextMessage = messages[i - 1] || {};
        // add next and previous messages to hash to ensure updates
        const toHash = JSON.stringify(m) + previousMessage._id + nextMessage._id;
        o[m._id] = {
          ...m,
          previousMessage,
          nextMessage,
          hash: md5(toHash)
        };
        return o;
      }, {})
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props, nextProps)) {
      return true;
    }
    if (!shallowequal(this.state, nextState)) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages === nextProps.messages) {
      return;
    }
    const messagesData = this.prepareMessages(nextProps.messages);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(messagesData.blob, messagesData.keys)
    });
  }

  renderFooter() {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props,
      };
      return this.props.renderFooter(footerProps);
    }
    return null;
  }

  renderLoadEarlier() {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      };
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps);
      }
      return (
        <LoadEarlier {...loadEarlierProps}/>
      );
    }
    return null;
  }

  scrollTo(options) {
    this._invertibleScrollViewRef.scrollTo(options);
  }

  renderRow(message, sectionId, rowId) {
    if (!message._id && message._id !== 0) {
      console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(message));
    }
    if (!message.user) {
      console.warn('GiftedChat: `user` is missing for message', JSON.stringify(message));
      message.user = {};
    }

    const messageProps = {
      ...this.props,
      key: message._id,
      currentMessage: message,
      previousMessage: message.previousMessage,
      nextMessage: message.nextMessage,
      position: message.user._id === this.props.user._id ? 'right' : 'left',
    };

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }
    return <Message {...messageProps}/>;
  }

  renderScrollComponent(props) {
    const invertibleScrollViewProps = this.props.invertibleScrollViewProps;
    return (
      <InvertibleScrollView
        {...props}
        {...invertibleScrollViewProps}
        ref={component => this._invertibleScrollViewRef = component}
      />
    );
  }

  onGoBack = () => {
    this.props.onGoBack();
  }

  render() {
    return (
      <View ref="container" style={{ flex:1 }}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent
        />
        <View style={styles.headerContainer}>
          <View style={styles.wrapButton}>
            <TouchableOpacity onPress={this.onGoBack}>
              <Image style={styles.icon}  source={require('../../../assets/images/back1.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.wrapTextName}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.textName}>Tiến sĩ, Bác sĩ cao cấp chuyên khoa I</Text>
              <Text style={styles.textCall}>Đang gọi</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text style={styles.textName2}>Trần Văn Chương</Text>
              <Text style={styles.textCall2}>00:26</Text>
            </View>

          </View>
        </View>  
        
        <ListView
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          initialListSize={20}
          pageSize={20}

          {...this.props.listViewProps}

          dataSource={this.state.dataSource}

          renderRow={this.renderRow}
          renderHeader={this.renderFooter}
          renderFooter={this.renderLoadEarlier}
          renderScrollComponent={this.renderScrollComponent}
        />
      </View>
    );
  }
}

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  onLoadEarlier: () => {
  },
};

MessageContainer.propTypes = {
  messages: PropTypes.array,
  user: PropTypes.object,
  renderFooter: PropTypes.func,
  renderMessage: PropTypes.func,
  onLoadEarlier: PropTypes.func,
  listViewProps: PropTypes.object,
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 15,
    // marginLeft: 5,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'red',
    height:50,
    flexDirection: 'row',
    borderBottomColor: '#40B81F',
    borderBottomWidth: 1,
  },
  wrapButton: {
    // backgroundColor: 'green',
    height:50,
    justifyContent: 'center',
  },
  wrapTextName: {
    // backgroundColor: 'blue',
    height:50,
  },
  textCall: {
    paddingLeft:20,
    color: '#4F4F4F',
  },
  textName: {
    paddingLeft:10,
    color: '#4F4F4F',
  },
  textCall2: {
    paddingLeft:Platform.select({
      ios: 105,
      android: 95,
    }),
    color: '#4F4F4F',
    fontSize: 20,
  },
  textName2: {
    paddingLeft:10,
    color: '#40B81F',
    fontSize:20,
    fontFamily: 'Roboto',
  },
  icon: {
    width: 11,
    height:22,
    marginLeft:20,
    // position: 'absolute',
  },
});
