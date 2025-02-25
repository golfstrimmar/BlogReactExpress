// authActions.ts
export interface User {
  _id: string;
  userName: string;
  email?: string;
  passwordHash?: string;
  avatar?: string;
  googleId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface SetUserPayload {
  user: User | null;
  token: string | null;
}

const SET_USER = "SET_USER" as const;
const LOGOUT_USER = "LOGOUT_USER" as const;

interface SetUserAction {
  type: typeof SET_USER;
  payload: SetUserPayload;
}

interface LogoutUserAction {
  type: typeof LOGOUT_USER;
}

export type AuthActionTypes = SetUserAction | LogoutUserAction;

export const setUser = (payload: SetUserPayload): SetUserAction => {
  return {
    type: SET_USER,
    payload,
  };
};

export const logoutUser = (): LogoutUserAction => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return { type: LOGOUT_USER };
};
