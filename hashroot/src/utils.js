import { PROJECT_STATUSES } from "./constants";

export const getFromStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return;
  }
};

export const setToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const clearFromStorage = (key) => {
  localStorage.removeItem(key);
};

export const getProgressBarPercentage = (status) => {
  const projectStatuses = Object.values(PROJECT_STATUSES);
  const idx = projectStatuses.indexOf(status);
  if (idx === -1) return 0;

  return Math.ceil(((idx + 1) / projectStatuses.length) * 100);
};
