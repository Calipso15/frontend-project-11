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

const initializeView = (initialState) => {
  const state = { ...initialState };
  function addRssFeed(inputValue, rssFeeds) {
    const input = document.getElementById('url-input');
    const feedback = document.querySelector('.feedback');

    state.isValid = true;
    state.errorMessage = '';

    try {
      validationSchema.validateSync({ rssFeedUrl: inputValue });
      if (rssFeeds.includes(inputValue)) {
        state.isValid = false;
        state.errorMessage = i18n.t(yupMessages.string.rssAlreadyExists);

        feedback.textContent = state.errorMessage;
        feedback.classList.remove('text-success');
        feedback.classList.add('text-danger');
        input.classList.add('is-invalid');
        input.focus();
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
            input.classList.add('is-invalid');
            feedback.classList.remove('text-success');
            feedback.classList.add('text-danger');
          }
          input.classList.remove('is-invalid');
          feedback.classList.add('text-success');
          feedback.classList.remove('text-danger');

          if (state.isValid) {
            state.rssFeeds.push(inputValue);
            loadRSSFeed(inputValue);
            feedback.textContent = i18n.t(yupMessages.string.rssLoaded);
            document.querySelector('.posts').innerHTML = '';
            document.querySelector('.feeds').innerHTML = '';
            feedback.classList.add('text-success');
            feedback.classList.remove('text-danger');
            input.focus();
            input.value = '';
          } else {
            feedback.textContent = state.errorMessage;
            feedback.classList.add('text-danger');
            feedback.classList.remove('text-success');
          }
        })
        .catch(() => {
          state.isValid = false;
          state.errorMessage = i18n.t(yupMessages.mixed.default);
          input.classList.add('is-invalid');
          feedback.classList.add('text-danger');
          feedback.classList.remove('text-success');
          input.focus();
        });
    } catch (error) {
      state.isValid = false;
      feedback.textContent = i18n.t(yupMessages.string.notCorrectUrl);
      state.errorMessage = '';
      feedback.classList.add('text-danger');
      feedback.classList.remove('text-success');
      input.classList.add('is-invalid');
      input.focus();
    }
  }

  const watchedState = onChange(state, (path) => {
    if (path === 'rssFeedUrl') {
      addRssFeed(state.rssFeedUrl, state.rssFeeds);
    }
  });

  return watchedState;
};

export default initializeView;
