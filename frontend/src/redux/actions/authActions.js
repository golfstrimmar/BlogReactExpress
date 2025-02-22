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
// export const restoreAuth = () => {
//   const authData = JSON.parse(localStorage.getItem("auth"));
//   if (authData) {
//     return {
//       type: "RESTORE_AUTH",
//       payload: {
//         user: authData.user,
//         token: authData.token,
//         isAuthenticated: authData.isAuthenticated,
//       },
//     };
//   }

//   return { type: "LOGOUT_USER" };
// };
