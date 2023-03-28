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

export const updateProfile = async (body) => {
  const { firstName, lastName, oldPassword, newPassword } = body;
const response = await http.put("/users/profile", {
    firstName,
    lastName,
    oldPassword,
    newPassword,
  });
  return response?.data?.user;
}

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

export const getPaginatedUsersApi = async (params) => {
  const { page, search, roles } = params;

  const {
    data: { users, totalPages },
  } = await http.get("/users", { params: { page, search, roles } });
  return { users, totalPages };
};

export const updateUserApi = async (userId, body) => {
  const { firstName, lastName, oldPassword, newPassword } = body;

  const {
    data: { user },
  } = await http.patch(`/users/${userId}`, {
    firstName,
    lastName,
    oldPassword,
    newPassword,
  });
  return user;
};

export const deleteUserApi = async (user) => {
  await http.delete(`/users/${user._id}`);
  return true;
};
