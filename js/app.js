import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";

const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let page = 1;
let searchQuery = "";

const lightbox = new SimpleLightbox(".gallery a");

form.addEventListener("submit", handleFormSubmit);
window.addEventListener("scroll", throttle(handleScroll, 500));

function handleFormSubmit(event) {
  event.preventDefault();
  searchQuery = form.elements.searchQuery.value.trim();

  if (searchQuery === "") {
    return;
  }

  clearGallery();
  page = 1;
  searchImages();
}

function handleScroll() {
  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;

  if (scrollPosition >= pageHeight) {
    loadMoreImages();
  }
}

function searchImages() {
  axios
    .get(`https://pixabay.com/api/?key=37237642-602f5018f6edc6d1a99517278&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
    .then((response) => {
      const images = response.data.hits;
      const totalHits = response.data.totalHits;

      if (images.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
      }

      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

      appendImages(images);
      lightbox.refresh();
      scrollToNextGroup();
    })
    .catch((error) => {
      console.log(error);
    });
}

function appendImages(images) {
  const cards = images.map((image) => createImageCard(image));
  gallery.append(...cards);
}

function createImageCard(image) {
  const card = document.createElement("div");
  card.classList.add("photo-card");

  const link = document.createElement("a");
  link.href = image.largeImageURL;
  link.style.textDecoration = "none";
  link.style.color = "black";

  const img = document.createElement("img");
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = "lazy";

  const info = document.createElement("div");
  info.classList.add("info");

  const likes = createInfoItem("Likes", image.likes);
  const views = createInfoItem("Views", image.views);
  const comments = createInfoItem("Comments", image.comments);
  const downloads = createInfoItem("Downloads", image.downloads);

  info.append(likes, views, comments, downloads);
  link.append(img, info);
  card.appendChild(link);

  return card;
}

function createInfoItem(label, value) {
  const item = document.createElement("p");
  item.classList.add("info-item");
  item.innerHTML = `<b>${label}:</b> ${value}`;

  return item;
}

function clearGallery() {
  gallery.innerHTML = "";
}

function loadMoreImages() {
  page += 1;
  searchImages();
}

function scrollToNextGroup() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

function throttle(func, delay) {
    let timeoutId;
    let lastExecutedTime = 0;
  
    return function (...args) {
      const currentTime = Date.now();
  
      if (currentTime - lastExecutedTime > delay) {
        clearTimeout(timeoutId);
        lastExecutedTime = currentTime;
        func.apply(this, args);
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          lastExecutedTime = currentTime;
          func.apply(this, args);
        }, delay);
      }
    };
  }
  
