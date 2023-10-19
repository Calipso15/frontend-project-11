import './styles.scss';
import i18n from './init';
import watchedState from './view';
import { showError } from './feedback';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.rss-form');
  const input = document.getElementById('url-input');
  const feedback = document.querySelector('.feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = input.value.trim();
    if (inputValue) {
      if (watchedState.rssFeeds.includes(inputValue)) {
        watchedState.isValid = false;
        watchedState.errorMessage = i18n.t('string.rssAlreadyExists');
        showError(input, feedback, watchedState.errorMessage);
      } else {
        watchedState.isValid = true;
        watchedState.errorMessage = '';
        watchedState.rssFeedUrl = inputValue;
        input.value = '';
      }
    } else {
      watchedState.isValid = false;
      watchedState.errorMessage = i18n.t('string.notValue');
      showError(input, feedback, watchedState.errorMessage);
    }
  });
});
