import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { Image, View, StyleSheet, ScrollView, Alert, Dimensions, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Picker, CameraRoll } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';
import { takeSnapshot } from 'react-native-view-shot';


import LeftCenterRight from './../LeftCenterRight';

import {
  BG_IMAGE, ICON_GOBACK, ICON_BOOK, ICON_SMALL_IMAGE, ICON_SMALL_RIGHT,
} from 'app/constants';
// import withConnect from './withConnect';

class DetailMedicalRecord extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      language: this.props.mylanguage,
      error: null,
      res: null,
      value: {
        format: "png",
        quality: 0.9,
        result: "file",
        snapshotContentContainer: false,
      },
    };
  }

  componentWillMount() {
    this.setState({ data: this.props.navigation.state.params.medicalHistory });
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
    const { booking_date } = this.state.data;
    return (
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitleText}>{`Bệnh án ngày ${booking_date}`}</Text>
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

  snapshot = refname => () =>
    takeSnapshot(this.refs[refname], this.state.value)
      .then(res =>
        this.state.value.result !== "file"
          ? res
          : new Promise((success, failure) =>
            // just a test to ensure res can be used in Image.getSize
            Image.getSize(
              res,
              (width, height) => {
                CameraRoll.saveToCameraRoll(res)
                  .then(() => {
                    this.dropdown.alertWithType('success', 'Xuất file ảnh thành công', 'Ảnh đã được lưu trong thư viện của bạn');
                    success(res);
                  }).catch(error => {
                    this.dropdown.alertWithType('error', 'Xuất file ảnh không thành công', 'Xin hãy thử lại');
                    failure(error)
                  });
              },
              failure)))
      .then(res => this.setState({
        error: null,
        res,
        previewSource: {
          uri:
          this.state.value.result === "base64"
            ? "data:image/" + this.state.value.format + ";base64," + res
            : res
        }
      }))
      .catch(error => (console.warn(error), this.setState({ error, res: null, previewSource: null })));

  render() {
    const { conclusion, updated_date, symtomp, prescription } = this.state.data;
    return (
      // <ScrollView>
      <View style={styles.container}>
        <Image
          source={BG_IMAGE}
          style={styles.rootBgImage}
        />
        {this.renderHeader()}
        <ScrollView style={styles.scrollView}>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Image source={ICON_BOOK} style={{ width: 20, height: 22 }} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{'Cập nhật lúc'}</Text>
              <Text style={styles.txtInput} >{updated_date}</Text>
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Image source={ICON_BOOK} style={{ width: 20, height: 22 }} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{'Triệu chứng'}</Text>
              <Text style={styles.txtInput} >{symtomp}</Text>
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Image source={ICON_BOOK} style={{ width: 20, height: 22 }} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{'Chuẩn đoán'}</Text>
              <Text style={styles.txtInput} >{'Sốt xuất huyết'}</Text>
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Image source={ICON_BOOK} style={{ width: 20, height: 22 }} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{'Kết luận'}</Text>
              <Text style={styles.txtInput} >{conclusion}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', height: 3 }} />
        {/* Display Area */}
        <ScrollView style={{ ...styles.scrollView, marginBottom: 20 }}>
          <View style={styles.itemRowFirst}>
            <Text style={{ fontSize: 18, color: '#fff' }} >ĐƠN THUỐC</Text>
            <TouchableOpacity onPress={this.snapshot("prescription")} style={{ flexDirection: 'row', alignItems: 'center' }} >
              <Image source={ICON_SMALL_IMAGE} style={{ width: 14, height: 14, resizeMode: 'contain' }} />
              <Text style={{ fontSize: 14, color: '#fff', paddingHorizontal: 5 }} >Xuất ảnh</Text>
              <Image source={ICON_SMALL_RIGHT} style={{ width: 10, height: 14, resizeMode: 'contain' }} />
            </TouchableOpacity>
          </View>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }} >
              <View style={{ width: 30, height: 30, borderRadius: 15, borderColor: '#52C234', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <Text style={{ color: '#fff' }}>1</Text>
              </View>
            </View>

            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{'ALFIGOLD (500mg)'}</Text>
              <Text style={{ ...styles.txtInput, fontSize: 13 }} >{'Sáng 1 Trưa: 1 Tối: 1'}</Text>
              <Text style={{ ...styles.txtInput, fontSize: 13 }} >{'Ghi chú: Uống trước bữa ăn'}</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-start' }} >
              <View style={{ width: 70, height: 20, borderRadius: 10, borderColor: 'transparent', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <Text style={{ color: '#fff', fontSize: 12 }} >28 viên</Text>
              </View>
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }} >
              <View style={{ width: 30, height: 30, borderRadius: 15, borderColor: '#52C234', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <Text style={{ color: '#fff' }}>1</Text>
              </View>
            </View>

            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{'ALFIGOLD (500mg)'}</Text>
              <Text style={{ ...styles.txtInput, fontSize: 13 }} >{'Sáng 1 Trưa: 1 Tối: 1'}</Text>
              <Text style={{ ...styles.txtInput, fontSize: 13 }} >{'Ghi chú: Uống trước bữa ăn'}</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-start' }} >
              <View style={{ width: 70, height: 20, borderRadius: 10, borderColor: 'transparent', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <Text style={{ color: '#fff', fontSize: 12 }} >28 viên</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* // Print Area */}
        <ScrollView ref="prescription" style={{ ...styles.scrollViewHide, marginBottom: 20, backgroundColor: '#52C234' }}>
          <View style={styles.itemRowFirst}>
            <Text style={{ fontSize: 18, color: '#fff' }} >ĐƠN THUỐC</Text>
            <TouchableOpacity onPress={this.snapshot("prescription")} style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 130 }} >
              <Text style={{ fontSize: 14, color: '#fff', paddingHorizontal: 5 }} >Xuất ảnh</Text>
              <Image source={ICON_SMALL_RIGHT} style={{ width: 10, height: 14, resizeMode: 'contain' }} />
            </TouchableOpacity>

          </View>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }} >
              <View style={{ width: 30, height: 30, borderRadius: 15, borderColor: '#52C234', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <Text style={{ color: '#fff' }}>1</Text>
              </View>
            </View>

            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{'ALFIGOLD (500mg)'}</Text>
              <Text style={{ ...styles.txtInput, fontSize: 13 }} >{'Sáng 1 Trưa: 1 Tối: 1'}</Text>
              <Text style={{ ...styles.txtInput, fontSize: 13 }} >{'Ghi chú: Uống trước bữa ăn'}</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-start' }} >
              <View style={{ width: 70, height: 20, borderRadius: 10, borderColor: 'transparent', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <Text style={{ color: '#fff', fontSize: 12 }} >28 viên</Text>
              </View>
            </View>
          </View>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }} >
              <View style={{ width: 30, height: 30, borderRadius: 15, borderColor: '#52C234', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <Text style={{ color: '#fff' }}>1</Text>
              </View>
            </View>

            <View style={{ flex: 6 }}>
              <Text style={styles.txtLabel} >{'ALFIGOLD (500mg)'}</Text>
              <Text style={{ ...styles.txtInput, fontSize: 13 }} >{'Sáng 1 Trưa: 1 Tối: 1'}</Text>
              <Text style={{ ...styles.txtInput, fontSize: 13 }} >{'Ghi chú: Uống trước bữa ăn'}</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-start' }} >
              <View style={{ width: 70, height: 20, borderRadius: 10, borderColor: 'transparent', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <Text style={{ color: '#fff', fontSize: 12 }} >28 viên</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <DropdownAlert
          ref={(ref) => this.dropdown = ref} />
      </View>
      // </ScrollView >
    );
  }
}

const styles = {
  btnFinishText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: 'transparent',
  },
  linearGradient: {
    opacity: 0,
    paddingLeft: 15,
    paddingRight: 15,
    width: Dimensions.get('window').width,
    paddingVertical: 15,
    justifyContent: 'center',
    // flex: 1
  },
  btnFinish: {
    // flex: 1
  },
  bgIconCamera: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  bgIconCameraTouch: {
    position: 'absolute',
    bottom: 45,
    right: -10
  },
  txtLabel: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  },
  // txtInput : {
  //   backgroundColor: 'transparent',
  //   color: '#fff',
  //   fontSize: 22
  // },
  txtInput: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 18,
    padding: 0
  },
  txtInputDisable: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 22,
    height: 0,
    marginTop: 18
  },
  firstRow: {
    justifyContent: 'center',
    paddingTop: 7,
    flex: 4,
    flexDirection: 'row',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 3,
    paddingBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    borderTopWidth: 1,
  },
  itemRowFirst: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  iconPencil: {
    width: 24,
    height: 24
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent',
    marginVertical: 10
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: 'rgb(255, 255, 255)',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    // shadow
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    shadowOpacity: 0.7,
    shadowColor: 'rgb(255, 255, 255)',
  },
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
  },
  headerContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 21,
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
    fontFamily: 'Roboto-Light'
  },
  goBackIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
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
    // flex: 1,
    // marginBottom: 10
  },
  scrollViewHide: {
    flex: 1,
    position: 'absolute',
    right: -500,
    zIndex: -9999,
  },
  txtHeader: {
    backgroundColor: 'transparent',
    color: '#F2C94C',
    fontWeight: 'bold',
    marginVertical: 25,
  },
  txt: {
    backgroundColor: 'transparent',
    flex: 1,
    color: '#fff',
    lineHeight: 19,
  },
  pickerLanguage: {
    color: '#fff',
    width: 150,
    height: 25,
  },
};

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(DetailMedicalRecord);
