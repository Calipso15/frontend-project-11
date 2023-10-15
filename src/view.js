import onChange from 'on-change';
import * as yup from 'yup';
import i18n from './init';
import loadRSSFeed from './parser';
import { showError, showSuccess } from './feedback';

const validationSchema = yup.object().shape({
  rssFeedUrl: yup
    .string()
    .url(i18n.t('string.notCorrectUrl'))
    .required('Обязательное поле'),
});

const state = {
  rssFeedUrl: '',
  isValid: true,
  errorMessage: '',
  rssFeeds: [],
};

const handleErrors = (input, feedback, errorMessage) => {
  state.isValid = false;
  state.errorMessage = errorMessage;
  showError(input, feedback, errorMessage);
};

const fetchAndHandleResponse = (inputValue, input, feedback) => {
  const corsProxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(inputValue)}`;

  return fetch(corsProxyUrl)
    .then((response) => response.json())
    .then((data) => {
      const htmlCode = data.contents;
      if (!htmlCode.includes('<rss')) {
        state.isValid = false;
        state.errorMessage = i18n.t('string.notValidateUrl');
        showError(input, feedback, state.errorMessage);
      } else {
        showSuccess(input, feedback, i18n.t('string.rssLoaded'));
        input.focus();
        const inputVal = input;
        inputVal.value = '';
      }
      if (state.isValid) {
        state.rssFeeds.push(inputValue);
        loadRSSFeed(inputValue);
        document.querySelector('.posts').innerHTML = '';
        document.querySelector('.feeds').innerHTML = '';
      }
    })
    .catch(() => {
      handleErrors(input, feedback, i18n.t('mixed.default'));
    });
};

const input = document.getElementById('url-input');
const feedback = document.querySelector('.feedback');

const watchedState = onChange(state, (path) => {
  if (path === 'rssFeedUrl') {
    const inputValue = state.rssFeedUrl.trim();
    state.isValid = true;
    state.errorMessage = '';

    try {
      validationSchema.validateSync({ rssFeedUrl: inputValue });
      if (state.rssFeeds.includes(inputValue)) {
        state.isValid = false;
        state.errorMessage = i18n.t('string.rssAlreadyExists');

        showError(input, feedback, state.errorMessage);
        return;
      }

      fetchAndHandleResponse(inputValue, input, feedback);
    } catch (error) {
      handleErrors(input, feedback, i18n.t('string.notCorrectUrl'));
    }
  }
});

export default watchedState;
