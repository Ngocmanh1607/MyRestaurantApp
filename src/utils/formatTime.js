const formatTime = (dateStr) => {
    if (!dateStr) return "Invalid Date";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";

    const dateOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    return date.toLocaleString('vi-VN', dateOptions);
};
export default formatTime;