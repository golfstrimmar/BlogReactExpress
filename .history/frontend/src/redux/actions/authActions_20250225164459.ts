interface User {
  _id?: string;
  userName?: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  
  passwordHash?: string;
}

// Типы действий (Action Types)
const SET_USER = "SET_USER" as const;
const LOGOUT_USER = "LOGOUT_USER" as const;

// Интерфейсы для каждого действия
interface SetUserAction {
  type: typeof SET_USER;
  payload: User | null; // Предполагаем, что payload — это объект пользователя или null
}

interface LogoutUserAction {
  type: typeof LOGOUT_USER;
}

// Общий тип для всех действий (union type)
export type AuthActionTypes = SetUserAction | LogoutUserAction;

// Действие для установки пользователя
export const setUser = (payload: User | null): SetUserAction => {
  return {
    type: SET_USER,
    payload,
  };
};

// Действие для выхода пользователя
export const logoutUser = (): LogoutUserAction => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return { type: LOGOUT_USER };
};
