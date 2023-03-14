import { USER_ROLES } from "../constants.js";
import { userData } from "../data/index.js";

try {
  console.log("Creating Admin User!");
  await userData.createUser(
    "Admin",
    "SS",
    "Password@123",
    "admin@solarstep.com",
    USER_ROLES.ADMIN
  );
  console.log("Admin User Created!", {
    email: "admin@solarstep.com",
    password: "Password@123",
  });
} catch (error) {
  console.log("Could not create admin user", e);
}
