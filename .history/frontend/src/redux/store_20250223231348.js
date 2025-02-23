import { combineReducers, createStore, compose } from "redux";
import socketReducer from "./reducers/socketReducer";
import postReducer from "./reducers/postReducer";
import authReducer from "./reducers/authReducer";
import commentsReducer from "./reducers/commentReducer";
const rootReducer = combineReducers({
  socket: socketReducer,
  posts: postReducer,
  auth: authReducer,
  comments: commentsReducer,
});
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__
  ? window.__REDUX_DEVTOOLS_EXTENSION__()
  : (f) => f;

const store = createStore(
  rootReducer,
  compose(
    devTools // Добавляем поддержку Redux DevTools
    // Если у вас есть миддлвэры, их можно добавить здесь, например:
    // applyMiddleware(localStorageMiddleware)
  )
);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
