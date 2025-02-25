export const setUser = (payload) => {
  return {
    type: "SET_USER",
    payload,
  };
};

export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return { type: "LOGOUT_USER" };
};
