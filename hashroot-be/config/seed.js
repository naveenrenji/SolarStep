import { USER_ROLES } from "../constants.js";
import { projectsData, userData } from "../data/index.js";

let admin, salesRep, customer;

try {
  console.log("Creating Admin User!");
  admin = await userData.createUser(
    "Admin",
    "SS",
    "Password@123",
    "admin@solarstep.com",
    USER_ROLES.ADMIN,
    { _id: 0 }
  );
  console.log("Admin User Created!", {
    email: "admin@solarstep.com",
    password: "Password@123",
  });
} catch (error) {
  console.log("Could not create admin user", error);
}

try {
  console.log("Creating Sales Rep");
  salesRep = await userData.createUser(
    "SalesRep",
    "SS",
    "Password@123",
    "salesrep@solarstep.com",
    USER_ROLES.SALES_REP,
    admin
  );
  console.log("Sales Rep Created!", {
    email: "salesrep@solarstep.com",
    password: "Password@123",
  });
} catch (error) {
  console.log("Could not create sales rep", error);
}

try {
  console.log("Creating Customer");
  customer = await userData.createUser(
    "Customer",
    "SS",
    "Password@123",
    "customer@solarstep.com",
    USER_ROLES.CUSTOMER,
    salesRep
  );
  console.log("Customer Created!", {
    email: "customer@solarstep.com",
    password: "Password@123",
  });
} catch (error) {
  console.log("Could not create customer", error);
}

try {
  console.log("Creating GC");
  await userData.createUser(
    "General Contractor",
    "SS",
    "Password@123",
    "gc@solarstep.com",
    USER_ROLES.GENERAL_CONTRACTOR,
    salesRep
  );
  console.log("GC Created!", {
    email: "gc@solarstep.com",
    password: "Password@123",
  });
} catch (error) {
  console.log("Could not create GC", error);
}

try {
  console.log("Creating Worker");
  await userData.createUser(
    "Worker",
    "SS",
    "Password@123",
    "worker@solarstep.com",
    USER_ROLES.WORKER,
    salesRep
  );
  console.log("Worker Created!", {
    email: "worker@solarstep.com",
    password: "Password@123",
  });
} catch (error) {
  console.log("Could not create worker", error);
}

try {
  console.log("Creating Project");
  await projectsData.createProject(
    admin,
    customer._id.toString(),
    salesRep._id.toString(),
    "Agile Project",
    {
      streetAddress: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    }
  );
  console.log("Project Created");
} catch (error) {
  console.log("Could not create project", error);
}
