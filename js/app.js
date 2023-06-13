import { handleFormSubmit, handleScroll } from "./utils";

const form = document.getElementById("search-form");
form.addEventListener("submit", (event) => handleFormSubmit(event, form));
window.addEventListener("scroll", throttle(handleScroll, 500));

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
