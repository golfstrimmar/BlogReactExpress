import { combineReducers, createStore, compose } from "redux";
import socketReducer from "./reducers/socketReducer";
import postReducer from "./reducers/postReducer";
import authReducer from "./reducers/authReducer";
import commentsReducer from "./reducers/commentReducer";
// const rootReducer = combineReducers({
//   socket: socketReducer,
//   posts: postReducer,
//   auth: authReducer,
//   comments: commentsReducer,
// });

// =================================
interface SocketState {
  socket: WebSocket | null; // Уточни тип сокета, если он у тебя конкретный
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

// 2. Общий тип состояния
export interface RootState {
  socket: SocketState;
  posts: PostsState;
  auth: AuthState;
  comments: CommentsState;
}

// 3. Типизируем rootReducer
const rootReducer = combineReducers({
  socket: socketReducer,
  posts: postReducer,
  auth: authReducer,
  comments: commentsReducer,
});

// 4. Тип для devTools (опционально, можно оставить как есть)
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => unknown; // Можно уточнить тип, если нужно
  }
}
// =================================

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__?.() || ((f: any) => f);

const store = createStore(
  rootReducer,
  compose(
    devTools // Добавляем поддержку Redux DevTools
    // Если у вас есть миддлвэры, их можно добавить здесь, например:
    // applyMiddleware(localStorageMiddleware)
  )
);

export default store;
