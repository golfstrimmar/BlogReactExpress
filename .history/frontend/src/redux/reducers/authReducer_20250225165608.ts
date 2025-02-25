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
const storedUser = localStorage.getItem("user");
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
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
