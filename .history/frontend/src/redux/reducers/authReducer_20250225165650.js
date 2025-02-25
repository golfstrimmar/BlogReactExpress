// authReducer.ts
import { AuthActionTypes } from "../actions/authActions";

// Тип для структуры пользователя
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

// Тип состояния
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Начальное состояние с типизацией localStorage
const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};
// Редуктор с типами
const authReducer = (
  state: AuthState = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "LOGOUT_USER":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case "RESTORE_AUTH":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: action.payload.isAuthenticated,
      };
    default:
      return state;
  }
};

export default authReducer;
