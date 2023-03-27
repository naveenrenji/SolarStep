import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import {
  checkId,
  checkRole,
  checkEmail,
  checkPassword,
  checkString,
  checkRolesArray,
  checkObject,
} from "../helpers.js";
import { users } from "../config/mongoCollections.js";
import { USER_ROLES, PAGE_LIMIT } from "../constants.js";

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

const createUser = async (
  firstName,
  lastName,
  password,
  email,
  role,
  createdBy
) => {
  checkString(firstName, "First name");
  checkString(lastName, "Last name");
  checkPassword(password);
  checkRole(role);
  checkEmail(email);
  checkObject(createdBy);

  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();
  if (await getUserByEmail(email)) {
    throw new Error("User already exists");
  }
  const hashedPassword = await hashPassword(password);
  const user = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    createdById: createdBy._id,
    createdAt: new Date(),
  };
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

const getPaginatedUsers = async (currentUser, page, search, roles) => {
  if (!currentUser) throw "User not logged in";

  if (roles && roles.length) {
    checkRolesArray(roles);
  }

  page = parseInt(page || 1);
  let limit = PAGE_LIMIT;
  let skip = (page - 1) * limit;
  const findQuery = {};
  if ([USER_ROLES.GENERAL_CONTRACTOR].includes(currentUser.role)) {
    findQuery.createdById = currentUser._id;
  }

  if (roles?.length && !search) {
    findQuery.role = { $in: roles };
  } else if (search) {
    const textRegex = new RegExp(search, "i");
    findQuery["$and"] = [
      {
        $or: [
          { email: textRegex },
          { firstName: textRegex },
          { lastName: textRegex },
        ],
      },
    ];
    if (roles?.length) {
      findQuery["$and"].push({ role: { $in: roles } });
    }
  }

  const userCollection = await users();

  const aggregateRes = userCollection.aggregate([
    { $match: findQuery },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          //{ $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ], // add projection here wish you re-shape the docs
      },
    },
  ]);

  let res;
  for await (const doc of aggregateRes) {
    res = doc;
  }

  if (!res) throw "Could not get all users";
  res.data.forEach((element) => {
    element._id = element._id.toString();
    element.canEdit =
      currentUser.role === USER_ROLES.ADMIN ||
      user.createdById === currentUser._id;
  });
  return {
    users: res.data,
    totalPages: Math.ceil((res.metadata[0]?.total || 0) / limit),
  };
};

const searchUsers = async ({ text, roles }) => {
  if (roles?.length) {
    checkRolesArray(roles);
  }
  if (text) {
    checkString(text);
  }
  const textRegex = new RegExp(text, "i");
  const userCollection = await users();
  const userList = await userCollection
    .find({
      $and: [
        { role: { $in: roles } },
        {
          $or: [
            { email: textRegex },
            { firstName: textRegex },
            { lastName: textRegex },
          ],
        },
      ],
    })
    .limit(10)
    .toArray();

  if (userList.length === 0) {
    throw new Error("Unable to retrieve all users.");
  }
  return userList.map((user) => ({
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  }));
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

export {
  deleteUserById,
  getUserById,
  getPaginatedUsers,
  createUser,
  loginUser,
  searchUsers,
};
