const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ALL_COMMENTS":
      return {
        ...state,
        comments: action.payload,
      };
    case "ADD_COMMENT":
      console.log("Adding comment:", action.payload);
      if (
        state.comments.some((comment) => comment._id === action.payload._id)
      ) {
        return state;
      }
      return {
        ...state,
        comments: [...state.comments, action.payload],
      };

    case "EDIT_COMMENT":
      const newCOMMENTS = state.comments.map((comment) =>
        comment._id === action.payload._id
          ? { ...comment, ...action.payload }
          : comment
      );
      return {
        ...state,
        comments: newCOMMENTS,
      };
    case "DELETE_COMMENT":
      const AfterDELETECOMMENT = state.comments.filter(
        (comment) => comment._id !== action.payload
      );
      return {
        ...state,
        comments: AfterDELETECOMMENT,
      };
    default:
      return state;
  }
};

export default commentsReducer;
