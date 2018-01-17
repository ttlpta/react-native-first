import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
  PixelRatio,
} from 'react-native';
import I18n from 'react-native-i18n';
import AppIntro from 'app/components/AppIntroLib/AppIntro';
import withConnect from './withConnect';

const windowsWidth = Dimensions.get('window').width;
const windowsHeight = Dimensions.get('window').height;
// import AppIntro from 'appintro-udr';

class Intro extends PureComponent {
  static navigationOptions = {
    header: null,
  }

  onSkipBtnHandle = index => {
    // this.props.navigation.navigate('Login');
  };
  doneBtnHandle = () => {
    // Alert.alert('Done');
    this.props.navigation.navigate('Login');
  };
  nextBtnHandle = index => {
    // Alert.alert('Next');
    // console.log(index);
    this.props.navigation.navigate('Login');
  };
  onSlideChangeHandle = (index, total) => {
    // console.log(index, total);
  };

  render() {
    const language = this.props.language;
    return (
      <AppIntro
        onNextBtnClick={this.nextBtnHandle}
        onDoneBtnClick={this.doneBtnHandle}
        onSkipBtnClick={this.onSkipBtnHandle}
        onSlideChange={this.onSlideChangeHandle}
        doneBtnLabel= {I18n.t('login.lgLogin')}
        skipBtnLabel= {I18n.t('back')}
        nextBtnLabel= {I18n.t('login.lgLogin')}
      >
        <View style={[styles.slide]}>
          <View style={[styles.header, { width: windowsWidth }]}>
            <View>
              <Image
                style={{ width: windowsWidth, height: windowsHeight }}
                source={require('../../assets/intro/1/bg.png')}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 35,
                  }}
                >
                  <Image
                    source={require('../../assets/intro/1/login_logo.png')}
                    style={styles.logo}
                  />
                </View>
                <View style={styles.phone}>
                  <Image
                    source={require('../../assets/intro/1/iPhone1.png')}
                    style={styles.image}
                  />
                </View>
                <Text style={styles.textLabel}>UBER DOCTOR</Text>
                <View>
                  <Text style={styles.textSmall}>
                sadasdadasdas
                  </Text>
                </View>
              </Image>
            </View>
          </View>
        </View>

        <View style={[styles.slide]}>
          <View style={[styles.header, { width: windowsWidth }]}>
            <View>
              <Image
                style={{ width: windowsWidth, height: windowsHeight }}
                source={require('../../assets/intro/1/bg.png')}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 35,
                  }}
                >
                  <Image
                    source={require('../../assets/intro/1/login_logo.png')}
                    style={styles.logo}
                  />
                </View>
                <View style={styles.phone}>
                  <Image
                    source={require('../../assets/intro/1/iPhone2.png')}
                    style={styles.image}
                  />
                </View>
                <Text style={styles.textLabel}>{ I18n.t('intro.intro2Title') }</Text>
                <View>
                  <Text style={styles.textSmall}>
                    { I18n.t('intro.intro2Slogan') }
                  </Text>
                </View>
              </Image>
            </View>
          </View>
        </View>

        <View style={[styles.slide]}>
          <View style={[styles.header, { width: windowsWidth }]}>
            <View>
              <Image
                style={{ width: windowsWidth, height: windowsHeight }}
                source={require('../../assets/intro/1/bg.png')}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 35,
                  }}
                >
                  <Image
                    source={require('../../assets/intro/1/login_logo.png')}
                    style={styles.logo}
                  />
                </View>
                <View style={styles.phone}>
                  <Image
                    source={require('../../assets/intro/1/iPhone3.png')}
                    style={styles.image}
                  />
                </View>
                <Text style={styles.textLabel}>{ I18n.t('intro.intro3Title') }</Text>
                <View>
                  <Text style={styles.textSmall}>
                    { I18n.t('intro.intro3Slogan') }
                  </Text>
                </View>
              </Image>
            </View>
          </View>
        </View>
      </AppIntro>
    );
  }
}

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

export function normalize(size) {
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(size));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(size)) - 2;
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#9DD6EB',
    // padding: 15,
  },
  header: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phone: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 115,
    height: 70,
  },
  image: {
    width: Dimensions.get('window').width - 120,
    height: Dimensions.get('window').height - 320,
    resizeMode: 'contain',
  },
  textLabel: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 24,
    textShadowColor: 'green',
    marginTop: 12,
  },
  textSmall: {
    fontFamily: 'Roboto-Light',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: normalize(16),
    textShadowColor: 'green',
    marginLeft: 35,
    marginRight: 35,
    marginTop: 8,
  },
});

export default withConnect(Intro);
