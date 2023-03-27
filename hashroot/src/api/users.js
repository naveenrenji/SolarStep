import http from "./http";

export const createUserApi = async (body) => {
  const { firstName, lastName, email, password, role } = body;

  const {
    data: { user },
  } = await http.post("/users", {
    firstName,
    lastName,
    email,
    password,
    role,
  });
  return user;
};

export const searchUsersApi = async (body) => {
  const { text, roles } = body;

  const {
    data: { users },
  } = await http.post("/users/search", {
    text,
    roles,
  });
  return users;
};

export const getAllUsersApi = async () => {
  const {
    data: { users },
  } = await http.get("/users");
  return users;
};

export const getPaginatedUsersApi = async (params) => {
  const { page, search, roles } = params;

  const {
    data: { users, totalPages },
  } = await http.get("/users", { params: { page, search, roles } });
  return { users, totalPages };
};
