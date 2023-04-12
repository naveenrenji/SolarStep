import { profileData } from "../../data/index.js";

describe("updateUserById", () => {
  it("should throw error when user _id is empty", async () => {
    try {
      await profileData.updateUserById({}, { firstName: "Test" });
    } catch (error) {
      expect(error.toString()).toBe("Error: You must provide a userId");
    }
  });
});
