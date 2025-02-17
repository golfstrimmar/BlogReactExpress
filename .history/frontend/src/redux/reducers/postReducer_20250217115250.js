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
    case UPDATE_PRODUCT:
      return state.map((product) =>
        product._id === action.payload._id
          ? { ...product, ...action.payload }
          : product
      ); // Обновляем продукт по id
    default:
      return state;
  }
};

export default postReducer;
