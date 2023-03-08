/* Workflow: 
    First check if email/username exists in the db
    If it does not exist, just throw an error. Ignore the password.
    If it does exist, hash the password and verify with the entry in the database. This will be done using bcrypt.compare.
    Send user details to the frontend and the access token.
Done:
    If user does not exist, do nothing for now.
    If user does exist, check password hash.
    This is very bad code and needs to be refactored a lot. But it is boilerplate code to begin with.
 */
// The library that will do that hashing and comparison
import bcryptjs from "bcryptjs"
import { users } from "../../config/mongoCollections.js";
import {checkId, checkRole, checkLname, checkFname, checkEmail} from "../helper.js"

// Placebo function to check if user is in db
const isUserInDb = (email) => {
    if(email == "anmolzagrawal@gmail.com") {
        return true;
    }
    return false;
}

// Salt to hash password with
const salt = "$2a$10$qya34SBSGDOPVP2MFyl1xu"
const placeboPassword = "P4ssw0rd!"
// Placebo function for Validation
export const tempLogin = (email, password) => {
    const validUser = isUserInDb(email)
    // This hash was generated with the salt and placebopassword
    let tempStoredHash = "$2a$10$qya34SBSGDOPVP2MFyl1xuFotW.gjs8FrNiPwIrSbaTOXIu3eXeb."
    // Just code demonstrating how the hash was generated. TempHash is not being used anywhere.
    let tempHash = ""
    bcryptjs.hash(placeboPassword, salt, (err, hash) => {
        tempHash = hash
    })
    // Actual validation
    if(validUser) {
        bcryptjs.compare(password, tempStoredHash, (err, result) => {
            if(result) {
                console.log("Congrats. You are validated!")
            }
            else {
                console.log("Sorry, you are not registered yet!")
            }
        })
    }
}
// Just testing
tempLogin("anmolzagrawal@gmail.com", "P4ssw0rd!")

// CREATE
const create = async (firstName, lastName, password, email, roles) => {
  
  checkFname(firstName)
  checkLname(lastName);
  checkPassword(password);
  checkRole(roles);
  checkEmail(email);

  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();
  
  const user = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    roles: roles,
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

// READ ALL

const getAll = async () => {
    const usercollection = await users();
    const userList = await usercollection.find({}).toArray();
    if (userList.length === 0){
      throw "Unable to retrieve all users."
    }
  
    let finalUserList = userList.map(user=>({
      _id: user._id.toString(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      roles: roles,
    }));
    return finalUserList;
  };

  // READ

  const get = async (id) => {
    checkId(id);
    const usercollection = await users();
    const single_user = await usercollection.findOne({_id: new ObjectId(id)});
    if(!single_user){
      throw "No user is found with that id."
    }
    single_user._id = single_user._id.toString();
    return single_user;
  };

  const remove = async (id) => {
    checkId(id);
    const usercollection = await users();
    const prevUser = await usercollection.findOne({_id: new ObjectId(id)})
    
  if (prevUser === null){
    throw "The user does not exist."
  }
  const deletedUser = await bandsCollection.findOneAndDelete({_id: new ObjectId(id)})
  
  if(deletedUser.lastErrorObject.n === 0){
    throw `Could not delete the with id of ${id}`;
  }
    return `${deletedUser.value.name} has been successfully deleted!`;
  };



// exporting all functions to app.js
export {create, remove, get, getAll }
