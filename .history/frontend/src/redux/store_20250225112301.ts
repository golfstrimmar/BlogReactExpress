import { combineReducers, createStore, compose, AnyAction } from "redux";
import socketReducer from "./reducers/socketReducer";
import postReducer from "./reducers/postReducer";
import authReducer from "./reducers/authReducer";
import commentsReducer from "./reducers/commentReducer";

// Типы состояния
interface SocketState {
  socket: WebSocket | null;
}

interface Post {
  _id: string;
  title: string;
  text: string;
  // ... другие поля
}

interface PostsState {
  posts: Post[];
}

interface User {
  _id: string;
  userName: string;
  // ... другие поля
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface Comment {
  _id: string;
  text: string;
  // ... другие поля
}

interface CommentsState {
  comments: Comment[];
}

export interface RootState {
  socket: SocketState;
  posts: PostsState;
  auth: AuthState;
  comments: CommentsState;
}

// Объявление типа для Redux DevTools
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => unknown; // Заменил any на unknown для строгости
  }
}

const rootReducer = combineReducers({
  socket: socketReducer,
  posts: postReducer,
  auth: authReducer,
  comments: commentsReducer,
});

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__?.() || ((f: any) => f);

const store = createStore<RootState, AnyAction, unknown, unknown>(
  rootReducer,
  compose(devTools)
);

export default store;
