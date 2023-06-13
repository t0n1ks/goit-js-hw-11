import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector(".gallery");
const lightbox = new SimpleLightbox(".gallery a");

let searchQuery = "";
let page = 1;
let endOfResults = false;

export async function handleFormSubmit(event, form) {
  event.preventDefault();
  searchQuery = form.elements.searchQuery.value.trim();

  if (searchQuery === "") {
    return;
  }

  clearGallery();
  page = 1;
  endOfResults = false;
  await searchImages(searchQuery);
}

export function handleScroll() {
  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;

  if (scrollPosition >= pageHeight && !endOfResults) {
    loadMoreImages();
  }
}

export function clearGallery() {
  gallery.innerHTML = "";
}

export async function loadMoreImages() {
  if (endOfResults) {
    return;
  }

  page += 1;
  await searchImages(searchQuery);
}

export function scrollToNextGroup() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

async function searchImages(searchQuery) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=37237642-602f5018f6edc6d1a99517278&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    const images = response.data.hits;
    const totalHits = response.data.totalHits;

    if (page !== 1 && images.length === 0) {
      Notiflix.Notify.info("You've reached the end of the results.");
      endOfResults = true;
      return;
    }

    if (images.length === 0) {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    appendImages(images);
    lightbox.refresh();
    scrollToNextGroup();
  } catch (error) {
    console.log(error);
  }
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
