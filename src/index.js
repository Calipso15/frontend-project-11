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
      watchedState.rssFeedUrl = inputValue;
    } else {
      watchedState.isValid = false;
      watchedState.errorMessage = i18n.t('string.notValue');
      showError(input, feedback, watchedState.errorMessage);
    }
  });
});
