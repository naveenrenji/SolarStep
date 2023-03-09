import { USER_ROLES } from "../constants";

export const getCreateUserRoleList = (role) => {
  if (!role || [USER_ROLES.CUSTOMER, USER_ROLES.WORKER].includes(role)) {
    return [];
  }

  switch (role) {
    case USER_ROLES.ADMIN:
      return Object.values(USER_ROLES);
    case USER_ROLES.SALES_REP:
      return [USER_ROLES.CUSTOMER];
    case USER_ROLES.GENERAL_CONTRACTOR:
      return [USER_ROLES.WORKER];

    default:
      return [];
  }
};
