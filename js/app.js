import axios from "axios";
import Notiflix from "notiflix";

let currentPage = 1;
let currentQuery = '';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// Функція для виконання запиту за зображеннями
async function searchImages(query, page = 1) {
  const apiKey = '37237642-602f5018f6edc6d1a99517278'; // Вставте свій унікальний ключ доступу
  const perPage = 40;

  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    return null;
  }
}

// Функція для очищення галереї
function clearGallery() {
  gallery.innerHTML = '';
}

// Функція для рендерингу карток зображень
function renderImages(images) {
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.append(likes, views, comments, downloads);
    card.append(img, info);
    gallery.appendChild(card);
  });
}

// Функція для показу повідомлення про кінець результатів
function showEndMessage() {
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}

// Обробник події для форми пошуку
searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const query = formData.get('searchQuery');

  if (query.trim() === '') {
    return;
  }

  // Очистити галерею та скинути поточну сторінку
  clearGallery();
  currentPage = 1;
  currentQuery = query;

  // Виконати пошук зображень
  const data = await searchImages(query);
  if (data && data.hits.length > 0) {
    renderImages(data.hits);
    loadMoreBtn.classList.remove('hidden');
  } else {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    loadMoreBtn.classList.add('hidden');
  }
});

// Обробник події для кнопки "Load more"
loadMoreBtn.addEventListener('click', async () => {
  currentPage++;

  const data = await searchImages(currentQuery, currentPage);
  if (data && data.hits.length > 0) {
    renderImages(data.hits);
  } else {
    loadMoreBtn.classList.add('hidden');
    showEndMessage();
  }
});

