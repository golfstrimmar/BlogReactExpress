export const setPosts = (posts) => ({
  type: "SET_POSTS",
  payload: posts,
});

export const addPost = (post) => ({
  type: "ADD_POST",
  payload: post,
});
