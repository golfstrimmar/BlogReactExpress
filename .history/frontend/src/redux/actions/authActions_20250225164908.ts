// Структура объекта User
interface User {
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

// Структура payload для setUser
interface SetUserPayload {
  user: User | null;
  token: string | null;
}

// Типы констант
const SET_USER = "SET_USER" as const;
const LOGOUT_USER = "LOGOUT_USER" as const;

// Типы действий
interface SetUserAction {
  type: typeof SET_USER;
  payload: SetUserPayload;
}

interface LogoutUserAction {
  type: typeof LOGOUT_USER;
}

// Общий тип действий
export type AuthActionTypes = SetUserAction | LogoutUserAction;

// Действие setUser
export const setUser = (payload: SetUserPayload): SetUserAction => {
  return {
    type: SET_USER,
    payload,
  };
};

// Действие logoutUser
export const logoutUser = (): LogoutUserAction => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return { type: LOGOUT_USER };
};
