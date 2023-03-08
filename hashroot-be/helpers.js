import { ObjectId } from "mongodb";

const checkFname = (firstName) => {
  if (!firstName) {
    throw "You must provide a First name for the user.";
  }
  if (typeof firstName !== "string") {
    throw "First name must be of type string.";
  }
  if (firstName.trim().length === 0) {
    throw "First name cannot be an empty string.";
  }
};

const checkLname = (lastName) => {
  if (!lastName) {
    throw "You must provide a last Name for the user.";
  }
  if (typeof lastName !== "string") {
    throw "Last Name must be of type string.";
  }
  if (lastName.trim().length === 0) {
    throw "Last Name cannot be an empty string.";
  }
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
  if (password.trim().length < 8) {
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
  if (!role) {
    throw "You must provide a First name for the user.";
  }
  if (typeof role !== "string") {
    throw "First name must be of type string.";
  }
  if (role.trim().length === 0) {
    throw "First name cannot be an empty string.";
  }
  const validRoles = [
    "Admin",
    "Customer",
    "Sales Rep",
    "General Contractor",
    "Worker",
  ];

  if (!validRoles.includes(role)) {
    throw new Error(
      `Invalid role: ${roles[i]}. Valid roles are: ${validRoles.join(", ")}.`
    );
  }
};

// checkId function checks whether the id parameter is provided, of type string and is not an empty string.
const checkId = (id) => {
  if (!id) {
    throw "id parameter is empty or not passed.";
  }
  if (typeof id !== "string") {
    throw "Id must be a string.";
  }
  id = id.trim();
  if (id.length === 0) {
    throw "id cannot be empty.";
  }
  if (!ObjectId.isValid(id)) {
    throw "invalid object ID.";
  }
};

const checkEmail = (email) => {
  if (!email) {
    throw "Email does not exist.";
  }

  if (typeof email !== "string") {
    throw "The email is not of type string.";
  }
  email = email.trim();
  if (email.length === 0) {
    throw "Email cannot be empty.";
  }
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.match(validRegex)) {
    throw "Valid email address!";
  }
  return email;
};

export {
  checkId,
  checkRole,
  checkLname,
  checkFname,
  checkEmail,
  checkPassword,
};
