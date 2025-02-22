export const allComments = (comments) => ({
  type: "ALL_COMMENTS",
  payload: comments,
});
export const addComment = (comment) => ({
  type: "ADD_COMMENT",
  payload: comment,
});

export const editComment = (comment) => ({
  type: "EDIT_COMMENT",
  payload: comment,
});
export const deleteComment = (id) => ({
  type: "DELETE_COMMENT",
  payload: id,
});
