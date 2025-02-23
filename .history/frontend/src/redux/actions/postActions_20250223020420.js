export const setPosts = (posts) => ({
  type: "SET_POSTS",
  payload: posts,
});

export const addPost = (post) => ({
  type: "ADD_POST",
  payload: post,
});
export const editPost = (post) => ({
  type: "EDIT_POST",
  payload: post,
});
export const deletePost = (id) => ({
  type: "DELETE_POST",
  payload: id,
});
export const closePost = (id) => ({
  type: "DELETE_POST",
  payload: id,
});
