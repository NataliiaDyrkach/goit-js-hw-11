import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './sass/index.scss';
import requestImg from './js/request';
import refs from './js/refs';
import { createMarkupImg } from './js/createMarkup';

function renderCardImg(hits) {
  const markup = hits.map(item => createMarkupImg(item)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let inputValue = '';

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

async function onFormSubmit(e) {
  e.preventDefault();
  inputValue = e.currentTarget.searchQuery.value.trim();
  console.log(inputValue);
  currentPage = 1;

  if (inputValue === '') {
    Notify.failure('Please, write something');
    return;
  }

  const response = await requestImg(inputValue, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  } else {
    refs.loadMoreBtn.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      refs.gallery.innerHTML = '';
      renderCardImg(response.hits);
      lightbox.refresh();

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    if (response.totalHits === 0) {
      refs.gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.loadMoreBtn.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onClickLoadMoreBtn() {
  currentPage += 1;
  const response = await requestImg(inputValue, currentPage);
  renderCardImg(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits >= response.totalHits) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
