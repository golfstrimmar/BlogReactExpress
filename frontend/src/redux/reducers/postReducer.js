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
      console.log("===--- ADD_POST ---====", action.payload);
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
    case "DELETE_POST":
      const AfterDELETEPost = state.posts.filter(
        (post) => post._id !== action.payload
      );
      return {
        ...state,
        posts: AfterDELETEPost,
      };
    default:
      return state;
  }
};

export default postReducer;
