import React, { useState } from "react";
import { useSelector } from "react-redux";
import Post from "../components/Post/Post";
import "./Posts.scss";

const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);

  // Состояние для текущей страницы
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // Количество постов на одной странице

  // Вычисляем индекс последнего поста на текущей странице
  const indexOfLastPost = currentPage * postsPerPage;
  // Вычисляем индекс первого поста на текущей странице
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // Получаем посты для текущей страницы
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Функция для перехода на предыдущую страницу
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Функция для перехода на следующую страницу
  const nextPage = () => {
    const totalPages = Math.ceil(posts.length / postsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Количество страниц
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <section className="posts">
      <div className="container">
        <h1>Posts</h1>
        <div className="posts-list">
          {currentPosts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>

        {/* Пагинация */}
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default Posts;
