import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { Image, View, StyleSheet, ScrollView, Dimensions, Text, TouchableOpacity } from 'react-native';
import LeftCenterRight from './../LeftCenterRight';

import { BG_IMAGE, ICON_GOBACK, ICON_TERM } from 'app/constants';
// import withConnect from './withConnect';

class Term extends React.PureComponent {
  static navigationOptions = {
    header: null,
  }

  renderHeader() {
    return (
      <LeftCenterRight
        style={styles.headerContainer}
        left={this.renderGoBack()}
        body={this.renderHeaderTitle()}
      />
    );
  }

  renderHeaderTitle() {
    return (
      <View style={styles.headerTitleContainer}>
        <Image style={styles.headerTitleIcon} source={ICON_TERM} />
        <Text style={styles.headerTitleText}>{I18n.t('terms.header'  )}</Text>
      </View>
    );
  }

  renderGoBack() {
    return (
      <TouchableOpacity onPress={this.onGoBack}>
        <Image style={styles.goBackIcon} source={ICON_GOBACK} />
      </TouchableOpacity>
    );
  }


  onGoBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={BG_IMAGE}
          style={styles.rootBgImage}
        />
        {this.renderHeader()}
        <ScrollView style={styles.scrollView}>
          <Text style={styles.txtHeader}>
            What is Lorem Ipsum?
          </Text>
          <Text style={styles.txt}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </Text>
          <Text style={styles.txtHeader}>
            What is Lorem Ipsum?
          </Text>
          <Text style={styles.txt}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </Text>
          <Text style={styles.txtHeader}>
            What is Lorem Ipsum?
          </Text>
          <Text style={styles.txt}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </Text>
          <Text style={styles.txtHeader}>
            What is Lorem Ipsum?
          </Text>
          <Text style={styles.txt}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 21,
    borderBottomWidth: 1,
    borderBottomColor: '#127C09',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 7,
  },
  headerTitleText: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0)',
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
  scrollView: {
    marginHorizontal: 25,
    height: Dimensions.get('window').height,
    paddingRight: 20,
  },
  txtHeader: {
    backgroundColor: 'transparent',
    color: '#F2C94C',
    fontWeight: 'bold',
    marginVertical: 25,
    fontSize: 16,
  },
  txt: {
    backgroundColor: 'transparent',
    flex: 1,
    fontSize: 16,
    color: '#fff',
    lineHeight: 19,
  },
  goBackIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },
};

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(Term);
