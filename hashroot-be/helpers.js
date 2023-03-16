import { ObjectId } from "mongodb";
import { USER_ROLES } from "./constants.js";

const checkString = (strVal, varName) => {
  if (!strVal) throw new Error(`Error: You must supply a ${varName}!`);
  if (typeof strVal !== "string")
    throw new Error(`Error: ${varName} must be a string!`);
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw new Error(
      `Error: ${varName} cannot be an empty string or string with just spaces`
    );
  if (!isNaN(strVal))
    throw new Error(
      `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`
    );
  return strVal;
};

const checkPassword = (password) => {
  if (!password) {
    throw "You must provide a password for the user.";
  }
  if (typeof password !== "string") {
    throw "Password must be of type string.";
  }
  if (password.trim().length === 0) {
    throw "Password cannot be an empty string.";
  }
  if (password.length < 8) {
    throw "Password cannot be less than 8 digits.";
  }
  // Atleast one Number
  if (!/\d/.test(password)) {
    throw "Password does not have a number.";
  }
  // Atleast one special character
  const specialChars = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "-",
    "_",
    "+",
    "=",
    "[",
    "]",
    "{",
    "}",
    "|",
    "\\",
    ";",
    ":",
    "'",
    '"',
    ",",
    ".",
    "<",
    ">",
    "/",
    "?",
  ];
  let hasSpecialChar = false;
  for (let i = 0; i < password.length; i++) {
    if (specialChars.includes(password.charAt(i))) {
      hasSpecialChar = true;
    }
  }
  if (!hasSpecialChar) {
    throw "Password must have special characters included.";
  }
  let hasUpperCase = false;
  for (let i = 0; i < password.length; i++) {
    if (password.charAt(i) === password.charAt(i).toUpperCase()) {
      hasUpperCase = true;
    }
  }
  if (!hasSpecialChar) {
    throw "Password must have upper case.";
  }
  return password;
};

const checkRole = (role) => {
  checkString(role);
  const validRoles = Object.values(USER_ROLES);

  if (!validRoles.includes(role)) {
    throw new Error(
      `Invalid role: ${role}. Valid roles are: ${validRoles.join(", ")}.`
    );
  }
};

const checkRolesArray = (roles) => {
  return roles.map((role) => {
    checkRole(role);
    return role.trim();
  });
};

// checkId function checks whether the id parameter is provided, of type string and is not an empty string.
const checkId = (id) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== "string") throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
};

const checkEmail = (email) => {
  checkString(email, "Email");
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.match(validRegex)) {
    throw "Invalid email address!";
  }
  return email;
};

const checkObject = (obj, varName) => {
  if (typeof obj !== "object" || Array.isArray(obj) || obj === null) {
    throw `Error: ${varName} is not an object`;
  }
  if (!Object.keys(obj).length) {
    throw `Error: ${varName} object is empty`;
  }
};

export {
  checkId,
  checkRole,
  checkRolesArray,
  checkEmail,
  checkPassword,
  checkString,
  checkObject,
};
