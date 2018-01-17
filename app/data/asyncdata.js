/**
 * @providesModule TeleMedicine.data.asyncdata
 */

/* eslint no-unused-vars: 0 */

var moment = require('moment');

import * as app from 'app/constants/app';
import * as sysutils from 'app/utils/sysutils';
import * as datautils from 'app/utils/datautils';


/**
 * Server date and time patterns
 */
export const SERVER_DATE_PATTERN = 'YYYY-MM-DD';
export const SERVER_TIME_PATTERN = 'HH:mm';
export const SERVER_DATE_TIME_PATTERN = 'YYYY-MM-DD HH:mm';


/**
 * Gets server current datetime
 * Server should return this data someway
 */
export function getServerDateTime() {
  return getToday();
}

function getToday() {
  return new Date();
}

function getTomorrow() {
  return datautils.getTomorrowOf(getToday());
}

function getFutureDate(hours, mins) {
  return moment(getToday()).add(hours, 'hours').add(mins, 'minutes').toDate();
}

function formatServerDate(date) {
  return datautils.formatDateTime(date, SERVER_DATE_PATTERN);
}

function formatServerTime(date) {
  return datautils.formatDateTime(date, SERVER_TIME_PATTERN);
}

function formatServerDateTime(date) {
  return datautils.formatDateTime(date, SERVER_DATE_TIME_PATTERN);
}


/**
 * Generates a doctor name
 */
export function getDoctorName() {
  const DOCTOR_NAMES = [
    'Nguyễn Thị Thùy Dương', 'Dương Văn Mai', 'Trương Công Bảng',
    'Nguyễn Nhật Linh', 'Phạm Minh Anh', 'Trần Minh Thiện', 'Âu Mai Hà',
  ];
  return datautils.randomArrayItem(DOCTOR_NAMES);
}

/**
 * Generates a doctor title
 */
export function getDoctorTitle() {
  const DOCTOR_TITLES = [
    'Bác sĩ chuyên khoa III', 'Bác sĩ nội khoa', 'Bác sĩ chuyên khoa ngoại',
    'Bác sĩ chuyên khoa sản', 'Bác sĩ vật lý trị liệu', 'Bác sĩ tim',
  ];
  return datautils.randomArrayItem(DOCTOR_TITLES);
}

/**
 * Generates a doctor position
 */
export function getDoctorPosition() {
  const DOCTOR_POSITIONS = [
    'Chủ nhiệm khoa X BV C', 'Trợ lý phẫu thuật tim',
    'Bác sĩ gây mê', 'Phó giám đốc bệnh viện',
    'Bác sĩ hồi sức cấp cứu', 'Chuyên viên tư vấn nội khoa',
  ];
  return datautils.randomArrayItem(DOCTOR_POSITIONS);
}

/**
 * Generates a clinic name
 */
export function getClinicName() {
  const CLINIC_NAMES = [
    'Phòng khám đa khoa Hồng Ngọc số 1', 'Phòng khám đa khoa Hồng Ngọc số 2',
    'Phòng khám đa khoa Hồng Ngọc số 3', 'Phòng khám đa khoa Hồng Ngọc số 4',
    'Bệnh viện Thu Cúc Hà Nội 1', 'Bệnh viện Thu Cúc Hà Nội 2',
    'Bệnh viện Thu Cúc Hà Nội 2', 'Bệnh viện Thu Cúc Hà Nội 4',
    'Bệnh viện Tràng An Hà Nội 1', 'Bệnh viện Tràng An Hà Nội 2',
    'Bệnh viện Tràng An Hải Dương', 'Bệnh viện Thu Cúc TP HCM',
    'Bệnh viện 108', 'Bệnh viện 207',
  ];
  return datautils.randomArrayItem(CLINIC_NAMES);
}

/**
 * Generates a clinic name
 */
export function getClinicLocation() {
  const CLINIC_LOCATIONS = [
    'Số 123, Đường Kha Vạn Cân, Quận Thủ Đức, TP HCM',
    'Phố Hàng Bài, Quận Ba Đình, Hà Nội',
    '152A, CT7, Khu đô thị VinHomes Hà Nội',
  ];
  return datautils.randomArrayItem(CLINIC_LOCATIONS);
}

/**
 * Generates a price
 */
export function getPrice() {
  const PRICES = [
    '100,000', '207,000', '10,123,000',
    '111,000', '1,000,000', '463,000',
    '312,000', '1,253,000', '200,000', '0',
  ];
  return datautils.randomArrayItem(PRICES);
}

/**
 * Generates a testing clinic item data
 */
export function getClinicItem() {
  return {
    dataType: 'clinic',
    id: 'c012345',
    name: getClinicName(),
    avatar: ( Math.random() > 0.5 ) ? require('app/assets/images/icon_real_clinic_default.jpg') : require('app/assets/images/icon_real_clinic_default2.jpg'),
    webURL: 'https://ecomedic.vn/phong-kham/VN01CLI534/phong-kham-da-khoa-vietclinic-viet-nam',
    favorite: datautils.randomBool(),
    position: getClinicLocation(),
    price: getPrice(),
    availTime: [
      {
        date: formatServerDate(getToday()),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      }, {
        date: formatServerDate(getTomorrow()),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      }, {
        date: formatServerDate(getFutureDate(datautils.randomInt(50, 70), datautils.randomInt(60))),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      }, {
        date: formatServerDate(getFutureDate(datautils.randomInt(80, 100), datautils.randomInt(60))),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      }, {
        date: formatServerDate(getFutureDate(datautils.randomInt(110, 130), datautils.randomInt(60))),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      }, {
        date: formatServerDate(getFutureDate(datautils.randomInt(140, 160), datautils.randomInt(60))),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      }, {
        date: formatServerDate(getFutureDate(datautils.randomInt(170, 190), datautils.randomInt(60))),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      },
    ],
    photos: [
      'https://gitlab.pro/yuji/demo/uploads/2d5122a2504e5cbdf01f4fcf85f2594b/Mwb8VWH.jpg',
      'https://gitlab.pro/yuji/demo/uploads/2d5122a2504e5cbdf01f4fcf85f2594b/Mwb8VWH.jpg',
      'https://gitlab.pro/yuji/demo/uploads/4421f77012d43a0b4e7cfbe1144aac7c/XFVzKhq.jpg',
      'https://gitlab.pro/yuji/demo/uploads/576ef91941b0bda5761dde6914dae9f0/kD3eeHe.jpg',
      'https://gitlab.pro/yuji/demo/uploads/2d5122a2504e5cbdf01f4fcf85f2594b/Mwb8VWH.jpg',
    ],
    doctors: [ 'd012345', 'd012346', 'd012347', 'd012348', 'd012349' ],
    desc: `Phòng khám đa khoa 108 Nam Định là chi nhánh trực thuộc công ty Cổ Phần Y tế Việt Nam. Phòng khám có không gian rộng rãi, thoáng đãng, được trang bị với các thiết bị tân tiến như máy CT scanner, máy X-Quang cao tần, máy sinh hóa tự động máy siêu âm màu 4D, ...\n\n Phòng khám đa khoa 108 Nam Định là chi nhánh trực thuộc công ty Cổ Phần Y tế Việt Nam.Phòng khám đa khoa 108 Nam Định là chi nhánh trực thuộc công ty Cổ Phần Y tế Việt Nam`,
  };
}

/**
 * Generates a testing doctor item data
 */
export function getDoctorItem() {
  return {
    dataType: 'doctor',
    id: `d${datautils.randomInt(100000,200000)}`,
    clinicId: `c${datautils.randomInt(100000,200000)}`,
    title: getDoctorTitle(),
    name: getDoctorName(),
    avatar: ( Math.random() > 0.5 ) ? require('app/assets/images/icon_real_doctor_default.png') : require('app/assets/images/icon_real_doctor_default2.jpg'),
    webURL: 'https://ecomedic.vn/phong-kham/VN01CLI534/phong-kham-da-khoa-vietclinic-viet-nam',
    favorite: datautils.randomBool(),
    position: getDoctorPosition(),
    price: getPrice(),
    availTime: [
      {
        date: formatServerDate(getToday()),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      }, {
        date: formatServerDate(getTomorrow()),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      }, {
        date: formatServerDate(getFutureDate(datautils.randomInt(50, 70), datautils.randomInt(60))),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      }, {
        date: formatServerDate(getFutureDate(datautils.randomInt(80, 100), datautils.randomInt(60))),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      }, {
        date: formatServerDate(getFutureDate(datautils.randomInt(110, 130), datautils.randomInt(60))),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      }, {
        date: formatServerDate(getFutureDate(datautils.randomInt(140, 160), datautils.randomInt(60))),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      }, {
        date: formatServerDate(getFutureDate(datautils.randomInt(170, 190), datautils.randomInt(60))),
        data: ['7:00', '15:00', '7:00', '7:00', '12:00', '7:00', '7:00', '7:00', '22:00']
      },
    ],
    desc: `Nguyên chủ nhiệm khoa, Phó giám đốc bệnh viện 354\n\nBác sĩ Thùy Dương là người nhiều kinh nghiệm trong công tác khám và chữa bệnh. Năm 2017 được vinh danh ở giải thưởng Bác sĩ của năm.\n\nPhòng khám đa khoa 108 Nam Định là chi nhánh trực thuộc công ty Cổ Phần Y tế Việt Nam. Phòng khám đa khoa 108 Nam Định là chi nhánh trực thuộc công ty Cổ Phần Y tế Việt Nam.`,
  };
}

/** 
 * Generates a list of clinic and doctor items
 */
export function getSearchData(dataType, numItems = 10) {
  const result = [];
  for (let idx = 0; idx < numItems; idx += 1) {
    let item = null;
    if (dataType === 'doctor') item = getDoctorItem();
    else if (dataType === 'clinic') item = getClinicItem();
    else item = (datautils.randomBool() ? getClinicItem() : getDoctorItem());
    result.push(item);
  }
  return result;
}

/** 
 * Generates a list of doctor items for a clinic
 */
export function getDoctorsOfClinic(clinicId) {
  const numItems = 7;
  const result = [];
  for (let idx = 0; idx < numItems; idx += 1) {
    result.push(getDoctorItem());
  }
  return result;
}

/**
 * Generates testing user data
 */
export function getUserData() {
  return {
    userid: '0934444555',
    fullname: 'Panda Trường',
    cellphone: '0934444555',
    email: 'truong@uberdoctor.vn',
    address: '15 Duy Tân, Hà Nội, Việt Nam',
    emergencyNumber: '0123 456 789',
    avatar: { uri: 'https://facebook.github.io/react/img/logo_og.png' },
    serverTime: getServerDateTime(),
    appointments: [],
  };
}

/**
 * Generates testing login data
 */
export function getLoginData() {
  return {
    userid: '0934444555',
    password: null,
  };
}

/**
 * Generates testing appointment data
 */
export function getAppointmentData(dataType, numItems = 5) {
  const result = [];
  for (let idx = 0; idx < numItems; idx += 1) {
    let item = null;
    if (dataType === 'past') item = getAppointmentItem('past');
    else if (dataType === 'future') item = getAppointmentItem('future');
    else item = (datautils.randomBool() ? getAppointmentItem('past') : getAppointmentItem('future'));
    result.push(item);
  }
  return result;
}

/**
 * Generates testing appointment data
 */
export function getAppointmentItem(dataType) {
  return {
    dataType: dataType, // [ past, future ]
    userid: '0934444555',
    doctorId: `d${datautils.randomInt(100000,200000)}`,
    doctorTitle: getDoctorTitle(),
    doctorName: getDoctorName(),
    doctorAvatar: { uri: 'https://facebook.github.io/react/img/logo_og.png', },
    checkType: datautils.randomBool() ? 'online' : 'direct', // [ online, direct ]
    checkStatus: datautils.randomBool() ? 'done' : 'cancelled', // [ done, cancelled, wait ]
    datetime: formatServerDateTime(getFutureDate(datautils.randomInt(0, 128))),
    price: getPrice(),
    paymentType: datautils.randomBool() ? 'phone_card' : 'cash', // [ cash, bank_atm, credit_card, phone_card ]
    paymentStatus: datautils.randomBool() ? 'done' : 'wait', // [ done, wait ]
    isCancel: datautils.randomBool() ? true : false,
    log_chat: [],
    log_videos: [],
  };
}
