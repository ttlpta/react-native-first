import React from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import {
  StyleSheet, View, ScrollView, Dimensions, Text, TextInput, Image,
  TouchableHighlight, TouchableOpacity, Modal, Picker
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Content, Form, Item, Input, Label } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

import { ICON_ARROW_DOWN } from 'app/constants';

class AdvanceSearch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date : '',
      widthDatePicker : 60,
      visible : this.props.visible,
      time: 'time2',
      distance : 'distance2',
      cat: 'cat2',
      activeDate : {
        today : true,
        tomorrow: false,
        other : false,
      }
    };
  }

  onDateChange = (date) => {
    this.setState({date: date});
  }

  onPickActiveDate = (name, date, widthDatePicker) => {
    const activeDate = {};
    for (const date in this.state.activeDate) {
      activeDate[date] = false;
    }

    activeDate[name] = true;

    if (date && widthDatePicker) {
      this.setState({ ...this.state, activeDate, date, widthDatePicker });
    } else {
      this.setState({...this.state, activeDate });
    }
  }

  onPickTime = (time) => {
    this.setState({...this.state, time });
  }

  onCatChange = (cat) => {
    this.setState({...this.state, cat });
  }

  onDistanceChange = (distance) => {
    this.setState({...this.state, distance });
  }

  onCloseFilter = () => {
    this.props.onCloseFilter();
  }

  _onRequestClose = () => {

  }
  
  render() {
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this._onRequestClose}
        ref={ref => { this.modal = ref; }}
      >
        <TouchableHighlight onPress={this.onCloseFilter} style={styles.modalFavouriteMask}>
          <TouchableOpacity activeOpacity={1} onPress={() => false} style={styles.containerModal}>
            <Content>
              <Form>
                <View style={styles.dateContainer}>
                  <Text style={styles.labelDate}>{I18n.t('AdvanceSearch.label1' )}</Text>  
                  <View>
                    <Picker
                      selectedValue={this.state.cat}
                      onValueChange={(item) => this.onCatChange(item)}
                    >
                      <Picker.Item label="Tất cả các chuyên khoa" value="cat0" />
                      <Picker.Item label="Tai, mũi, họng" value="cat1" />
                      <Picker.Item label="Đa khoa" value="cat2" />
                    </Picker>
                  </View>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.labelDate}>{I18n.t('AdvanceSearch.label2' )}</Text>  
                  <View>
                    <Picker
                      selectedValue={this.state.distance}
                      onValueChange={(item) => this.onDistanceChange(item)}
                    >
                      <Picker.Item label="5 km" value="distance0" />
                      <Picker.Item label="10 km" value="distance1" />
                      <Picker.Item label="20 km" value="distance2" />
                    </Picker>
                  </View>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.labelDate}>{I18n.t('AdvanceSearch.label3' )}</Text>
                  <View style={{ flexDirection: 'row' , marginTop: 10}}>
                    <TouchableOpacity 
                      style={ (this.state.activeDate.today) ? styles.btnDateActive : styles.btnDate } 
                      onPress={() => this.onPickActiveDate('today')}
                    >
                      <Text style={ (this.state.activeDate.today) ? styles.btnDateTxtActive : styles.btnDateTxt }>{I18n.t('AdvanceSearch.today' )}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={ (this.state.activeDate.tomorrow) ? styles.btnDateActive : styles.btnDate } 
                      onPress={() => this.onPickActiveDate('tomorrow')}
                    >
                      <Text style={ (this.state.activeDate.tomorrow) ? styles.btnDateTxtActive : styles.btnDateTxt } >{I18n.t('AdvanceSearch.tomorrow' )}</Text>
                    </TouchableOpacity> 
                    <DatePicker
                      style={{ width: this.state.widthDatePicker }}
                      mode="date"
                      date={this.state.date}
                      showIcon={false}
                      placeholder="..."
                      format="YYYY-MM-DD"
                      minDate="2016-05-01"
                      maxDate="2018-06-01"
                      confirmBtnText="Chọn ngày"
                      cancelBtnText="Huỷ"
                      customStyles={{
                        dateInput: (!this.state.activeDate.other) ? {
                          paddingHorizontal: 10,
                          paddingVertical: 10, 
                          backgroundColor: '#fff',
                          borderWidth: 1,
                          borderColor: '#828282',
                          marginRight: 5,
                          borderRadius: 3,
                        } : {
                          paddingHorizontal: 5,
                          paddingVertical: 10, 
                          backgroundColor: '#35881E',
                          borderWidth: 1,
                          borderColor: '#35881E',
                          marginRight: 5,
                          borderRadius: 3,
                        },
                        dateText : (!this.state.activeDate.other) ? { color: '#828282' } : { color: '#fff' }
                      }}
                      onDateChange={(date) => { 
                        this.onPickActiveDate('other', date, 130);
                      }}
                    />  
                  </View>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.labelDate}>{I18n.t('AdvanceSearch.timeExamination' )}</Text>  
                  <View>
                    <Picker
                      iosHeader="Khung giờ"
                      mode="dialog"
                      selectedValue={this.state.time}
                      headerBackButtonText="Trở về"
                      style={stylesNativebase.picker}
                      onValueChange={(time) => this.onPickTime(time)}
                    >
                      <Picker.Item label="15:00 - 16:00" value="time0" />
                      <Picker.Item label="17:00 - 18:00" value="time1" />
                      <Picker.Item label="19:00 - 22:00" value="time2" />
                    </Picker>
                  </View>
                </View>
              </Form>
            </Content>
             <TouchableOpacity onPress={this.onCloseFilter}>
              <LinearGradient
                colors={['#ffffff', '#FBEBAF',]}
                style={styles.sendButton}
              >
                <Text style={styles.sendButtonTxt}>{I18n.t('AdvanceSearch.button' )}</Text>
              </LinearGradient>
            </TouchableOpacity> 
          </TouchableOpacity>
        </TouchableHighlight>
      </Modal>

    );
  }
}
const stylesNativebase = {
  picker : {
    // marginTop: 5
  }
};

const styles = StyleSheet.create({
  sendButton: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // backgroundColor: '#FFD638',
    // backgroundColor: 'transparent',
    marginBottom: 10,
    paddingTop: 5
  },
  sendButtonTxt: {
    color: '#4EBA31',
    fontSize: 18,
    backgroundColor: 'transparent'
  },
  containerPicker : {
    flexDirection:'row',
    // backgroundColor: 'red',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    marginLeft: -15
  },
  iconArrowDown : {
    width: 16,
    height: 8,
    position: 'absolute',
    bottom: 15,
    right: 0
  },
  btnDateActive: {
    paddingHorizontal: 5,
    paddingVertical: 10, 
    backgroundColor: '#35881E',
    borderWidth: 1,
    borderColor: '#35881E',
    marginRight: 5,
    borderRadius: 3,
    height:40
  },
  btnDateTxtActive : {
    color: '#fff',
    fontSize: 16
  },
  btnDateTxt : {
    color: '#828282',
    fontSize: 16
  },
  btnDate : {
    paddingHorizontal: 5,
    paddingVertical: 10, 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#828282',
    marginRight: 5,
    borderRadius: 3,
    height:40
  },
  dateContainer: {
    marginTop: 20,
    paddingLeft: 15
  },
  labelDate : {
    fontSize: 15,
    color: '#828282',
    textAlign: 'left'
  },
  modalFavouriteMask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerModal: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    position: 'relative',
    top: -50,
    // backgroundColor: 'transparent',
    width: Dimensions.get('window').width - 30,
    height: Dimensions.get('window').height - 220,
    borderRadius: 5
  },
  txtBold: {
    fontWeight: 'bold',
    flex: 4,
  },
  txtSmall: {
    fontSize: 13,
    flex: 2,
    color: '#4F4F4F'
  },
});

function mapStatetoProps(state) {
  return { mylanguage: state.language.defaultlanguage };
}
export default connect(mapStatetoProps)(AdvanceSearch);
