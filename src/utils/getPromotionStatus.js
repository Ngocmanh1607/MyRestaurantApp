export const getPromotionStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return 'UPCOMING'; // Sắp tới
  } else if (now > end) {
    return 'EXPIRED'; // Đã hết hạn
  } else {
    return 'ACTIVE'; // Đang hoạt động
  }
};
