import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import loadRSSFeed from './postload';
import yupMessages from './message';

const validationSchema = yup.object().shape({
  rssFeedUrl: yup
    .string()
    .url(yupMessages.string.notCorrectUrl)
    .required('Обязательное поле'),
});
i18n.init({ lng: 'ru', debug: true, resources: { yupMessages } });

const showError = (input, feedback, errorMessage) => {
  const feedbackError = feedback;
  input.classList.add('is-invalid');
  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');
  feedbackError.textContent = errorMessage;
  input.focus();
};

const showSuccess = (input, feedback, successMessage) => {
  const feedbackShow = feedback;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedbackShow.textContent = successMessage;
};
const handleErrors = (state, input, feedback, errorMessage) => {
  const stateErrors = state;
  stateErrors.isValid = false;
  stateErrors.errorMessage = errorMessage;
  showError(input, feedback, errorMessage);
};

const initializeView = (initialState) => {
  const state = { ...initialState };
  const addRssFeed = (inputValue, rssFeeds) => {
    const input = document.getElementById('url-input');
    const feedback = document.querySelector('.feedback');

    state.isValid = true;
    state.errorMessage = '';

    try {
      validationSchema.validateSync({ rssFeedUrl: inputValue });
      if (rssFeeds.includes(inputValue)) {
        state.isValid = false;
        state.errorMessage = i18n.t(yupMessages.string.rssAlreadyExists);

        showError(input, feedback, state.errorMessage);
        return;
      }
      const corsProxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(inputValue)}`;
      fetch(corsProxyUrl)
        .then((response) => response.json())
        .then((data) => {
          const htmlCode = data.contents;
          if (!htmlCode.includes('<rss')) {
            state.isValid = false;
            state.errorMessage = i18n.t(yupMessages.string.notValidateUrl);
            showError(input, feedback, state.errorMessage);
          } else {
            showSuccess(input, feedback, i18n.t(yupMessages.string.rssLoaded));
            input.focus();
            input.value = '';
          }
          if (state.isValid) {
            state.rssFeeds.push(inputValue);
            loadRSSFeed(inputValue);
            document.querySelector('.posts').innerHTML = '';
            document.querySelector('.feeds').innerHTML = '';
          }
        })
        .catch(() => {
          handleErrors(state, input, feedback, i18n.t(yupMessages.mixed.default));
        });
    } catch (error) {
      handleErrors(state, input, feedback, i18n.t(yupMessages.string.notCorrectUrl));
    }
  };
  const watchedState = onChange(state, (path) => {
    if (path === 'rssFeedUrl') {
      addRssFeed(state.rssFeedUrl, state.rssFeeds, state);
    }
  });

  return watchedState;
};

export default initializeView;
