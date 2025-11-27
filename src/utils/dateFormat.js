export const dateFormat = (currentDate, number) => {
  if (currentDate) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + number);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  return null;
};
