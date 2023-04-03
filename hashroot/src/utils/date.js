export const displayDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const daysRemaining = (startDate, endDate, opts = {}) => {
  const { excludeEndDate = false } = opts;
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  const timeDiff = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return excludeEndDate ? diffDays - 1 : diffDays;
};
