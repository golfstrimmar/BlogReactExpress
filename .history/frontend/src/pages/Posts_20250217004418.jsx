import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Post from "../components/Post/Post";
import "./Posts.scss";

const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);

  // Состояние для текущей страницы и выбранных тегов
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]); // Массив выбранных тегов

  const postsPerPage = 10;

  // Вычисляем индекс последнего поста на текущей странице
  const indexOfLastPost = currentPage * postsPerPage;
  // Вычисляем индекс первого поста на текущей странице
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // Функция для фильтрации постов по выбранным тегам
  const filterPostsByTags = (posts, selectedTags) => {
    if (selectedTags.length === 0) return posts; // Если нет выбранных тегов, возвращаем все посты

    return posts.filter((post) => {
      // Проверяем, содержит ли хотя бы один тег из выбранных
      return selectedTags.some((tag) => post.tags.includes(tag));
    });
  };

  // Получаем посты для текущей страницы с фильтрацией по тегам
  const currentPosts = useMemo(() => {
    const filteredPosts = filterPostsByTags(posts, selectedTags);
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost); // Возвращаем только посты для текущей страницы
  }, [posts, currentPage, selectedTags]); // Зависят от этих переменных

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

  // Функция для обновления выбранных тегов
  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTags((prev) => {
      if (checked) {
        // Если тег выбран, добавляем его в список
        return [...prev, value];
      } else {
        // Если тег снят, удаляем его из списка
        return prev.filter((tag) => tag !== value);
      }
    });
  };

  // Список доступных тегов для фильтрации
  const availableTags = ["trip", "mobile", "adventure", "nature", "technology"];

  return (
    <section className="posts">
      <div className="container">
        <h1>Posts</h1>

        {/* Фильтрация по тегам */}
        <div className="tag-filter">
          <h3>Filter by Tags</h3>
          <div className="tags-checkbox">
            {availableTags.map((tag) => (
              <div key={tag}>
                <input
                  type="checkbox"
                  id={tag}
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={handleTagChange}
                />
                <label htmlFor={tag}>{tag}</label>
              </div>
            ))}
          </div>
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
