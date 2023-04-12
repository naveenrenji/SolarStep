import { PROJECT_STATUSES, USER_ROLES } from "../constants.js";
import * as helpers from "../helpers.js";

describe("checkProjectStatus", () => {
  it("should throw an error if status is not a string", () => {
    expect(() => helpers.checkProjectStatus(123)).toThrow(
      "Error: Project Status must be a string!"
    );
  });

  it("should throw an error if status is empty", () => {
    expect(() => helpers.checkProjectStatus("")).toThrow(
      "Error: You must supply a Project Status!"
    );
  });

  it("should throw an error if status is not a valid status", () => {
    expect(() => helpers.checkProjectStatus("invalid")).toThrow(
      "Invalid Project Status"
    );
  });

  it("should return the status if valid", () => {
    expect(helpers.checkProjectStatus(PROJECT_STATUSES.CREATED)).toBe(
      PROJECT_STATUSES.CREATED
    );
  });
});

describe("canViewProject", () => {
  it("should return false if currentUser is undefined", () => {
    expect(helpers.canViewProject(undefined, {})).toBe(false);
  });

  it("should return true if currentUser is admin", () => {
    expect(
      helpers.canViewProject(
        {
          role: USER_ROLES.ADMIN,
        },
        {}
      )
    ).toBe(true);
  });

  it("should return true if currentUser is sales rep and currentUser's ID matches project's sales rep ID", () => {
    expect(
      helpers.canViewProject(
        {
          role: USER_ROLES.SALES_REP,
          _id: "123",
        },
        {
          salesRep: {
            _id: "123",
          },
        }
      )
    ).toBe(true);
  });

  it("should return false if currentUser is sales rep and currentUser's ID does not match project's sales rep ID", () => {
    expect(
      helpers.canViewProject(
        {
          role: USER_ROLES.SALES_REP,
          _id: "123",
        },
        {
          salesRep: {
            _id: "456",
          },
        }
      )
    ).toBe(false);
  });

  it("should return true if currentUser is general contractor and currentUser's ID matches project's general contractor ID", () => {
    expect(
      helpers.canViewProject(
        {
          role: USER_ROLES.GENERAL_CONTRACTOR,
          _id: "123",
        },
        {
          generalContractor: {
            _id: "123",
          },
        }
      )
    ).toBe(true);
  });

  it("should return false if currentUser is general contractor and currentUser's ID does not match project's general contractor ID", () => {
    expect(
      helpers.canViewProject(
        {
          role: USER_ROLES.GENERAL_CONTRACTOR,
          _id: "123",
        },
        {
          generalContractor: {
            _id: "456",
          },
        }
      )
    ).toBe(false);
  });

  it("should return true if currentUser is worker and currentUser's ID matches a worker's ID in project's workers array", () => {
    expect(
      helpers.canViewProject(
        {
          role: USER_ROLES.WORKER,
          _id: "123",
        },
        {
          workers: [
            {
              _id: "123",
            },
          ],
        }
      )
    ).toBe(true);
  });

  it("should return false if currentUser is worker and currentUser's ID does not match a worker's ID in project's workers array", () => {
    expect(
      helpers.canViewProject(
        {
          role: USER_ROLES.WORKER,
          _id: "123",
        },
        {
          workers: [
            {
              _id: "456",
            },
          ],
        }
      )
    ).toBe(false);
  });
});

describe("checkString", () => {
  it("should throw an error if string is not a string", () => {
    expect(() => helpers.checkString(123, "Input")).toThrow(
      "Error: Input must be a string!"
    );
  });

  it("should throw an error if string is empty", () => {
    expect(() => helpers.checkString("", "string")).toThrow(
      "Error: You must supply a string!"
    );
  });

  it("should return the string if valid", () => {
    expect(helpers.checkString("test")).toBe("test");
  });
});
