import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import validations from "./validation.js";

export const createUser = async (
  firstName,
  lastName,
  password,
  email,
  role
) => {
  validations.checkString(firstName);
  validations.checkString(lastName);
  validations.checkString(password);
  validations.checkString(role);
  validations.checkString(email);

  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();

  const user = {
    firstName,
    lastName,
    email,
    password,
    role,
  };

  const usercollection = await users();
  const result = await usercollection.insertOne(user);
  const insertedId = result.insertedId;

  const insertedUser = await usercollection.findOne({ _id: insertedId });
  const end_user = {
    _id: insertedUser._id.toString(),
    firstName: insertedUser.firstName,
    lastName: insertedUser.lastName,
    password: insertedUser.password,
    roles: insertedUser.roles,
    email: insertedUser.email,
  };
  return end_user;
};

export const get = async (id) => {
  validations.checkId(id);
  const usercollection = await users();
  const single_user = await usercollection.findOne({ _id: new ObjectId(id) });
  if (!single_user) {
    throw "No user is found with that id.";
  }
  single_user._id = single_user._id.toString();
  return single_user;
};

export const getAll = async () => {
  const usercollection = await users();
  const userList = await usercollection.find({}).toArray();
  if (userList.length === 0) {
    throw Error("Unable to retrieve all users.");
  }

  let finalUserList = userList.map((user) => ({
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    role: user.role,
  }));
  return finalUserList;
};
