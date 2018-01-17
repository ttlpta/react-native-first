import React from 'react';
import {
  StyleSheet,
  ScrollView, View, Text,
  Image, TouchableOpacity,
} from 'react-native';

import {
  ICON_USER_BLUE, ICON_CLOCK2, ICON_NOTEBOOK,
  ICON_XEMBENHAN, ICON_RIGHT, ICON_MSG, ICON_PLAY,
}
  from 'app/constants';
import Avatar from 'app/components/Avatar';
import __ from 'react-native-i18n';

export default class MedicalHistory extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentWillMount() {
    this.setState({ data: this.props.item });
  }

  render() {
    const {
      actual_start_time, actual_end_time, booking_date, conclusion,
    }
      = this.state.data;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.containerTopLeft}>
            <Image source={ICON_CLOCK2} style={{ width: 16, height: 16 }} />
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'transparent',
                marginHorizontal: 5
              }}
            >
              <Text style={styles.timeTxt}>{`${actual_start_time} -`}</Text>
              <Text style={styles.timeTxt}>{actual_end_time}</Text>
            </View>
            <Text style={styles.dateTxt}>{booking_date}</Text>
          </View>
        </View>
        <View style={styles.containerBottom}>
          <View style={styles.containerMiddleLeft}>
            <View style={styles.profileContainer}>
              <Text style={styles.maleTxt}>
                {conclusion}
              </Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: 'rgba(86, 204, 242, 0.3)' }}></View>
          <View style={styles.containerMiddleRight}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.props.navigation.navigate('Message')}>
                <Image source={ICON_MSG} style={{ width: 26, height: 27 }} />
              </TouchableOpacity>
              <View style={{ width: 1, backgroundColor: 'rgba(86, 204, 242, 0.3)' }}></View>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                <Image source={ICON_PLAY} style={{ width: 20, height: 28, marginRight: 5 }} />
                <Text style={{ backgroundColor: 'transparent', color: '#fff', marginTop: 3 }}>15:22</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.touchXemChiTiet}
              onPress={() => this.props.navigation.navigate('DetailMedicalRecord', {
                medicalHistory: this.state.data,
              })}
            >
              <Text style={styles.touchXemChiTietTxt}>{__.t('detail')}</Text>
              <Image style={{ width: 6, height: 18, resizeMode: 'contain' }} source={ICON_RIGHT} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  touchXemChiTiet: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchXemChiTietTxt: {
    fontSize: 14,
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    paddingRight: 5
  },
  touchBenhAn: {
    flexDirection: 'row',
    borderColor: '#56CCF2',
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
    marginTop: 5
  },
  touchBenhAnTxt: {
    backgroundColor: 'transparent',
    color: '#56CCF2',
    fontSize: 14
  },
  containerBottom: {
    paddingTop: 18,
    paddingBottom: 10,
    // flexDirection: 'row',
    marginHorizontal: 15
  },
  containerMiddle: {
    paddingVertical: 10,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(86, 204, 242, 0.3)',
    marginHorizontal: 15
  },
  containerMiddleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 15
    // backgroundColor: 'red'
    // marginTop: 10
  },
  profileContainer: {
    // paddingLeft: 10
  },
  maleTxt: {
    fontSize: 15,
    backgroundColor: 'transparent',
    color: '#fff'
  },
  nameTxt: {
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#fff'
  },
  containerMiddleLeft: {
    flexDirection: 'row',
    paddingTop: 5,
    flex: 2,
    paddingBottom: 15
  },
  container: {
    borderWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 5,
  },
  containerTopRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
    paddingRight: 15
  },
  containerTopLeft: {
    flexDirection: 'row',
    flex: 2,
    paddingTop: 5,
    paddingLeft: 15
  },
  dateTxt: {
    backgroundColor: 'transparent',
    color: '#fff',
    marginHorizontal: 5
  },
  timeTxt: {
    backgroundColor: 'transparent',
    color: '#fff',
    marginHorizontal: 5
  },
  containerTop: {
    flexDirection: 'row',
    paddingTop: 10
  },
  ecoinContainer: {
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  denieContainer: {
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: '#EB5757',
  },
  ecoinTxt: {
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 8
  },
  denieTxt: {
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 8
  }
});
