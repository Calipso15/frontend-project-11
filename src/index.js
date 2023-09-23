import './styles.scss';
import initializeView from './view';

const state = {
  rssFeedUrl: '',
  isValid: true,
  errorMessage: '',
  rssFeeds: [],
};
initializeView(state);
const watchedState = initializeView(state);
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.rss-form');
  const input = document.getElementById('url-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = input.value.trim();
    if (inputValue) {
      watchedState.rssFeedUrl = inputValue;
    } else {
      watchedState.isValid = false;
      watchedState.errorMessage = '';
    }
  });
});
