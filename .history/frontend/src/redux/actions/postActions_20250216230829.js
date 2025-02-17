import axios from 'axios';

export const setPosts = (posts) => ({
  type: 'SET_POSTS',
  payload: posts,
});

export const loadPosts = () => {
  return async (dispatch) => {
    try {
      // Выполним запрос к серверу для получения всех постов
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
      dispatch(setPosts(response.data)); // Сохраняем посты в Redux
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };
};
