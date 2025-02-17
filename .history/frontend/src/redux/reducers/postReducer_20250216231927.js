const initialState = {
  posts: [],
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return {
        ...state,
        posts: action.payload,
      };
    case "ADD_POST":
      return {
        ...state,
        posts: [action.payload, ...state.posts], // Добавляем новый пост в начало списка
      };
    default:
      return state;
  }
};

export default postReducer;
