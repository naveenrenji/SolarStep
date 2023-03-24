import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { checkId } from "../helpers.js";
import { hashPassword } from "./users.js"


const updateUserById = async (id, updates) => {
    checkId(id);
    const userCollection = await users();
    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          firstName: updates.firstName,
          lastName: updates.lastName,
          password: await hashPassword(updates.password),
        },
      }
    );
  
    if (result.modifiedCount === 0) {
      throw new Error(`Could not update user with id of ${id}.`);
    }
  
    return `${result.modifiedCount} user has been successfully updated!`;
  };