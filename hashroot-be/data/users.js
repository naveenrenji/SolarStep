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
import { users, projects } from "../config/mongoCollections.js";
import { USER_ROLES, PAGE_LIMIT } from "../constants.js";

const SALT_ROUNDS = 10;

const getUserObject = (
  user,
  keys = [
    "_id",
    "firstName",
    "lastName",
    "email",
    "role",
    "createdAt",
    "createdById",
  ]
) => {
  return keys.reduce((acc, key) => {
    acc[key] = key === "_id" ? user[key].toString() : user[key];
    return acc;
  }, {});
};

export const userWithEmail = async (email) => {
  const user = await getUserByEmail(email);
  if (user === null) throw "Either the email or password is invalid.";
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
  return getUserObject(insertedUser, [
    "_id",
    "email",
    "role",
    "firstName",
    "lastName",
  ]);
};

const getPaginatedUsers = async (currentUser, page, search, roles) => {
  if (!currentUser) throw "User not logged in";

  if (roles && roles.length) {
    checkRolesArray(roles);
  }

  page = parseInt(page || 1);
  let limit = PAGE_LIMIT;
  let skip = (page - 1) * limit;
  const matchQuery = {};
  const userSpecificQuery = {};
  if ([USER_ROLES.GENERAL_CONTRACTOR].includes(currentUser.role)) {
    userSpecificQuery.createdById = currentUser._id;
  }
  const rolesQuery = {};
  if (roles?.length) {
    rolesQuery.role = { $in: roles };
  }
  const searchQuery = {};
  if (search) {
    const textRegex = new RegExp(search, "i");
    searchQuery["$or"] = [
      { email: textRegex },
      { firstName: textRegex },
      { lastName: textRegex },
    ];
  }

  if (
    Object.keys(userSpecificQuery).length ||
    Object.keys(rolesQuery).length ||
    Object.keys(searchQuery).length
  ) {
    matchQuery["$and"] = [];
    if (Object.keys(userSpecificQuery).length) {
      matchQuery["$and"].push(userSpecificQuery);
    }
    if (Object.keys(rolesQuery).length) {
      matchQuery["$and"].push(rolesQuery);
    }
    if (Object.keys(searchQuery).length) {
      matchQuery["$and"].push(searchQuery);
    }
  }

  const userCollection = await users();

  const aggregateRes = userCollection.aggregate([
    { $match: matchQuery },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: { createdAt: -1 } },
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

  return {
    users: res.data.map((user) => ({
      ...getUserObject(user, ["_id", "email", "role", "firstName", "lastName"]),
      canEdit:
        currentUser.role === USER_ROLES.ADMIN ||
        user.createdById === currentUser._id,
    })),
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
  return userList.map((user) =>
    getUserObject(user, ["_id", "email", "role", "firstName", "lastName"])
  );
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

const deleteUserById = async (currentUser, id) => {
  checkId(id);
  if ([USER_ROLES.CUSTOMER, USER_ROLES.WORKER].includes(currentUser.role)) {
    throw new Error("Cannot delete any user.");
  }
  const user = await getUserById(id);
  if (currentUser.role !== USER_ROLES.ADMIN) {
    if (user.role === USER_ROLES.ADMIN) {
      throw new Error("Cannot delete admin user.");
    }
    if (user.createdById !== currentUser._id) {
      throw new Error("Cannot delete user created by other user.");
    }
  }
  if (user.role !== USER_ROLES.ADMIN) {
    const projectsQuery = {};
    if (user.role === USER_ROLES.GENERAL_CONTRACTOR) {
      projectsQuery["generalContractor._id"] = new ObjectId(id);
    } else if (user.role === USER_ROLES.WORKER) {
      projectsQuery["workers._id"] = new ObjectId(id);
    } else if (user.role === USER_ROLES.SALES_REP) {
      projectsQuery["salesRep._id"] = new ObjectId(id);
    } else if (user.role === USER_ROLES.CUSTOMER) {
      projectsQuery["user._id"] = new ObjectId(id);
    }
    const projectCollection = await projects();
    const projectsCount = await projectCollection.find(projectsQuery).count();
    if (projectsCount && projectsCount > 0) {
      throw new Error("Cannot delete user with projects.");
    }
  }

  const userCollection = await users();
  const res = await userCollection.findOneAndDelete({ _id: new ObjectId(id) });

  if (!res.value) {
    throw new Error(`Could not delete user with id of ${id}.`);
  }

  return true;
};

const comparePasswords = async (enteredPassword, encryptedPassword) => {
  return await bcrypt.compare(enteredPassword, encryptedPassword)
}

const loginUser = async (email, password) => {
  email = checkEmail(email);
  password = checkPassword(password);
  const user = await userWithEmail(email);
  let realPassword = user.password;
  let compareToMatch = await comparePasswords(password, realPassword);
  if (compareToMatch) {
    return {
      ...getUserObject(user, ["_id", "email", "firstName", "lastName", "role"]),
      accessToken: jwt.sign({ id: user._id, email: user.email }, "secret"),
    };
  } else {
    throw "Either the email or password is invalid";
  }
};

const updateUserWithId = async (
  currentUser,
  id,
  firstName,
  lastName,
  oldPassword,
  newPassword
) => {
  if ([USER_ROLES.CUSTOMER, USER_ROLES.WORKER].includes(currentUser.role)) {
    throw new Error("Cannot update any user.");
  }
  id = checkId(id, "User Id");
  const user = await getUserById(id);
  if (currentUser.role !== USER_ROLES.ADMIN) {
    if (user.role === USER_ROLES.ADMIN) {
      throw new Error("Cannot update admin user.");
    }
    if (user.createdById !== currentUser._id) {
      throw new Error("Cannot update user created by other user.");
    }
  }

  firstName = checkString(firstName, "First Name");
  lastName = checkString(lastName, "Last Name");
  const updatedUserData = {
    firstName,
    lastName,
  };
  if (!oldPassword && newPassword) {
    throw new Error("Please enter old password");
  }
  if (oldPassword && !newPassword) {
    throw new Error("Please enter new password");
  }
  if (oldPassword && newPassword) {
    oldPassword = checkPassword(oldPassword);
    newPassword = checkPassword(newPassword);

    const user = await getUserById(id);
    const compareToMatch = await comparePasswords(oldPassword, user.password);
    if (!compareToMatch) {
      throw new Error("Old password is incorrect");
    }
    const newPasswordMatch = await comparePasswords(newPassword, user.password);
    if (newPasswordMatch) {
      throw new Error("New password cannot be same as old password");
    }
    updatedUserData.password = await hashPassword(newPassword);
  }
  const userCollection = await users();
  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedUserData },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n !== 1 || !updatedInfo.value) {
    throw new Error("Could not update user");
  }

  return {
    ...getUserObject(updatedInfo.value, [
      "_id",
      "email",
      "firstName",
      "lastName",
      "role",
    ]),
    canEdit:
      currentUser.role === USER_ROLES.ADMIN ||
      updatedInfo.value.createdById === currentUser._id,
  };
};

export {
  deleteUserById,
  getUserById,
  getPaginatedUsers,
  createUser,
  loginUser,
  searchUsers,
  updateUserWithId,
  hashPassword,
  comparePasswords,
};
