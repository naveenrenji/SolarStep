import { USER_ROLES } from "../../constants.js";
import { userData } from "../../data/index.js";

describe("userData.loginUser", () => {
  let user, createdUser;
  beforeAll(async () => {
    createdUser = await userData.createUser(
      "Test",
      "User",
      "Abcd@1234",
      "test@ss.com",
      USER_ROLES.ADMIN,
      { _id: 0 }
    );
  });

  it("should throw error if email is not provided", async () => {
    try {
      user = await userData.loginUser("", "Abcd@123");
    } catch (error) {
      expect(user).not.toBeNull();
      expect(error.toString()).toBe("Error: Error: You must supply a Email!");
    }
  });

  it("should throw error if password is not provided", async () => {
    try {
      user = await userData.loginUser("test@ss.com", "");
    } catch (error) {
      expect(user).not.toBeNull();
      expect(error.toString()).toBe(
        "You must provide a password for the user."
      );
    }
  });

  it("should throw error if password is not correct", async () => {
    try {
      user = await userData.loginUser("test@ss.com", "Abcd@123");
    } catch (error) {
      expect(user).not.toBeNull();
      expect(error.toString()).toBe("Password provided is invalid.");
    }
  });

  it("should throw error if email is not correct", async () => {
    try {
      user = await userData.loginUser("test1234@ss.com", "Abcd@123");
    } catch (error) {
      expect(user).not.toBeNull();
      expect(error.toString()).toBe("Either the email or password is invalid.");
    }
  });

  it("should return user object if email and password is correct", async () => {
    user = await userData.loginUser("test@ss.com", "Abcd@1234");
    expect(user).not.toBeNull();

    expect(user).toHaveProperty("accessToken");
    expect(user.accessToken).not.toBeNull();
    expect(user.accessToken).not.toBe("");

    expect(user).toHaveProperty("_id");
    expect(user._id).toBe(createdUser._id);

    expect(user).toHaveProperty("email");
    expect(user.email).toBe("test@ss.com");

    expect(user).toHaveProperty("firstName");
    expect(user.firstName).toBe("Test");

    expect(user).toHaveProperty("lastName");
    expect(user.lastName).toBe("User");
    
    expect(user).toHaveProperty("role");
    expect(user.role).toBe(USER_ROLES.ADMIN);
  });
});
