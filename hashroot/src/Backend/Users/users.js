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

// Placebo function to check if user is in db
const isUserInDb = (email) => {
    if(email == "anmolzagrawal@gmail.com") {
        return true
    }
    return false
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