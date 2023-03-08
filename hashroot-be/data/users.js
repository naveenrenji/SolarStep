import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import {
  checkId,
  checkRole,
  checkLname,
  checkFname,
  checkEmail,
  checkPassword,
} from "../helpers.js";
import { users } from "../config/mongoCollections.js";

const SALT_ROUNDS = 10;

export const userWithEmail = async (email) => {
  const user = await getUserByEmail(email);
  if (user === null) throw "Either the email or password is invalid";
  user._id = user._id.toString();
  return user;
};

const getUserByEmail = async (email) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ email });
  return user;
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const createUser = async (firstName, lastName, password, email, role) => {
  checkFname(firstName);
  checkLname(lastName);
  checkPassword(password);
  checkRole(role);
  checkEmail(email);
  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();
  if (getUserByEmail(email)) {
    throw new Error("User already exists");
  }
  const hashedPassword = await hashPassword(password);
  const user = { firstName, lastName, email, password: hashedPassword, role };
  const userCollection = await users();
  const result = await userCollection.insertOne(user);
  const insertedId = result.insertedId;
  const insertedUser = await userCollection.findOne({ _id: insertedId });
  const endUser = {
    _id: insertedUser._id.toString(),
    firstName: insertedUser.firstName,
    lastName: insertedUser.lastName,
    role: insertedUser.role,
    email: insertedUser.email,
  };
  return endUser;
};

const getAllUsers = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  if (userList.length === 0) {
    throw new Error("Unable to retrieve all users.");
  }
  const finalUserList = userList.map((user) => ({
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    role: user.role,
  }));
  return finalUserList;
};

const getUserById = async (id) => {
  checkId(id);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(id) });

  if (!user) {
    throw new Error("No user found with that id.");
  }
  user._id = user._id.toString();
  return user;
};

const deleteUserById = async (id) => {
  checkId(id);
  const userCollection = await users();
  const user = await userCollection.findOneAndDelete({ _id: new ObjectId(id) });

  if (!user.value) {
    throw new Error(`Could not delete user with id of ${id}.`);
  }

  return `${user.value.firstName} has been successfully deleted!`;
};

const loginUser = async (email, password) => {
  email = checkEmail(email);
  password = checkPassword(password);
  const user = await userWithEmail(email);
  let realPassword = user.password;
  let compareToMatch = await bcrypt.compare(password, realPassword);
  if (compareToMatch) {
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      accessToken: jwt.sign({ id: user._id, email: user.email }, "secret"),
    };
  } else {
    throw "Either the email or password is invalid";
  }
};

export { deleteUserById, getUserById, getAllUsers, createUser, loginUser };
