import http from "./http";

export const loginApi = async (body) => {
  const { email, password } = body;

  const {
    data: { user },
  } = await http.post("/login", { email, password });
  return user;
};
