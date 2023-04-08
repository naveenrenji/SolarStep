import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { checkId, checkPassword, checkString } from "../helpers.js";
import { comparePasswords, hashPassword } from "./users.js";


// The function to update the user details. user is the user object and updates is the update object containing firstName, lastName, oldPassword and newPassword
const updateUserById = async (user, updates) => {
  checkId(user._id);
  // Set 4 variables taking values from updates.
  const { firstName, lastName, oldPassword, newPassword } = updates;
  checkString(firstName, "firstName");
  checkString(lastName, "lastName");
  if ((newPassword && !oldPassword) || (oldPassword && !newPassword)) {
    throw new Error("Old and New passwords are required together.");
  }
  const userToUpdate = { firstName, lastName };
  if (newPassword && oldPassword) {
    let compareToMatch = await comparePasswords(oldPassword, user.password);
    let compareNewPassword = await comparePasswords(newPassword, user.password);
    if (compareNewPassword) {
      throw new Error("New and Old passwords are the same");
    }
    if (compareToMatch) {
      checkPassword(newPassword);
      userToUpdate.password = await hashPassword(newPassword);
    } else {
      throw new Error("Incorrect Password entered");
    }
  }
  const userCollection = await users();
  userCollection.updateOne()
  const result = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(user._id) },
    {
      $set: userToUpdate,
    },
    { returnDocument: "after" }
  );

  if (result.lastErrorObject.n === 0) {
    throw new Error(`Could not update user with id of ${user._id}.`);
  }

  result.value._id = result.value._id.toString();
  return {
    _id: result.value._id,
    firstName: result.value.firstName,
    lastName: result.value.lastName,
  };
};

export { updateUserById };
