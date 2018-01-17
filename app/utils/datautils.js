/**
 * @providesModule TeleMedicine.utils.datautils
 */

const moment = require('moment');

///
/// RANDOMIZATION
///

export const ALPHABET_LOWER = 'abcdefghijklmnopqrstuvwxyz';
export const ALPHABET_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const ALPHABET_ALL = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ';
export const DIGIT = '0123456789';


/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/** Get a random boolean value */
export function randomBool() {
  return Math.random() > 0.5;
}

/** Get a random string from base chars */
export function randomStr(length, baseChars = ALPHABET_ALL) {
  let result = '';
  for (let idx = 0; idx < length; idx += 1) {
    result += baseChars[randomInt(0, baseChars.length)];
  }
  return result;
}

/**
 * Chooses a random item from an array
 */
export function randomArrayItem(array) {
  return array[randomInt(0, array.length)];
}


///
/// DATETIME
///

export const WEEKDAY_EN_SHORT = {
  0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat',
};

export const WEEKDAY_EN_LONG = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday',
};

export const WEEKDAY_VI_SHORT = {
  0: 'Chủ Nhật', 1: 'Thứ 2', 2: 'Thứ 3', 3: 'Thứ 4', 4: 'Thứ 5', 5: 'Thứ 6', 6: 'Thứ 7',
};

export const WEEKDAY_VI_LONG = {
  0: 'Chủ Nhật', 1: 'Thứ hai', 2: 'Thứ ba', 3: 'Thứ tư', 4: 'Thứ năm', 5: 'Thứ sáu', 6: 'Thứ bảy',
};


/**
 * Format a date time
 * Date object -> Display string
 */
export function formatDateTime(date, pattern) {
  return moment(date).format(pattern);
}

/**
 * Parse a date time
 * Date time string -> Date object
 */
export function parseDateTime(dateStr, pattern) {
  return moment(dateStr, pattern).toDate();
}

/**
 * Get weekday for a date
 * Return value from 0 -> 6 (Sunday is 0)
 */
export function getWeekDay(date) {
  return date.getDay();
}

/**
 * Get weekday string for a date in English
 * Return string value like Sun, Mon, ...
 */
export function getWeekDayENShort(date) {
  return WEEKDAY_EN_SHORT[date.getDay()];
}

/**
 * Get weekday string for a date in English
 * Return string value like Sunday, Monday, ...
 */
export function getWeekDayENLong(date) {
  return WEEKDAY_EN_LONG[date.getDay()];
}

/**
 * Get weekday string for a date in Vietnamese
 * Return string value like Thu 2, Thu 3, ...
 */
export function getWeekDayVIShort(date) {
  return WEEKDAY_VI_SHORT[date.getDay()];
}

/**
 * Get weekday string for a date in Vietnamese
 * Return string value like Thu hai, Thu ba, ...
 */
export function getWeekDayVILong(date) {
  return WEEKDAY_VI_LONG[date.getDay()];
}


/**
 * Get tommorrow of a date
 */
export function getTomorrowOf(date) {
  return moment(date).add(1, 'days').toDate();
}

/**
 * Get yesterday of a date
 */
export function getYesterdayOf(date) {
  return moment(date).subtract(1, 'days').toDate();
}

/**
 * Check if two dates are equal by date
 */
export function dateEqual(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

/**
 * Check if two dates are equal by hour
 */
export function hourEqual(date1, date2) {
  return date1.getHours() === date2.getHours();
}

/**
 * Check if two dates are equal by hour and minute
 */
export function hourMinEqual(date1, date2) {
  return date1.getHours() === date2.getHours() &&
    date1.getMinutes() === date2.getMinutes();
}

/**
 * Calculate diff of two dates by days, hours, minutes
 * Eg. for input date1=17-07-2017 13:30, date2=19-07-2017 14:40 ->
 * return [ 2, 1, 10 ] that means diff is 2 days, 1 hour, 10 minutes
 */
export function dayHourMinDiff(date1, date2) {
  let diff = moment(date1).diff(date2, 'minutes');
  const inPast = diff < 0;
  diff = Math.abs(diff);

  const diffdays = Math.floor(diff / (24 * 60));
  diff = diff - diffdays * (24 * 60);
  const diffhours = Math.floor(diff / 60);
  diff = diff - diffhours * 60;
  const diffmins = Math.floor(diff);

  return inPast ? [-diffdays, -diffhours, -diffmins] : [diffdays, diffhours, diffmins];
}


///
/// NUMBERS
///

/**
 * Format a number to string
 * Eg. for input 12345.01, return 12,345.01
 */
export function decimalFormat(x, groupDelim = ",") {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, groupDelim);
}
