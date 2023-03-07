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

const checkRole = (roles) => {
  if(!roles || !Array.isArray(roles)){
    throw "You must provide an array of Roles."
  }
  
  if(roles.length === 0){
    throw "You must provide at least one Role."
  }
  
  for(let i in roles){
    if(typeof(roles[i]) !== "string" || roles[i].trim().length === 0){
      throw "One or more role is not a string or is an empty string."
    }
    roles[i] = roles[i].trim(); 
  }
  const validRoles = ['Admin', 'Customer', 'SalesRep', 'GeneralContractor', 'Worker'];

    if (!Array.isArray(roles)) {
      throw new Error('Roles must be an array.');
    }
  
    for (let i = 0; i < roles.length; i++) {
      if (!validRoles.includes(roles[i])) {
        throw new Error(`Invalid role: ${roles[i]}. Valid roles are: ${validRoles.join(', ')}.`);
      }
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

  const checkEmail = (email) => {

    if(!email){
      throw "Email does not exist."
    }

    if(typeof(email) !== "string"){
      throw "The email is not of type string."
    }
    email = email.trim()
    if(email.length === 0){
      throw "Email cannot be empty."
    }
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!(email.match(validRegex))) {
      throw("Valid email address!");  
    }
  }

export {checkId, checkRole, checkName, checkEmail}