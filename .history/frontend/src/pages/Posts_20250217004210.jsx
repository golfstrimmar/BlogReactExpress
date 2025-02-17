import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Post from "../components/Post/Post";
import "./Posts.scss";

const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);

  // Состояние для текущей страницы и выбранного типа сортировки
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("dateDesc"); // "dateDesc", "dateAsc", "tags"

  const postsPerPage = 10;

  // Вычисляем индекс последнего поста на текущей странице
  const indexOfLastPost = currentPage * postsPerPage;
  // Вычисляем индекс первого поста на текущей странице
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // Получаем посты для текущей страницы
  const currentPosts = useMemo(() => {
    let sortedPosts = [...posts]; // Создаем копию массива постов для сортировки

    // Сортировка
    if (sortOption === "dateDesc") {
      sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Сортировка по убыванию даты
    } else if (sortOption === "dateAsc") {
      sortedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Сортировка по возрастанию даты
    } else if (sortOption === "tags") {
      // Сортировка по тегам, например, сначала посты с определенным тегом
      sortedPosts = sortedPosts.filter((post) =>
        post.tags.includes("adventure")
      );
    }

    return sortedPosts.slice(indexOfFirstPost, indexOfLastPost); // Возвращаем только посты для текущей страницы
  }, [posts, currentPage, sortOption]); // Зависят от этих переменных

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

        {/* Сортировка */}
        <div className="sorting">
          <button onClick={() => setSortOption("dateDesc")}>
            Sort by Date (Newest)
          </button>
          <button onClick={() => setSortOption("dateAsc")}>
            Sort by Date (Oldest)
          </button>
          <button onClick={() => setSortOption("tags")}>
            Sort by Adventure Tag
          </button>
        </div>

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
