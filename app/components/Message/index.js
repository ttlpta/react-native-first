import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import _ from 'lodash';

import Loading from 'app/components/Loading';
import Backend from './Backend';

import { GiftedChat, Bubble } from './src';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import FirebaseClient from './FirebaseConfig';


export default class Example extends React.Component {
  static navigationOptions = {
    header: null,
  } 

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: false,
      typingText: null,
      isLoadingEarlier: false,
      isVisible : false,
    };

    this.onSend = this.onSend.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    // this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

  componentDidMount() {
    Backend.loadMessages((message) => {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, message),
        };
      });
    });
  }

  componentWillUnmount() {
    Backend.closeChat();
  }

  onSend = async (message = []) => {
    const msgContainImage = _.head(message);
    let uploadBlob = null;
    let firebaseImageUrl = null;

    if (msgContainImage.image) {
      const Blob = RNFetchBlob.polyfill.Blob;
      const fs = RNFetchBlob.fs;
  
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
      window.Blob = Blob;
  
      const dateNow = Date.now();
      const imageRef = FirebaseClient.storage().ref('images')
        .child(`image_${dateNow}.png`);

      const mime = 'application/octet-stream';
      const imageBase64 = await fs.readFile(msgContainImage.image, 'base64');
      const blob = await Blob.build(imageBase64, { type: `${mime};base64` });
      uploadBlob = blob;
      this.setState({ isVisible : true });
      await imageRef.put(blob, { contentType: 'image/png' });
      uploadBlob.close();
      firebaseImageUrl = await imageRef.getDownloadURL();
      this.setState({ isVisible : false });
      
      message = _.map(message, item => {
        return { ...item, image : firebaseImageUrl }
      });
    }  
    
    console.log(message);
    Backend.sendMessage(message);
  }

  renderCustomActions(props) {
    return (
      <CustomActions
        {...props}
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  renderFooter() {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  onGoBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onGoBack={this.onGoBack}
          onSend={this.onSend}
          renderActions={this.renderCustomActions}
          renderBubble={this.renderBubble}
          renderCustomView={this.renderCustomView}
          renderFooter={this.renderFooter}
          showUserAvatar
          user={{
            _id: 'tuananh2',
            avatar: 'https://scontent.fhan1-1.fna.fbcdn.net/v/t1.0-1/p100x100/15107316_10157886412940455_502507459475050132_n.png?oh=f82036d1d91a97befb86afe1f820c169&oe=5A4DAE5B'
          }}
        />
        <Loading isVisible = {this.state.isVisible} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});
