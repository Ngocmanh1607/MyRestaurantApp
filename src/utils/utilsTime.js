const getStartOfWeek = (inputDate) => {
    const startOfWeek = new Date(inputDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    return startOfWeek;
};

const getEndOfWeek = (startOfWeek) => {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
};

const checkDateInCurrentWeek = (date) => {
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const endOfWeek = getEndOfWeek(startOfWeek);
    const dateToCheck = new Date(date);
    return dateToCheck >= startOfWeek && dateToCheck <= endOfWeek;
};

export { checkDateInCurrentWeek };