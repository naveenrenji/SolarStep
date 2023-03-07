import { ObjectId } from "mongodb";

const checkName = (name) => {
    if (!name) {
      throw "You must provide a name for the user.";
    }
    if (typeof name !== "string") {
      throw "Name must be of type string.";
    }
    if (name.trim().length === 0) {
      throw "Name cannot be an empty string.";
    }
  };
  
  // checkAge function checks whether the age parameter is provided and is of type number and not equal to zero.
  const checkAge = (age) => {
    if (age === 0) {
      throw "Age cannot be zero.";
    }
    if (typeof age !== "number") {
      throw "Age must be of type number.";
    }
  };
  
  // checkOrganization function checks whether the organization parameter is provided, of type string and is not an empty string.
  const checkOrganization = (organization) => {
    if (!organization) {
      throw "You must provide an organization for the user.";
    }
    if (typeof organization !== "string") {
      throw "Organization must be of type string.";
    }
    if (organization.trim().length === 0) {
      throw "Organization cannot be an empty string.";
    }
  };
  
  // checkId function checks whether the id parameter is provided, of type string and is not an empty string.
  const checkId = (id) => {
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
  };

  const validateNewName = (newName) => {
    if(!newName){
      throw "You must provide a name for the band."
    }
    if(typeof(newName) !== "string"){
      throw "Name must be of type string."
    }
    if(newName.trim().length === 0){
      throw "name cannot be an empty string."
    }
  };

export {validateNewName, checkId, checkOrganization, checkName, checkAge}