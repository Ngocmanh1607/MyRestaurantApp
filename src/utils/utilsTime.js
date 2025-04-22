import dayjs from 'dayjs';
import 'dayjs/locale/vi';
const getStartOfWeek = (inputDate) => {
  const startOfWeek = new Date(inputDate);
  const dayOfWeek = startOfWeek.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0); // Đặt về đầu ngày
  return startOfWeek;
};

const getEndOfWeek = (startOfWeek) => {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};

const checkDateInCurrentWeek = (date) => {
  const now = new Date();
  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = getEndOfWeek(startOfWeek);
  const dateToCheck = new Date(date);
  return dateToCheck >= startOfWeek && dateToCheck <= endOfWeek;
};
const checkDateInMonth = (dateToCheck) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const date = new Date(dateToCheck);
  return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
};
const getWeekOfMonth = (dateToCheck) => {
  const date = new Date(dateToCheck);

  // Lấy ngày đầu tiên của tháng
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  // Tính số ngày đã trôi qua từ đầu tháng
  const dayOfMonth = date.getDate();
  // Tính khoảng cách từ ngày đầu tiên của tháng đến ngày cần kiểm tra
  const offset = startOfMonth.getDay(); // Thứ của ngày đầu tiên trong tháng (0: Chủ Nhật, 1: Thứ Hai, ...)

  // Tính tuần trong tháng (Math.ceil để làm tròn lên)
  const weekNumber = Math.floor((dayOfMonth + offset) / 7);

  return weekNumber;
};
// Format date-time for display
const formatDateTimeForDisplay = (dateTimeString) => {
  if (!dateTimeString) return '';

  // Handle different date formats
  let dateTime;
  try {
    if (dateTimeString.includes('/')) {
      // DD/MM/YYYY HH:MM format
      const [datePart, timePart = '00:00'] = dateTimeString.split(' ');
      const [day, month, year] = datePart.split('/');
      dateTime = dayjs(`${year}-${month}-${day} ${timePart}`);
    } else if (dateTimeString.includes('-')) {
      // YYYY-MM-DD HH:MM:SS format
      dateTime = dayjs(dateTimeString);
    } else {
      return dateTimeString; // Return as is if format not recognized
    }

    return dateTime.format('DD/MM/YYYY HH:mm');
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateTimeString;
  }
};

// Format date-time for API
const formatDateTimeForAPI = (dateTimeString) => {
  if (!dateTimeString) return '';

  try {
    // Convert from DD/MM/YYYY HH:MM to YYYY-MM-DD HH:MM:SS
    if (dateTimeString.includes('/')) {
      const [datePart, timePart = '00:00'] = dateTimeString.split(' ');
      const [day, month, year] = datePart.split('/');
      return `${year}-${month}-${day}T${timePart}:00`;
    }

    return dateTimeString;
  } catch (error) {
    console.error('Error formatting date time for API:', error);
    return dateTimeString;
  }
};
const isFutureDateTime = (dateTimeString) => {
  if (!dateTimeString) return false;

  try {
    const dateTime = new Date(dateTimeString);
    const now = new Date();
    return dateTime > now;
  } catch (error) {
    console.error('Error checking if date time is in the future:', error);
    return false;
  }
};
export {
  checkDateInCurrentWeek,
  checkDateInMonth,
  getWeekOfMonth,
  formatDateTimeForDisplay,
  formatDateTimeForAPI,
  isFutureDateTime,
};
