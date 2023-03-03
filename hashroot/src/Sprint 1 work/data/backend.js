import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

// database crud operations

// CREATE
const create = async (name, age, organization) => {
  if (!name) {
    throw "You must provide a name for the band.";
  }

  if (typeof name !== "string") {
    throw "Name must be of type string.";
  }
  if (name.trim().length === 0) {
    throw "name cannot be an empty string.";
  }

  

  if (!organization) {
    throw "You must provide an organization for the user.";
   

  if (typeof organization !== "string") {
    throw "Organization must be of type string.";
  }

  if (organization.trim().length === 0) {
    throw "Organization cannot be an empty string.";
  }

 
  if (age === 0) {
    throw "Year cannot be zero.";
  }

  if (typeof age !== "number") {
    throw "The age the should be of type number.";
  }

  name = name.trim();
  organization = organization.trim();

  const user = {
    name: name,
    age: age,
    website: website,
    organization: organization,
  };

  user.age = age;

  const usercollection = await users();
  const result = await usercollection.insertOne(user);
  const insertedId = result.insertedId;

  const insertedBand = await bandsCollection.findOne({ _id: insertedId });
  const end_user = {
    _id: insertedBand._id.toString(),
    name: insertedBand.name,
    age: insertedBand.age,
    organization: insertedBand.organization,
  };
  return finaldBand;
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
      name: user.name,
      age: user.age,
      organization: band.organization,
    }));
    return finalUserList;
  };

  // READ

  const get = async (id) => {
    if (!id){
      throw "id parameter is empty or not passed."
    }
  
    if(typeof(id) !== "string"){
      throw "Id must be a string."
    }
  
    id = id.trim()
  
    if(id.length === 0){
      throw "id cannot be empty."
    }
  
    if(!(ObjectId.isValid(id))){
      throw "invalid object ID.";
    } 
    
    const usercollection = await users();
    const single_user = await usercollection.findOne({_id: new ObjectId(id)});
    if(!single_user){
      throw "No user is found with that id."
    }
    single_user._id = single_user._id.toString();
    return single_user;
  };

  const remove = async (id) => {

    if (!id){
      throw "id parameter is empty or not passed."
    }
  
    if(typeof(id) !== "string"){
      throw "Id must be a string."
    }
    id = id.trim()
    if(id.length === 0){
      throw "id cannot be empty."
    }
  
    if(!ObjectId.isValid(id)){
      throw "invalid object ID.";
    } 
    
  
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

const rename = async (id, newName) => {
  if(!id){
    throw "You must provide an id to search for."
  }

  if(typeof(id) !== 'string'){
    throw "ID must be of type string."
  }

  if(id.trim().length === 0){
    throw "ID parameter cannot be empty."
  }

  if(!ObjectId.isValid(id)){
    throw "Invalid ID is provided."
  }

  if(!newName){
    throw "You must provide a name for the band."
  }
  if(typeof(newName) !== "string"){
    throw "Name must be of type string."
  }
  if(newName.trim().length === 0){
    throw "name cannot be an empty string."
  }

  id = id.trim()
  newName = newName.trim()

  const bandsCollection = await bands();
  const prevBand = await bandsCollection.findOne({_id: new ObjectId(id) }) 
  
  if (!prevBand){
    throw "The band does not exist."
  }
  const newBand = await bandsCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {$set: {name: newName}},
    {returnDocument: false}
  ); 
  if(newBand.lastErrorObject.n === 0){
    throw `Could not rename the object with the id ${id}`;
  }
  const final = await get(id);
  return final;
};

// exporting all functions to app.js
export {create, remove, get, getAll }