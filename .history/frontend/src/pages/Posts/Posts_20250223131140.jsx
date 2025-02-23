import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "../../components/Post/Post";
import "./Posts.scss";
import Select from "../../components/Select/Select";
import { ReactComponent as ShevronLeft } from "../../assets/svg/chevron-left.svg";
import { ReactComponent as ShevronRight } from "../../assets/svg/chevron-right.svg";
const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const selectItems = [
    { name: "Newest First", value: "desc" },
    { name: "Oldest First", value: "asc" },
  ];

  // ==============================

  // // ==============================
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

  // Функция для сортировки постов по дате
  const sortPostsByDate = (posts, sortOrder) => {
    return posts.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      // Если сортировка по возрастанию, то сортируем по старым датам сначала
      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        // Если сортировка по убыванию, то новые посты будут первыми
        return dateB - dateA;
      }
    });
  };

  // Получаем посты для текущей страницы с фильтрацией по тегам и сортировкой по дате
  const currentPosts = useMemo(() => {
    const filteredPosts = filterPostsByTags(posts, selectedTags);
    const sortedPosts = sortPostsByDate(filteredPosts, sortOrder);
    return sortedPosts.slice(indexOfFirstPost, indexOfLastPost); // Возвращаем только посты для текущей страницы
  }, [posts, currentPage, selectedTags, sortOrder]); // Зависят от этих переменных

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
  const availableTags = ["trip", "mobile", "adventure"];
  // ---------------------

  return (
    <section className="posts">
      <div className="container">
        <h1>Posts</h1>
        {currentPosts.length > 0 ? (
          <div className="posts-filters">
            {/* Фильтрация по тегам */}
            <div className="tag-filter">
              <h3>Filter by Tags</h3>
              <div className="tags-checkbox fildset-checkbox">
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
            {/* Сортировка по дате */}
            <div className="sort-order">
              <h3>Sort by Date</h3>
              <Select setSortOrder={setSortOrder} selectItems={selectItems} />
            </div>
          </div>
        ) : (
          <div className="posts-message">
            <h2>Posts not found</h2>
          </div>
        )}

        <div className="posts-list">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => <Post key={post._id} post={post} />)
          ) : (
            <div className="posts-message">
              <h2>Posts not found</h2>
            </div>
          )}
        </div>
        {/* Пагинация */}
        {currentPosts.length > 0 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ShevronLeft />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-button"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ShevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Posts;
