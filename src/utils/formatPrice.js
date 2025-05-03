const formatPrice = (amount) => {
  if (!amount) return '0 ₫';

  try {
    // Convert to number if string
    const numericAmount =
      typeof amount === 'string'
        ? parseFloat(amount.replace(/[^0-9.-]+/g, ''))
        : amount;

    // Check if valid number
    if (isNaN(numericAmount)) {
      return '0 ₫';
    }

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  } catch (error) {
    console.warn('Price formatting error:', error);
    return '0 ₫';
  }
};

export default formatPrice;
