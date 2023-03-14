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
