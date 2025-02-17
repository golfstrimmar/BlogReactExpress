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
        posts: [action.payload, ...state.posts],
      };
    case "EDIT_POST":
      const newPosts = state.posts.map((post) =>
        post._id === action.payload._id ? { ...post, ...action.payload } : post
      );
      return {
        ...state,
        posts: newPosts,
      };
    default:
      return state;
  }
};

export default postReducer;
