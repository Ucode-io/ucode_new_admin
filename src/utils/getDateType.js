const getFirstDayOfMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const getFirstDayOfNextMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
};

export const FromDateType = (date, currentUpdatedDate, firstUpdatedDate) => {
  switch (true) {
    case date === "DAY":
      return currentUpdatedDate;
    case date === "WEEK":
      return firstUpdatedDate;
    case date === "MONTH":
      return getFirstDayOfMonth(new Date(currentUpdatedDate));
    default:
      return currentUpdatedDate;
  }
};

export const ToDateType = (date, tomorrow, lastUpdatedDate) => {
  switch (true) {
    case date === "DAY":
      return tomorrow;
    case date === "WEEK":
      return lastUpdatedDate;
    case date === "MONTH":
      return getFirstDayOfNextMonth(new Date(tomorrow));
    default:
      return tomorrow;
  }
};
